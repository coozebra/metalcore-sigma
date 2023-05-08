import styled, { css } from 'styled-components';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useState } from 'react';
import getConfig from 'next/config';

import { Small, Text } from 'shared/text';
import { useWeb3 } from 'web3/providers/Web3Provider';
import { Pulse } from 'shared/components/Pulse';
import { Tooltip } from 'shared/components/Tooltip';
import { SOCIAL } from 'shared/enums/social';
import { useSaleStep, useSaleMintedPresale, useSaleMinted } from 'sale/hooks';
import { SaleStep } from 'sale/enums/SaleStep';
import { usePresale } from 'presale/providers/PresaleProvider';

export const Timeline = ({ type }: { type: 'presale' | 'sale' }) => {
  const { publicRuntimeConfig } = getConfig();

  const PRESALE_CONTRACT = publicRuntimeConfig.PRESALE_CONTRACT_ADDRESS as string;
  const SALE_CONTRACT = publicRuntimeConfig.SALE_CONTRACT_ADDRESS as string;

  const isPresale = type === 'presale';
  const { account } = useWeb3();
  const router = useRouter();
  const [tooltip, setTooltip] = useState('');

  const { asPath } = router;

  const { data: step } = useSaleStep(isPresale ? PRESALE_CONTRACT : SALE_CONTRACT);
  const { data: userPresaleMintedAmount = 0 } = useSaleMintedPresale(PRESALE_CONTRACT);
  const { data: userSaleMintedAmount = 0 } = useSaleMinted(SALE_CONTRACT);
  const { whitelist } = usePresale();

  const connected = typeof account === 'string';
  const whitelisted = isPresale ? !!whitelist?.signature : false;

  const available = isPresale
    ? connected && whitelisted && step === SaleStep.PRESALE
    : connected && step === SaleStep.SALE;

  const handleTooltip = (icon: string) => {
    setTooltip(icon);
  };

  return (
    <Timeline.WrapperContainer>
      <Timeline.Wrapper onMouseLeave={() => handleTooltip('')}>
        <Timeline.IconWrapper $clickable={false}>
          <Image src="/icons/timeline-start-icon.svg" height="33" width="33" alt="timeline" />
        </Timeline.IconWrapper>

        <Timeline.Divider />

        <Timeline.IconWrapper $clickable onMouseEnter={() => handleTooltip('connectWallet')}>
          <Timeline.Image
            src="/icons/connect-wallet-icon.svg"
            height="25"
            width="25"
            alt="connect wallet"
            $success={connected}
          />

          {!connected && <Timeline.Pulse $success={connected} />}

          <Timeline.Title>{connected ? 'wallet connected' : 'connect wallet'}</Timeline.Title>

          {tooltip === 'connectWallet' && !connected && (
            <Timeline.Tooltip onClose={() => handleTooltip('')}>
              <Timeline.TooltipText>
                Please connect your wallet using the top right button to check whitelist status.
              </Timeline.TooltipText>
            </Timeline.Tooltip>
          )}
        </Timeline.IconWrapper>

        <Timeline.Divider />

        {isPresale && (
          <>
            <Timeline.IconWrapper $clickable onMouseEnter={() => handleTooltip('whitelisted')}>
              <Timeline.Image
                src="/icons/whitelist-icon.svg"
                height="25"
                width="25"
                alt="whitelisted"
                $success={connected && whitelisted}
                $default={!connected}
              />

              {connected && !whitelisted && <Timeline.Pulse $success={connected && whitelisted} />}

              <Timeline.Title>{whitelisted ? 'whitelisted' : 'whitelist'}</Timeline.Title>

              {tooltip === 'whitelisted' && (
                <Timeline.Tooltip onClose={() => handleTooltip('')}>
                  <>
                    <Timeline.TooltipText>How to get whitelisted:</Timeline.TooltipText>
                    <br />
                    <Timeline.TooltipText>
                      1.&nbsp;
                      <Timeline.Link
                        href={SOCIAL.discord.url}
                        aria-label="discord"
                        target="_blank"
                        rel="noreferrer"
                      >
                        Join our Discord.
                      </Timeline.Link>
                    </Timeline.TooltipText>
                    <br />
                    <Timeline.TooltipText>2. Participate in Discord games.</Timeline.TooltipText>
                  </>
                </Timeline.Tooltip>
              )}
            </Timeline.IconWrapper>

            <Timeline.Divider />

            <Timeline.IconWrapper $clickable onMouseEnter={() => handleTooltip('presale')}>
              <Link href="/" aria-label="presale">
                <Timeline.Image
                  src="/icons/buy-icon.svg"
                  height="25"
                  width="25"
                  alt="buy"
                  $success={available}
                  $default={!connected || !whitelisted}
                />

                {connected && asPath.includes('/presale') && (
                  <Timeline.Pulse $success={available} />
                )}

                <Timeline.Title>presale</Timeline.Title>

                {tooltip === 'presale' && (
                  <Timeline.Tooltip onClose={() => handleTooltip('')}>
                    <Timeline.TooltipText>
                      Once whitelisted the presale is the first opportunity to mint up to 1 NFT.
                    </Timeline.TooltipText>
                  </Timeline.Tooltip>
                )}
              </Link>
            </Timeline.IconWrapper>
          </>
        )}

        {!isPresale && (
          <Timeline.IconWrapper $clickable onMouseEnter={() => handleTooltip('sale')}>
            <Link href="/" aria-label="sale">
              <Timeline.Image
                src="/icons/buy-icon.svg"
                height="25"
                width="25"
                alt="buy"
                $success={available}
                $default={!connected}
              />

              {connected && <Timeline.Pulse $success={available} />}

              <Timeline.Title>sale</Timeline.Title>

              {tooltip === 'sale' && (
                <Timeline.Tooltip onClose={() => handleTooltip('')}>
                  <Timeline.TooltipText>Opportunity to mint up to 1 NFT.</Timeline.TooltipText>
                </Timeline.Tooltip>
              )}
            </Link>
          </Timeline.IconWrapper>
        )}

        <Timeline.Divider />

        <Timeline.IconWrapper $clickable>
          <Link href="/nfts" aria-label="nfts">
            <Timeline.Image
              src="/icons/nft-icon.svg"
              height="25"
              width="25"
              alt="nft"
              $success={connected && (userPresaleMintedAmount > 0 || userSaleMintedAmount > 0)}
              $default={!connected}
            />

            {connected && asPath === '/nfts' && (
              <Timeline.Pulse
                $success={connected && (userPresaleMintedAmount > 0 || userSaleMintedAmount > 0)}
              />
            )}

            <Timeline.Title>view your nfts</Timeline.Title>
          </Link>
        </Timeline.IconWrapper>

        <Timeline.Divider />

        <Timeline.IconWrapper $clickable={false}>
          <Image src="/icons/coming-soon-icon.png" height="40" width="90" alt="coming soon" />
        </Timeline.IconWrapper>

        <Timeline.Divider />

        <Timeline.IconWrapper $clickable={false}>
          <Image src="/icons/timeline-end-icon.svg" height="33" width="33" alt="timeline" />
        </Timeline.IconWrapper>
      </Timeline.Wrapper>
    </Timeline.WrapperContainer>
  );
};

Timeline.WrapperContainer = styled.div`
  width: 100vw;
  overflow: scroll;

  /* Hide scrollbar for Chrome, Safari and Opera */
  &::-webkit-scrollbar {
    -webkit-appearance: none;
    display: none;
  }

  /* Hide scrollbar for IE, Edge and Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
`;

Timeline.Wrapper = styled.div`
  padding: 60px 3% 120px 3%;
  background: ${({ theme }) => theme.colors.darkBlack};
  display: flex;
  justify-content: space-between;
  align-items: center;
  overflow: hidden;

  @media (min-width: ${({ theme }) => theme.breakpoints.small}px) {
    min-width: ${({ theme }) => theme.breakpoints.extraLarge}px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.small}px) {
    width: 300vw;
  }
`;

Timeline.IconWrapper = styled.div<{ $clickable: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  width: 8vw;
  height: 50px;

  ${({ $clickable }) =>
    $clickable
      ? css`
          cursor: pointer;
        `
      : css`
          cursor: default;
        `}

  a {
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    text-decoration: none;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.small}px) {
    height: 10vh;
    width: 100%;

    a {
      width: 100%;
    }
  }
`;

Timeline.Pulse = styled(Pulse)<{ $success?: boolean }>`
  display: flex;
  justify-content: center;
  align-items: baseline;
  position: relative;
  top: 20px;

  ${({ $success }) =>
    $success
      ? css`
          div {
            background: ${({ theme }) => theme.colors.green};
          }
        `
      : css`
          div {
            background: ${({ theme }) => theme.colors.red};
          }
        `}
`;

Timeline.Image = styled(Image)<{ $success?: boolean; $default?: boolean }>`
  cursor: pointer;
  z-index: 1;

  ${({ $success }) =>
    $success
      ? css`
          filter: brightness(0) saturate(100%) invert(70%) sepia(97%) saturate(1479%)
            hue-rotate(107deg) brightness(111%) contrast(102%);
        `
      : css`
          filter: brightness(0) saturate(100%) invert(81%) sepia(60%) saturate(5901%)
            hue-rotate(320deg) brightness(100%) contrast(99%);
        `}

  ${({ $default }) =>
    $default &&
    css`
      filter: brightness(0) saturate(100%) invert(51%) sepia(1%) saturate(1358%) hue-rotate(320deg)
        brightness(86%) contrast(78%);
    `}
`;

Timeline.Divider = styled.span`
  border-top: 1px ${({ theme }) => theme.colors.lightGray} solid;
  height: 1px;
  width: 3vw;

  @media (max-width: ${({ theme }) => theme.breakpoints.small}px) {
    width: 20vw;
    padding: 0 20px;
  }
`;

Timeline.Title = styled(Small)`
  color: ${({ theme }) => theme.colors.white};
  text-transform: uppercase;
  font-size: 14px;
  text-align: center;
  width: 12vw;

  @media (max-width: ${({ theme }) => theme.breakpoints.small}px) {
    width: 100%;
    bottom: 15px;
  }
`;

Timeline.Tooltip = styled(Tooltip)`
  padding: 5px 20px;
  width: 210px;
`;

Timeline.TooltipText = styled(Text)`
  font-size: 12px;
  text-transform: none;
  line-height: 0;
`;

Timeline.Link = styled.a`
  display: inline-block !important;
`;
