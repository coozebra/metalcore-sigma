import { useState } from 'react';
import styled, { css } from 'styled-components';
import Image from 'next/image';

// TODO: deprecate legacy nfts gallery and migrate components to dashboard
import { NFTModal } from 'NFT/components/NFTModal';
import { NFTTransferProgressModal } from 'dashboard/components/NFTs/NFTTransferProgressModal';
import { useNFTTransfer } from 'dashboard/hooks/useNFTTransfer';
import { useWeb3 } from 'web3/providers/Web3Provider';
import { useAuth } from 'auth/providers/AuthProvider';
import { IAsset, NFT_STATUS } from 'dashboard/types/NFT';
import { Button } from 'shared/components/Button';
import { Loader } from 'shared/components/Loader';
import { Text } from 'shared/text';

interface IProps {
  NFT: IAsset;
  handleTransfer: (NFT: IAsset) => void;
}

export const NFTCard = ({ NFT, handleTransfer }: IProps) => {
  const { account } = useWeb3();
  const { user } = useAuth();
  const { progress, transfer, error, message, reset } = useNFTTransfer();

  const handleTransferClick = () => transfer({ NFT, handleTransfer });

  const isConnected = account && account.toLowerCase() === user?.walletAddress?.toLowerCase();
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const isTransfering = NFT.transferingDirection !== undefined;

  const showModal = () => setIsModalVisible(true);
  const closeModal = () => setIsModalVisible(false);

  const isLocked = NFT.attributes.status === NFT_STATUS.locked;
  const isMinting = NFT.state === 'minting';
  const isLocking = NFT.transferingDirection === NFT_STATUS.locked;

  return (
    <>
      {isModalVisible && <NFTModal nft={NFT.attributes} onClose={closeModal} />}
      {progress > 0 && (
        <NFTTransferProgressModal
          progress={progress}
          error={error}
          message={message}
          isLocked={isLocked}
          close={error || progress === 100 ? reset : () => {}}
        />
      )}
      <NFTCard.Wrapper>
        <NFTCard.Card $disabled={isTransfering}>
          <NFTCard.Content onClick={showModal}>
            <NFTCard.Header>
              {!isMinting && isLocked ? (
                <NFTCard.Status>
                  <Image src="/icons/lock.svg" alt="" height="22" width="14" />
                  In Game
                </NFTCard.Status>
              ) : null}
              {!isMinting && !isLocked ? (
                <NFTCard.Status>
                  <Image src="/icons/wallet.svg" alt="" height="22" width="14" />
                  In Wallet
                </NFTCard.Status>
              ) : null}
              {isMinting ? (
                <NFTCard.Status>
                  <NFTCard.Spinner />
                  Minting
                </NFTCard.Status>
              ) : null}
              {NFT?.tokenId ? <Text>#{NFT.tokenId}</Text> : null}
            </NFTCard.Header>
            <NFTCard.MediaWrapper $rarity={NFT.attributes.Rarity}>
              {NFT.attributes.isVideo ? (
                <NFTCard.VideoWrapper>
                  <NFTCard.Video autoPlay loop muted poster="metalcore-logo-icon.png">
                    <source src={NFT.attributes?.image} />
                  </NFTCard.Video>
                </NFTCard.VideoWrapper>
              ) : (
                <NFTCard.Image loading="lazy" src={NFT.attributes?.image} />
              )}
            </NFTCard.MediaWrapper>
            <NFTCard.Label>{NFT.attributes?.name}</NFTCard.Label>
          </NFTCard.Content>
          <NFTCard.CTA disabled={!isConnected} onClick={handleTransferClick} primary>
            {isLocked ? 'Withdraw' : 'Deposit'}
          </NFTCard.CTA>
        </NFTCard.Card>
        {isTransfering ? (
          <NFTCard.LoadingOverlay>
            <NFTCard.LoaderWrapper>
              <Loader />
            </NFTCard.LoaderWrapper>
            <Text>{isLocking ? 'Depositing to game' : 'Withdrawing to wallet'}</Text>
          </NFTCard.LoadingOverlay>
        ) : null}
      </NFTCard.Wrapper>
    </>
  );
};

export const PlaceholderCard = () => (
  <NFTCard.Wrapper>
    <NFTCard.Card>
      <Loader />
    </NFTCard.Card>
  </NFTCard.Wrapper>
);

NFTCard.Wrapper = styled.div`
  width: 340px;
  height: 514px;
  display: grid;
  position: relative;
  perspective: 800px;
`;

NFTCard.LoaderWrapper = styled.div`
  height: 100%;
`;

NFTCard.LoadingOverlay = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  display: grid;
  width: 200px;
  height: 150px;
  background: red;
  align-items: center;
  justify-items: center;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.colors.darkGreenBackground};
  align-self: center;
  justify-self: center;
  filter: drop-shadow(0px 0px 8px rgba(0, 0, 0, 0.5));
  grid-template-rows: repeat(3, 1fr);

  ${NFTCard.LoaderWrapper} {
    grid-row: 2;
  }

  ${Text} {
    color: ${({ theme }) => theme.colors.green};
    font-weight: 700;
    text-transform: none;
    font-size: 14px;
    grid-row: 3;
  }
`;

NFTCard.Content = styled.button`
  display: grid;
  cursor: pointer;
  grid-auto-flow: row;
  grid-auto-rows: min-content;
  justify-items: center;
  grid-gap: 10px;
  border-radius: 8px;
  position: relative;
  background: none;
  color: inherit;
  border: none;
  padding: 0;
  outline: none;
`;

NFTCard.Card = styled.div<{ $rarity?: string; $disabled?: boolean }>`
  width: 280px;
  height: 464px;
  padding: 10px 24px;
  background: #2b2a2c;
  border-radius: 8px;
  display: grid;
  justify-items: center;
  align-items: center;
  gap: 10px;
  transition: transform 250ms, filter 250ms;
  position: relative;
  top: 25px;
  left: 30px;
  -webkit-transform-origin: 50% 51%;
  user-select: none;

  ${({ $disabled }) =>
    $disabled
      ? css`
          opacity: 0.75;
          pointer-events: none;
        `
      : css`
          :hover {
            filter: drop-shadow(0px 0px 8px rgba(0, 0, 0, 0.6));
            transform: scale(1.01);
          }
        `}
`;

NFTCard.Header = styled.div`
  display: grid;
  grid-template-columns: max-content 1fr;
  width: 100%;

  ${Text} {
    text-align: end;
    color: ${({ theme }) => theme.colors.green};
    line-height: 20px;
  }
`;

NFTCard.Label = styled(Text)`
  text-transform: none;
  color: #ffffff;
  font-weight: 700;
  font-size: 20px;
  line-height: 17px;
`;

NFTCard.Spinner = styled.div`
  background: red;
  width: 20px;
  height: 20px;
  background: url('/icons/in-game-use-icon.svg');
  background-size: contain;

  @keyframes rotate {
    0% {
      transform: rotate(0deg);
    }

    100% {
      transform: rotate(360deg);
    }
  }

  animation: rotate 1s infinite reverse;
`;

NFTCard.Status = styled(NFTCard.Label)`
  display: grid;
  align-items: center;
  gap: 14px;
  text-align: start;
  width: 100%;
  grid-template-columns: 14px max-content;
`;

NFTCard.MediaBorder = css`
  border-radius: 20px;
  width: 227px;
  height: 308px;
`;

NFTCard.MediaWrapper = styled.div<{ $rarity?: string }>`
  ${NFTCard.MediaBorder}
  background-color: ${({ theme }) => theme.colors.green};
  position: relative;
  margin: 0;
  overflow: hidden;
  filter: drop-shadow(0px 10px 6px rgba(0, 0, 0, 0.45));

  ${({ $rarity }) =>
    $rarity === 'Uncommon' &&
    css`
      background-color: #00ff5a;
    `}

  ${({ $rarity }) =>
    $rarity === 'Rare' &&
    css`
      background-color: #0065ff;
    `}

  ${({ $rarity }) =>
    $rarity === 'Epic' &&
    css`
      background-color: #7800fa;
    `}

  ${({ $rarity }) =>
    $rarity === 'Legendary' &&
    css`
      background-color: #fa7900;
    `}
`;

NFTCard.Media = css`
  position: absolute;
  top: 3px;
  left: 3px;
  width: 220px;
  height: 308px;
  border-radius: 20px;
  object-fit: cover;
  object-position: top;
`;

NFTCard.Image = styled.img`
  ${NFTCard.Media}
`;

NFTCard.VideoWrapper = styled.div`
  ${NFTCard.MediaBorder}
  left: 0;
  overflow: hidden;
  position: absolute;
`;

NFTCard.Video = styled.video`
  ${NFTCard.Media}
  background: transparent url('metalcore-logo-icon.png') 50% 50% no-repeat;
`;

NFTCard.CTA = styled(Button)`
  font-family: 'Rajdhani';
  font-weight: 700;
  font-size: 16px;
  line-height: 20px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.black};
  transition: background-color 250ms, color 250ms;

  :hover {
    background-color: rgba(0, 0, 0, 0);
    color: ${({ theme }) => theme.colors.green};
    border: 2px solid ${({ theme }) => theme.colors.green};
  }

  :disabled {
    background: ${({ theme }) => theme.colors.gray};
    color: ${({ theme }) => theme.colors.black};
    opacity: 0.75;

    :hover {
      background: ${({ theme }) => theme.colors.gray};
      color: ${({ theme }) => theme.colors.black};
      border: none;
    }
  }
`;
