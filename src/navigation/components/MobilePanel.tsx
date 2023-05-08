import styled, { css } from 'styled-components';
import { useRef, useEffect } from 'react';
import { disableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock';
import getConfig from 'next/config';

import { Link } from 'shared/text';
import { ETHBalance } from 'web3/components/ETHBalance';
import { Button } from 'shared/components/Button';
import { isExpired } from 'shared/utils/date';
import { Avatar } from 'shared/components/Avatar';
import { DropdownMenu } from 'shared/components/DropdownMenu';

export const MobilePanel = () => {
  const { publicRuntimeConfig } = getConfig();
  const ref = useRef(null);

  const PRESALE_START_DATE = publicRuntimeConfig.PRESALE_START_DATE as string;
  const SALE_START_DATE = publicRuntimeConfig.SALE_START_DATE as string;

  useEffect(() => {
    setTimeout(() => disableBodyScroll(ref?.current));

    return () => clearAllBodyScrollLocks();
  }, []);

  return (
    <MobilePanel.Wrapper ref={ref}>
      <MobilePanel.EthBalance />
      <MobilePanel.LinkRow>
        <MobilePanel.Link
          aria-label="mainsite"
          href="https://metalcore.gg"
          target="_blank"
          rel="noreferrer"
        >
          mainsite
        </MobilePanel.Link>
        {isExpired(PRESALE_START_DATE) && !isExpired(SALE_START_DATE) && (
          <MobilePanel.Link href="/presale" aria-label="presale">presale</MobilePanel.Link>
        )}
        {/* TODO: uncomment when sale is set */}
        {/* {isExpired(SALE_START_DATE) && (
          <MobilePanel.NextLink href="/sale" passHref>
            <MobilePanel.Link aria-label="sale">public sale</MobilePanel.Link>
          </MobilePanel.NextLink>
        )} */}

        {/* TODO: uncomment when leaderboard is ready */}
        {/* <Link href="/leaderboard" passHref>
          <MobilePanel.Link aria-label="presale">leaderboard</MobilePanel.Link>
        </Link> */}
        <MobilePanel.Link href="/nfts" aria-label="nfts">your nfts</MobilePanel.Link>
        <MobilePanel.Link
          aria-label="support"
          href="https://support.metalcore.gg"
          target="_blank"
          rel="noreferrer"
        >
          support
        </MobilePanel.Link>
      </MobilePanel.LinkRow>
    </MobilePanel.Wrapper>
  );
};

MobilePanel.Wrapper = styled.div`
  justify-content: center;
  display: grid;
  grid-auto-rows: min-content;
  padding: 24px 0;
  position: absolute;
  left: 0;
  top: 94px;
  height: calc(100vh - 94px);
  width: 100vw;
  background: rgba(0, 0, 0, 0.9);
  color: ${({ theme }) => theme.colors.white};
`;

MobilePanel.LinkRow = styled.div`
  display: flex;
  justify-content: space-between;
  text-align: center;
  flex-direction: column;
  width: 100%;
  background: ${({ theme }) => theme.colors.darkBlack};
`;

MobilePanel.Link = styled(Link)`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.green};
  text-decoration: none;

  @media (max-width: ${({ theme }) => theme.breakpoints.large}px) {
    margin: 3vh 0;
    font-size: 2em;
  }
`;

MobilePanel.LoginButton = styled(Button)`
  flex-grow: 0;
  width: 100px;
`;

MobilePanel.EthBalance = styled(ETHBalance)`
  width: 92%;
  margin: auto;

  @media (max-width: ${({ theme }) => theme.breakpoints.medium}px) {
    padding: 20px 0;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.large}px) and (min-width: ${({ theme }) =>
      theme.breakpoints.small}px) {
    width: 43%;
  }
`;

MobilePanel.Avatar = styled(Avatar)`
  margin-right: 25px;
`;

MobilePanel.MenuWrapper = styled.div`
  position: relative;
`;

MobilePanel.DropdownMenu = styled(DropdownMenu)`
  position: absolute;
  left: -200%;
  margin-top: 22px;
`;

MobilePanel.MenuLink = styled(Link)<{ $active?: boolean }>`
  color: ${({ theme }) => theme.colors.white};
  text-decoration: none;

  &:hover {
    text-decoration: underline;
    color: ${({ theme }) => theme.colors.green};
  }

  margin: 0 23px;
  font-weight: 600;
  font-size: 1em;
  text-decoration: none;

  ${({ $active }) =>
    $active &&
    css`
      border-bottom: 1px solid ${({ theme }) => theme.colors.white};
      padding-bottom: 4px;
    `}

  @media (max-width: ${({ theme }) => theme.breakpoints.medium}px) {
    padding: 26px 0;
  }
`;
