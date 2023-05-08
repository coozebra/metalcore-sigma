import { useState, useEffect } from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import getConfig from 'next/config';

import { Text } from 'shared/text';
import { Button } from 'shared/components/Button';
import { useSaleMaxMintable, useSaleMinted } from 'sale/hooks';
import { Stats } from 'shared/components/Stats';
import { SALE_STAT_TYPE } from 'shared/enums/stats';
import { INFT } from 'contracts/types/NFT';
import { useAsset } from 'NFT/hooks/useAsset';
import { useWeb3 } from 'web3/providers/Web3Provider';

export const SaleStats = () => {
  const { publicRuntimeConfig } = getConfig();
  const [nfts, setNfts] = useState<INFT[]>([]);
  const { getNFTs } = useAsset();
  const { account } = useWeb3();

  const SALE_CONTRACT = publicRuntimeConfig.SALE_CONTRACT_ADDRESS as string;

  useEffect(() => {
    const fetchAndSetNFTs = async () => {
      try {
        const response: INFT[] | undefined = await getNFTs();

        setNfts(response || []);
      } catch (error) {
        console.log('error: ', error);
      }
    };

    if (account) {
      fetchAndSetNFTs();
    }
  }, [account]);

  const { data: totalSaleMintedNFTCount = 0 } = useSaleMinted(SALE_CONTRACT);
  const { data: totalSaleNFTCount } = useSaleMaxMintable(SALE_CONTRACT);

  const userMintedAmount = nfts.length;
  const totalNFts = totalSaleNFTCount?.toNumber() || 0;
  const totalMintedNFTs = totalNFts - totalSaleMintedNFTCount;

  const stats = [
    {
      title: 'NFTs Left',
      type: SALE_STAT_TYPE.PROGRESS,
      total: totalNFts,
      current: totalMintedNFTs,
    },
    {
      title: 'Your NFTs',
      type: SALE_STAT_TYPE.COUNT,
      current: userMintedAmount,
    },
  ];

  return (
    <SaleStats.Wrapper>
      <Stats
        title="NFT Sale"
        stats={[]}
        tooltipText={
          <SaleStats.StatsTooltip>
            NFT Sale Info:
            <ol>
              <li>NFTs will be limited to 1 per account.</li>
            </ol>
          </SaleStats.StatsTooltip>
        }
      />
      <SaleStats.ButtonWrapper>
        <SaleStats.Link href="/nfts" aria-label="nfts">
          <SaleStats.Button primary>view your nfts</SaleStats.Button>
        </SaleStats.Link>
        {/* <Link href="leaderboard" passHref>
          <SaleStats.LeaderboardLink aria-label="nfts">
            <SaleStats.Button ghost>Leaderboard</SaleStats.Button>
          </SaleStats.LeaderboardLink>
        </Link> */}
      </SaleStats.ButtonWrapper>
    </SaleStats.Wrapper>
  );
};

SaleStats.Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 30%;

  @media (max-width: ${({ theme }) => theme.breakpoints.large}px) and (min-width: ${({ theme }) =>
      theme.breakpoints.small}px) {
    width: 100%;
    align-items: center;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.small}px) {
    order: 1;
    width: 90%;
  }
`;

SaleStats.StatsTooltip = styled(Text)`
  font-size: 14px;
  line-height: 13px;
  text-transform: none;

  span {
    text-decoration: underline;
    font-weight: bold;
  }
`;

SaleStats.ButtonWrapper = styled.div`
  display: grid;
  grid-gap: 20px;
  justify-content: start;
  align-items: center;
  padding-left: 30px;
  padding-top: 20px;

  @media (max-width: ${({ theme }) => theme.breakpoints.small}px) {
    justify-content: center;
    padding: 20px 0;
    padding-left: 0;
  }
`;

SaleStats.Link = styled(Link)`
  text-decoration: none;
`;

SaleStats.Button = styled(Button)`
  width: 175px;
  flex-grow: 0;
  font-size: 12px;
  font-weight: 900;

  &:hover {
    border: 1px solid ${({ theme }) => theme.colors.green};
    background: transparent;
    color: ${({ theme }) => theme.colors.green};
  }
`;

SaleStats.LeaderboardLink = styled(SaleStats.Link)`
  ${SaleStats.Button} {
    &:hover {
      background: ${({ theme }) => theme.colors.green};
      color: ${({ theme }) => theme.colors.black};
    }
  }
`;
