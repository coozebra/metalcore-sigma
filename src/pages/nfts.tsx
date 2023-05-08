import { useEffect, useState } from 'react';
import Head from 'next/head';
import styled, { css } from 'styled-components';
import Bugsnag from '@bugsnag/js';

import { Footer } from 'shared/components/Footer';
import { H1, Text } from 'shared/text';
import { Header } from 'navigation/components/Header';
import { INFT } from 'contracts/types/NFT';
import { useAsset } from 'NFT/hooks/useAsset';
import { Loader } from 'shared/components/Loader';
import { useWeb3 } from 'web3/providers/Web3Provider';
import { ConnectWalletButton } from 'web3/components/ConnectWalletButton';
import { NFTClassFilter } from 'NFT/components/NFTClassFilter';
import { NFTModal } from 'NFT/components/NFTModal';

const NFTs = () => {
  const { account, connected } = useWeb3();
  const { getNFTs } = useAsset();

  const [filters] = useState({ class: '' });
  const [loading, setLoading] = useState(true);
  const [nfts, setNfts] = useState<INFT[]>([]);
  const [nftForModal, setNFTForModal] = useState<INFT | undefined>();

  useEffect(() => {
    const fetchAndSetNFTs = async () => {
      setLoading(true);

      try {
        const response: INFT[] | undefined = await getNFTs();

        setNfts(response || []);
      } catch (error: any) {
        Bugsnag.notify(error, event => {
          event.severity = 'error';
          event.context = 'NFTs.useEffect';
        });
      } finally {
        setLoading(false);
      }
    };

    if (account) {
      fetchAndSetNFTs();
    } else {
      setLoading(false);
    }
  }, [account]);

  return (
    <>
      <Head>
        <title>METALCORE | NFT GALLERY</title>
      </Head>
      <Header />
      <NFTs.Wrapper>
        <NFTs.HeaderWrapper>
          <NFTClassFilter filters={filters} />
        </NFTs.HeaderWrapper>
        {loading ? (
          <NFTs.LoaderWrapper>
            <Loader />
          </NFTs.LoaderWrapper>
        ) : (
          <NFTs.NFTsWrapper>
            {connected ? (
              <>
                {nfts.length > 0 ? (
                  nfts.map((nft, index) => {
                    const rarityAttr = nft?.attributes?.find(
                      attribute => attribute.trait_type === 'Rarity',
                    );

                    const rarity = (rarityAttr?.value as string)?.toLowerCase() || '';

                    const isVideo = nft?.image?.includes('.mp4');

                    const isRevealed = nft => nft?.name !== 'Unknown';

                    return (
                      <NFTs.Card key={index}>
                        {isRevealed(nft) ? (
                          <NFTs.NFTRevealedWrapper
                            $rarity={rarity}
                            onClick={() => setNFTForModal(nft)}
                          >
                            {isVideo ? (
                              <NFTs.Video autoPlay loop muted poster="metalcore-logo-icon.png">
                                <source src={nft?.image} />
                              </NFTs.Video>
                            ) : (
                              <NFTs.NFTImage src={nft?.image} />
                            )}
                          </NFTs.NFTRevealedWrapper>
                        ) : (
                          <>
                            <NFTs.NFTUnrevealedWrapper>
                              <NFTs.VideoWrapper>
                                <NFTs.Video autoPlay loop muted poster="metalcore-logo-icon.png">
                                  <source src={nft?.image} />
                                </NFTs.Video>
                              </NFTs.VideoWrapper>
                            </NFTs.NFTUnrevealedWrapper>
                            <NFTs.UnrevealedText>NFT not revealed yet.</NFTs.UnrevealedText>
                          </>
                        )}
                      </NFTs.Card>
                    );
                  })
                ) : (
                  <NFTs.ContentWrapper>
                    <NFTs.Header>Looks like you do not own any NFTS at this time.</NFTs.Header>
                  </NFTs.ContentWrapper>
                )}
              </>
            ) : (
              <NFTs.ContentWrapper>
                <NFTs.Header>Please connect your wallet to view your nfts.</NFTs.Header>
                <ConnectWalletButton />
              </NFTs.ContentWrapper>
            )}
          </NFTs.NFTsWrapper>
        )}
        {!!nftForModal && <NFTModal nft={nftForModal} onClose={() => setNFTForModal(undefined)} />}
      </NFTs.Wrapper>
      <Footer />
    </>
  );
};

NFTs.Wrapper = styled.div`
  min-height: 100vh;
  background-image: url('/metalcore-background-main.png');
  background-size: cover;
  padding: 0 0 40px 0;
`;

NFTs.Row = styled.div`
  display: flex;
  justify-content: space-between;

  @media (max-width: ${({ theme }) => theme.breakpoints.medium}px) {
    flex-direction: column;
  }
`;

NFTs.HeaderWrapper = styled(NFTs.Row)`
  align-items: center;
  justify-content: flex-start;
  display: none;
`;

NFTs.Header = styled(H1)`
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.white};
`;

NFTs.BodyWrapper = styled(NFTs.Row)`
  padding: 20px 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.medium}px) {
    flex-direction: column-reverse;
  }
`;

NFTs.LoaderWrapper = styled.div`
  height: 25vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

NFTs.NFTsWrapper = styled(NFTs.Row)`
  align-items: space-between;
  width: 100%;
  flex-wrap: wrap;
  padding: 40px 5%;
  justify-content: flex-start;
`;

NFTs.Card = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 25%;
  margin-bottom: 30px;

  @media (max-width: ${({ theme }) => theme.breakpoints.small}px) {
    width: 100%;
    align-items: center;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.large}px) and (min-width: ${({ theme }) =>
      theme.breakpoints.small}px) {
    width: 50%;
    align-items: center;
  }
`;

NFTs.Text = styled(Text)`
  color: ${({ theme }) => theme.colors.green};
`;

NFTs.ContentWrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  min-height: calc(100vh - 210px - 94px);
  align-items: center;
  flex-direction: column;

  > button {
    flex-grow: 0;
  }
`;

NFTs.NFTRevealedWrapper = styled.div<{ $rarity?: string }>`
  position: relative;
  width: 80%;
  display: flex;
  justify-content: center;
  align-items: center;
  border-style: solid;
  border-width: 4px 4px 3px;
  border-color: ${({ theme }) => theme.colors.green};
  border-radius: 1.5em 1.5em 0em 0px;
  overflow: hidden;
  cursor: pointer;

  ${({ $rarity }) =>
    $rarity === 'uncommon' &&
    css`
      border-color: #00ff5a;
    `}

  ${({ $rarity }) =>
    $rarity === 'rare' &&
    css`
      border-color: #0065ff;
    `}

  ${({ $rarity }) =>
    $rarity === 'epic' &&
    css`
      border-color: #7800fa;
    `}

  ${({ $rarity }) =>
    $rarity === 'legendary' &&
    css`
      border-color: #fa7900;
    `}
`;

NFTs.NFTImage = styled.img`
  width: 100%;
`;

NFTs.NFTUnrevealedWrapper = styled.div`
  position: relative;
  border-style: solid;
  border-width: 4px 4px 3px;
  border-color: #36edc8;
  border-radius: 1.5em 1.5em 0em 0px;
  width: 80%;
  overflow: hidden;
`;

NFTs.VideoWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

NFTs.UnrevealedText = styled(Text)`
  color: ${({ theme }) => theme.colors.white};
  text-transform: uppercase;
  font-weight: 600;
  padding-top: 20px;
`;

NFTs.Video = styled.video`
  width: 100%;
  background: transparent url('metalcore-logo-icon.png') 50% 50% no-repeat;
  min-height: 250px;
`;

export default NFTs;
