import styled from 'styled-components';
import Link from 'next/link';

import { Text } from 'shared/text';
import { Button } from 'shared/components/Button';
import { useWeb3 } from 'web3/providers/Web3Provider';
import { Stats } from 'shared/components/Stats';
import { SALE_STAT_TYPE } from 'shared/enums/stats';
import { usePresale } from 'presale/providers/PresaleProvider';

export const PresaleStats = () => {
  const { account } = useWeb3();
  const { whitelist } = usePresale();

  const connected = typeof account === 'string';
  const whitelisted = !!whitelist?.signature;

  const getWhitelistStatus = () => {
    switch (true) {
      case !connected:
        return 'n/a';
      case whitelisted:
        return 'yes';
      case !whitelisted:
        return 'no';
      default:
        return '';
    }
  };

  const stats = [
    {
      title: 'whitelisted',
      type: SALE_STAT_TYPE.STATUS,
      status: getWhitelistStatus(),
    },
  ];

  return (
    <PresaleStats.Wrapper>
      <Stats
        title="Presale"
        stats={stats}
        tooltipText={
          <PresaleStats.Tooltip>
            Presale Info:
            <ol>
              <li>Presale NFTs will be limited to 1 per account.</li>
            </ol>
          </PresaleStats.Tooltip>
        }
      />
      <PresaleStats.ButtonWrapper>
        <PresaleStats.Link href="/nfts" aria-label="nfts">
          <PresaleStats.Button primary>view your nfts</PresaleStats.Button>
        </PresaleStats.Link>
        {/* <Link href="leaderboard" passHref>
          <PresaleStats.LeaderboardLink aria-label="nfts">
            <PresaleStats.Button ghost>Leaderboard</PresaleStats.Button>
          </PresaleStats.LeaderboardLink>
        </Link> */}
      </PresaleStats.ButtonWrapper>
    </PresaleStats.Wrapper>
  );
};

PresaleStats.Wrapper = styled.div`
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

PresaleStats.Tooltip = styled(Text)`
  font-size: 16px;
  line-height: 13px;
  text-transform: none;

  span {
    text-decoration: underline;
    font-weight: bold;
  }
`;

PresaleStats.ButtonWrapper = styled.div`
  display: grid;
  grid-gap: 20px;
  justify-content: start;
  align-items: center;
  padding-left: 30px;

  @media (max-width: ${({ theme }) => theme.breakpoints.small}px) {
    justify-content: center;
    padding: 20px 0;
    padding-left: 0;
  }
`;

PresaleStats.Link = styled(Link)`
  text-decoration: none;
`;

PresaleStats.Button = styled(Button)`
  width: 190px;
  flex-grow: 0;
  font-size: 12px;
  font-weight: 900;

  &:hover {
    border: 1px solid ${({ theme }) => theme.colors.green};
    background: transparent;
    color: ${({ theme }) => theme.colors.green};
  }
`;

PresaleStats.LeaderboardLink = styled(PresaleStats.Link)`
  ${PresaleStats.Button} {
    &:hover {
      background: ${({ theme }) => theme.colors.green};
      color: ${({ theme }) => theme.colors.black};
    }
  }
`;
