import { useState, useEffect } from 'react';
import styled, { css } from 'styled-components';
import Image from 'next/image';
import * as Yup from 'yup';

import { useWeb3 } from 'web3/providers/Web3Provider';
import { formatExplorerLink, shortenHex } from 'web3/utils';
import { readableDate } from 'shared/utils/date';
import { Link } from 'shared/text';
import { useLeaderboard } from 'leaderboard/hooks/useLeaderboard';
import { Loader } from 'shared/components/Loader';
import { Button } from 'shared/components/Button';
import { ORDERING } from 'shared/enums/ordering';
import { IRanking } from 'leaderboard/types/Leaderboard';

const tiers = [
  {
    rank: 1,
    lowerThan: 1,
    higherThan: 50,
  },
  {
    rank: 2,
    lowerThan: 51,
    higherThan: 100,
  },
  {
    rank: 3,
    lowerThan: 101,
    higherThan: 150,
  },
  {
    rank: 4,
    lowerThan: 151,
    higherThan: 200,
  },
  {
    rank: 5,
    lowerThan: 201,
    higherThan: 250,
  },
  {
    rank: 6,
    lowerThan: 251,
    higherThan: 10000,
  },
];

const Sort = ({
  sortBy,
  order,
  handleSort,
}: {
  sortBy: string;
  order: string;
  handleSort: (sortBy: string) => void;
}) => {
  const handleClick = () => handleSort(sortBy);

  return (
    <Leaderboard.TitleOrderButton $flipped={order === ORDERING.ASC} onClick={handleClick}>
      <Image src="/more.svg" alt="" width="14" height="14" />
    </Leaderboard.TitleOrderButton>
  );
};

export const Leaderboard = ({ initialData }: { initialData: IRanking[] }) => {
  const { account, chainId } = useWeb3();
  const {
    isLoading,
    data,
    ordering,
    searchQuery,
    page,
    setPage,
    maxPages,
    handleSearch,
    handleSort,
  } = useLeaderboard({ initialData });

  const accountStats = useLeaderboard({ account });
  const userStats = accountStats?.data?.[0];

  const { points, rank } =
    account && userStats ? userStats : { points: undefined, rank: undefined };
  const leaderboard = data ?? [];

  const [inputValue, setInputValue] = useState<string | number>(page);

  const handleSearchChange = ({ target: { value } }) => handleSearch(value);

  const handleNavigation = async (value?: string | number) => {
    try {
      const navigationSchema = Yup.number().required().min(1).max(maxPages);
      const validatedPage = await navigationSchema.validate(value);

      setInputValue(validatedPage);
      setPage(validatedPage);
    } catch {
      setInputValue(page);
    }
  };

  const handleSubmit = event => {
    event.preventDefault();
    handleNavigation(inputValue);
  };

  useEffect(() => {
    if (`${inputValue}` !== `${page}`) {
      setInputValue(page);
    }
  }, [page]);

  const tierForRank = (position: number): number => {
    const tier = tiers.find(
      ({ lowerThan, higherThan }) => position >= lowerThan && position <= higherThan,
    );

    return tier?.rank ?? 6;
  };

  return (
    <Leaderboard.Wrapper>
      <Leaderboard.Heading>
        <Leaderboard.HeadingBackground />
        <Leaderboard.Tiers>
          <Leaderboard.TiersBackground />
          <Leaderboard.HeadingSectionTitle>Reward Tier Key</Leaderboard.HeadingSectionTitle>
          {tiers.map(({ rank, lowerThan, higherThan }) => (
            <Leaderboard.Tier key={`tier-for-${rank}`}>
              <Image src={`/icons/ranks/rank-${rank}.svg`} alt="" height="14" width="14" />
              <p>
                Rank {lowerThan.toLocaleString()}-{higherThan.toLocaleString()}
              </p>
            </Leaderboard.Tier>
          ))}
        </Leaderboard.Tiers>
        <Leaderboard.Header>LEADERBOARD FOR NFT HOLDERS</Leaderboard.Header>
        <Leaderboard.Stats>
          <Leaderboard.StatsBackground />
          <Leaderboard.StatsSectionTitle>Your Stats</Leaderboard.StatsSectionTitle>
          {points && rank ? (
            <>
              <Leaderboard.StatLabel>Rank:</Leaderboard.StatLabel>
              <Leaderboard.StatRank>{rank}</Leaderboard.StatRank>
              <Leaderboard.StatLabel>Points:</Leaderboard.StatLabel>
              <Leaderboard.StatPoints>
                <Image
                  width="14"
                  height="14"
                  src={`/icons/ranks/rank-${tierForRank(rank)}.svg`}
                  alt=""
                />
                {points.toLocaleString()}
              </Leaderboard.StatPoints>
              <Leaderboard.StatLink
                aria-label="faq"
                href="https://metalcore.gg/faq"
                target="_blank"
                rel="noreferrer"
              >
                <Image src="/icons/faq-icon.png" height="20" width="20" alt="" />
              </Leaderboard.StatLink>
            </>
          ) : (
            <Leaderboard.NotRanked>Not Ranked</Leaderboard.NotRanked>
          )}
        </Leaderboard.Stats>
      </Leaderboard.Heading>
      <Leaderboard.TableWrapper>
        <Leaderboard.SearchBar>
          <label htmlFor="search">
            <Image src="/icons/search.svg" alt="" width="20" height="20" />
          </label>
          <input
            id="search"
            onChange={handleSearchChange}
            value={searchQuery}
            placeholder="Search Ranking, Address ID"
          />
        </Leaderboard.SearchBar>
        <Leaderboard.Table>
          <Leaderboard.Corner />
          <Leaderboard.Corner $direction="upper-right" />
          <Leaderboard.Corner $direction="lower-left" />
          <Leaderboard.Corner $direction="lower-right" />
          <Leaderboard.TableHead>
            <Leaderboard.TableRow>
              <Leaderboard.TableTitle>
                Rank
                <Sort order={ordering.rank} sortBy="rank" handleSort={handleSort} />
              </Leaderboard.TableTitle>
              <Leaderboard.TableTitle>Address</Leaderboard.TableTitle>
              <Leaderboard.TableTitle>
                Points
                <Sort order={ordering.points} sortBy="points" handleSort={handleSort} />
              </Leaderboard.TableTitle>
              <Leaderboard.TableTitle>Latest Purchase</Leaderboard.TableTitle>
            </Leaderboard.TableRow>
          </Leaderboard.TableHead>
          {isLoading && (
            <Leaderboard.LoaderWrapper>
              <Loader />
            </Leaderboard.LoaderWrapper>
          )}
          {Boolean(!isLoading && leaderboard?.length) && (
            <Leaderboard.TableBody>
              {leaderboard?.map(({ rank, walletAddress, points, userName, latestPurchaseDate }) => (
                <Leaderboard.RankingRowWrapper
                  $currentUser={walletAddress === account}
                  key={`table-row-for-${walletAddress}-${rank}`}
                >
                  <Leaderboard.RankingRowBackground />
                  <Leaderboard.RankingRow $rank={rank}>
                    <Leaderboard.TableData>
                      <Leaderboard.OrderTitle>
                        <Leaderboard.TableTitle>Rank</Leaderboard.TableTitle>
                        <Sort order={ordering.rank} sortBy="rank" handleSort={handleSort} />
                      </Leaderboard.OrderTitle>
                      <Leaderboard.Rank $rank={rank}>{rank}</Leaderboard.Rank>
                    </Leaderboard.TableData>
                    <Leaderboard.Owner>
                      <Leaderboard.TableTitle>Address</Leaderboard.TableTitle>
                      <p>
                        {userName ?? 'Anonymous'} {walletAddress === account && '(You)'}
                      </p>
                      <Leaderboard.ScanLink
                        href={formatExplorerLink({
                          type: 'account',
                          data: [chainId ?? 1, walletAddress],
                        })}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {shortenHex(walletAddress, 4)}
                      </Leaderboard.ScanLink>
                    </Leaderboard.Owner>
                    <Leaderboard.Points>
                      <Leaderboard.OrderTitle>
                        <Leaderboard.TableTitle>Points</Leaderboard.TableTitle>
                        <Sort order={ordering.points} sortBy="points" handleSort={handleSort} />
                      </Leaderboard.OrderTitle>
                      <Leaderboard.PointsData>
                        <Leaderboard.PointsIcon>
                          <Image
                            width="12"
                            height="12"
                            src={`/icons/ranks/rank-${tierForRank(rank)}.svg`}
                            alt=""
                          />
                        </Leaderboard.PointsIcon>
                        <p>{points.toLocaleString()}</p>
                      </Leaderboard.PointsData>
                    </Leaderboard.Points>
                    <Leaderboard.LatestPurchase>
                      <Leaderboard.TableTitle>Latest Purchase</Leaderboard.TableTitle>
                      <p>{latestPurchaseDate && readableDate(latestPurchaseDate)}</p>
                    </Leaderboard.LatestPurchase>
                  </Leaderboard.RankingRow>
                </Leaderboard.RankingRowWrapper>
              ))}
            </Leaderboard.TableBody>
          )}
          {Boolean(!isLoading && !leaderboard?.length) && (
            <Leaderboard.EmptyState>No entries to show</Leaderboard.EmptyState>
          )}
          <Leaderboard.TableNavigation onSubmit={handleSubmit}>
            <Leaderboard.NavigationButton
              ghost
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              <Image src="/navigation.svg" width="22" height="19" alt="" />
            </Leaderboard.NavigationButton>
            <Leaderboard.InputWrapper>
              Go to page
              <Leaderboard.NavigationInput
                name="page"
                placeholder={`${page}`}
                onBlur={({ target: { value } }) => handleNavigation(value)}
                onChange={({ target: { value } }) => setInputValue(value)}
                type="tel"
                value={inputValue}
              />
              / {maxPages}
            </Leaderboard.InputWrapper>
            <Leaderboard.NavigationButton
              ghost
              onClick={() => setPage(page + 1)}
              disabled={page === maxPages}
            >
              <Image src="/navigation.svg" width="22" height="19" alt="" />
            </Leaderboard.NavigationButton>
          </Leaderboard.TableNavigation>
        </Leaderboard.Table>
      </Leaderboard.TableWrapper>
    </Leaderboard.Wrapper>
  );
};

Leaderboard.Wrapper = styled.div`
  display: grid;
  justify-content: center;
  padding: 20px 0;
  grid-template-rows: min-content 1fr;
  grid-gap: 12px;
  background: ${({ theme }) => theme.colors.black};
  background-image: url('/leaderboard-background.png');
  background-size: cover;
  justify-items: center;
  background-position-y: -18px;
  min-height: 100vh;

  @media (min-width: ${({ theme }) => theme.breakpoints.medium}px) {
    padding: 90px 0;
  }
`;

Leaderboard.LoaderWrapper = styled.div`
  height: 10px;
  width: 50px;
  justify-self: center;
  align-self: center;
`;

Leaderboard.Heading = styled.div`
  display: grid;
  align-items: center;
  justify-items: center;
  grid-template-rows: 1fr max-content max-content;
  grid-gap: 20px;
  position: relative;
  width: calc(100vw - 24px);

  @media (min-width: ${({ theme }) => theme.breakpoints.medium}px) {
    max-width: calc(100vw - 48px);
    grid-template-columns: 264px 1fr 264px;
    grid-template-rows: 1fr;
    width: 1384px;
    grid-gap: 0;
  }
`;

Leaderboard.Header = styled.h1`
  color: #ffffff;
  letter-spacing: 0.085em;
  text-transform: uppercase;
  text-align: center;
  font-size: 26px;
  max-width: 180px;
  margin: 0;
  margin-top: 10px;
  grid-row: 1;

  @media (min-width: ${({ theme }) => theme.breakpoints.medium}px) {
    max-width: 200px;
    font-size: 30px;
    grid-column: 2;
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.large}px) {
    max-width: 100%;
    font-size: 32px;
  }
`;

Leaderboard.Tiers = styled.div`
  height: 166px;
  display: grid;
  grid-gap: 6px;
  padding: 12px;
  grid-template-rows: 22px repeat(6, 14px);
  justify-items: center;
  margin-top: 18px;

  @media (min-width: ${({ theme }) => theme.breakpoints.medium}px) {
    margin-top: 0;
    position: relative;
    justify-items: start;
    justify-self: start;
  }
`;

Leaderboard.HeadingSectionTitle = styled.h3`
  color: ${({ theme }) => theme.colors.white};
  font-size: 28px;
  font-weight: 700;
  line-height: 24px;
`;

Leaderboard.Tier = styled.div`
  display: grid;
  grid-gap: 6px;
  grid-template-columns: 14px max-content;
  color: #fff;
  font-weight: 700;
  font-size: 18px;
  line-height: 14px;
`;

Leaderboard.StatsSectionTitle = styled(Leaderboard.HeadingSectionTitle)`
  grid-row: 1;
  grid-column: 1 / span 2;
`;

Leaderboard.Stats = styled.div`
  display: grid;
  height: 136px;
  padding: 12px;
  grid-template-rows: 22px repeat(2, 18px);
  grid-template-columns: repeat(2, max-content);
  grid-gap: 6px;
  justify-items: center;
  justify-content: center;

  @media (min-width: ${({ theme }) => theme.breakpoints.medium}px) {
    position: relative;
    justify-items: end;
    justify-content: end;
    justify-self: end;
    padding-top: 12px;
    height: 166px;
  }
`;

Leaderboard.StatLabel = styled.p`
  grid-column: 1;
  color: ${({ theme }) => theme.colors.white};
  font-weight: 700;
  font-size: 16px;
`;

Leaderboard.StatRank = styled.div`
  grid-column: 2;
  fill: black;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.white};
  font-size: 20px;
  letter-spacing: 0.045em;
  ${({
    theme: {
      colors: { black },
    },
  }) => css`
    text-shadow: -1.5px -1.5px 0 ${black}, 1.5px -1.5px 0 ${black}, -1.5px 1.5px 0 ${black},
      1.5px 1.5px 0 ${black};
  `}
`;

Leaderboard.NotRanked = styled(Leaderboard.StatLabel)`
  grid-column: 1 / span 2;
`;

Leaderboard.StatPoints = styled.div`
  grid-column: 2;
  display: grid;
  align-items: center;
  grid-template-columns: 14px max-content;
  grid-gap: 6px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.white};
  line-height: 14px;
  font-size: 18px;
`;

Leaderboard.StatLink = styled.a`
  grid-column: 2;
  width: 20px;
  height: 20px;
  padding-top: 10px;
`;

Leaderboard.HeadingBackground = styled.div`
  background-image: url('/leaderboard/mobile-decoration.svg');
  position: absolute;
  width: 296px;
  height: 315px;
  background-repeat: no-repeat;
  bottom: 6px;
  mix-blend-mode: overlay;
  background-size: contain;

  @media (min-width: ${({ theme }) => theme.breakpoints.medium}px) {
    display: none;
  }
`;

Leaderboard.TiersBackground = styled.div`
  position: absolute;
  background: url('/leaderboard/decoration-tall.svg');
  mix-blend-mode: overlay;
  background-repeat: no-repeat;
  width: 71px;
  height: 78px;
  top: 0;
  left: 0;

  @media (min-width: ${({ theme }) => theme.breakpoints.medium}px) {
    background: url('/leaderboard/decoration.svg');
    width: 264px;
    height: 166px;
  }
`;

Leaderboard.StatsBackground = styled(Leaderboard.TiersBackground)`
  transform: scaleX(-1);
  right: 0;
  left: unset;
`;

Leaderboard.SearchBar = styled.div`
  background: #f5f9fd;
  width: 100%;
  display: grid;
  grid-gap: 16px;
  padding: 16px 22px;
  grid-template-columns: 20px 1fr;
  align-items: center;
  height: 53px;

  label {
    height: 20px;
    width: 20px;
  }

  input {
    background: #f5f9fd;
    outline: none;
    border: none;
    font-family: 'Rajdhani';
    font-weight: 700;
    color: ${({ theme }) => theme.colors.black};

    &:placeholder {
      color: #9a9a9a;
    }
  }
`;

Leaderboard.TableTitle = styled.div`
  color: ${({ theme }) => theme.colors.white};
  text-align: start;
  font-weight: 700;
  text-transform: uppercase;
  display: grid;
  align-items: center;
  align-self: center;
  height: 14px;
  font-size: 16px;
  line-height: 14px;
  display: grid;
  grid-gap: 2px;

  @media (min-width: ${({ theme }) => theme.breakpoints.medium}px) {
    grid-template-columns: max-content 14px;
    font-size: 22px;
    line-height: 18px;
    height: 66px;
  }
`;

Leaderboard.TitleOrderButton = styled(Button)<{ $flipped: boolean }>`
  padding: 0;
  border: 0;
  background: rgba(0, 0, 0, 0);
  height: 24px;

  ${({ $flipped }) =>
    $flipped &&
    css`
      transform: rotate(180deg);
    `}

  &:hover {
    opacity: 0.8;
  }
`;

Leaderboard.TableWrapper = styled.div`
  display: grid;
  max-width: 1060px;
  grid-gap: 38px;
  width: calc(100vw - 24px);
  grid-template-rows: 53px min-content;

  @media (min-width: ${({ theme }) => theme.breakpoints.medium}px) {
    width: calc(100vw - 48px);
  }
`;

Leaderboard.Table = styled.div`
  display: grid;
  width: 100%;
  border-collapse: collapse;
  position: relative;
  border: 3px solid ${({ theme }) => theme.colors.white};
`;

Leaderboard.Corner = styled.div<{ $direction?: string }>`
  position: absolute;
  width: 36px;
  height: 36px;
  background-image: url('/corner.svg');
  top: -6px;
  left: -6px;

  ${({ $direction }) => {
    switch ($direction) {
      case 'upper-right':
        return css`
          left: unset;
          right: -6px;
          transform: rotate(90deg);
        `;
      case 'lower-left':
        return css`
          top: unset;
          bottom: -6px;
          transform: rotate(-90deg);
        `;
      case 'lower-right':
        return css`
          top: unset;
          left: unset;
          right: -6px;
          bottom: -6px;
          transform: rotate(-180deg);
        `;
      default:
        return css``;
    }
  }}
`;

Leaderboard.TableRow = styled.div`
  display: grid;
  width: 100%;
  grid-template-columns: repeat(2, 1fr);
  grid-auto-rows: 60px;
  padding: 24px 12px;
  align-items: center;
  grid-row-gap: 38px;
  grid-column-gap: 24px;
  justify-content: center;

  @media (min-width: ${({ theme }) => theme.breakpoints.small}px) {
    padding: 24px;
    grid-template-columns: repeat(3, 1fr);
    grid-column-gap: 80px;
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.medium}px) {
    grid-template-columns: 70px 1fr 100px 190px;
    grid-template-rows: 1fr;
    grid-gap: 50px;
    align-items: center;
    padding: 0;

    ${Leaderboard.TableTitle}:first-child {
      padding-left: 20px;
    }

    ${Leaderboard.TableTitle}:last-child {
      padding-right: 20px;
    }
  }
`;

Leaderboard.TableData = styled.div`
  color: ${({ theme }) => theme.colors.black};
  display: grid;
  justify-content: start;
  grid-gap: 8px;

  @media (min-width: ${({ theme }) => theme.breakpoints.medium}px) {
    ${Leaderboard.TableTitle} {
      display: none;
    }

    &:first-child {
      padding-left: 20px;
    }

    &:last-child {
      padding-right: 20px;
    }
  }
`;

Leaderboard.ScanLink = styled(Link)`
  color: ${({ theme }) => theme.colors.green};
  font-size: 14px;
  font-weight: 700;
  text-decoration: underline;
  text-transform: none;
  line-height: 14px;

  &:hover {
    text-decoration: none;
    color: ${({ theme }) => theme.colors.green};
    opacity: 0.75;
  }
`;

Leaderboard.Owner = styled(Leaderboard.TableData)`
  display: grid;
  grid-template-columns: max-content;
  grid-template-rows: 16px 14px;
  grid-row-gap: 8px;

  p {
    color: ${({ theme }) => theme.colors.white};
    font-size: 16px;
    font-weight: 500;
    line-height: 16px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 134px;

    @media (min-width: ${({ theme }) => theme.breakpoints.medium}px) {
      font-size: 20px;
      max-width: unset;
    }
  }
`;

Leaderboard.DataInfo = styled(Button)`
  border: none;
  grid-column: 2;
  grid-row: 1;
  padding: 0;
  background: rgba(0, 0, 0, 0);
  width: 14px;
  height: 14px;

  @media (min-width: ${({ theme }) => theme.breakpoints.medium}px) {
    display: none;
  }
`;

Leaderboard.PointsIcon = styled.div`
  height: 14px;
  height: 14px;
`;

Leaderboard.OrderTitle = styled.div`
  display: grid;
  grid-template-columns: max-content 14px;
  grid-gap: 4px;

  @media (min-width: ${({ theme }) => theme.breakpoints.medium}px) {
    display: none;
  }
`;

Leaderboard.PointsData = styled.div`
  display: grid;
  grid-template-columns: 14px max-content;
  grid-gap: 5px;
  align-items: center;
  justify-items: start;
`;

Leaderboard.Points = styled(Leaderboard.TableData)`
  display: grid;
  grid-template-rows: 16px 14px;
  color: ${({ theme }) => theme.colors.white};
  font-weight: 700;
  align-self: start;

  @media (min-width: ${({ theme }) => theme.breakpoints.medium}px) {
    grid-template-rows: 1fr;
    grid-template-columns: 12px max-content;
    align-self: center;
  }
`;

Leaderboard.LatestPurchase = styled(Leaderboard.Owner)`
  grid-template-rows: 16px;
`;

Leaderboard.TableHead = styled.div`
  display: none;

  @media (min-width: ${({ theme }) => theme.breakpoints.medium}px) {
    width: 100%;
    display: grid;
  }
`;

Leaderboard.Rank = styled.p<{ $rank: number }>`
  font-family: 'Rajdhani';
  color: ${({ theme }) => theme.colors.white};
  font-size: 30px;
  font-weight: 700;
  -webkit-text-stroke: 1px ${({ theme }) => theme.colors.black};
  text-align: start;
  width: 38px;
  height: 38px;
  line-height: 38px;

  @media (min-width: ${({ theme }) => theme.breakpoints.medium}px) {
    text-align: center;
    line-height: 41px;
  }

  ${({ $rank }) =>
    $rank <= 3 &&
    css`
      text-align: center;
      background-image: url(/leaderboard/${$rank}.svg);
      line-height: 48px;
      background-position-x: 5px;
      background-repeat: no-repeat;

      @media (min-width: ${({ theme }) => theme.breakpoints.medium}px) {
        line-height: 48px;
      }
    `};
`;

Leaderboard.RankingRowBackground = styled(Leaderboard.TableRow)`
  position: absolute;
  width: 100%;
  height: 200px;

  @media (min-width: ${({ theme }) => theme.breakpoints.medium}px) {
    height: 66px;
  }
`;

Leaderboard.RankingRowWrapper = styled(Leaderboard.TableRow)<{
  $currentUser?: boolean;
}>`
  position: relative;

  &:nth-child(odd) {
    ${Leaderboard.RankingRowBackground} {
      mix-blend-mode: overlay;
      background: ${({ theme }) => theme.colors.darkGray};
    }
  }

  &:nth-child(even) {
    ${Leaderboard.RankingRowBackground} {
      mix-blend-mode: overlay;
      background: ${({ theme }) => theme.colors.gray};
    }
  }

  ${({ $currentUser }) =>
    $currentUser &&
    css`
      ${Leaderboard.RankingRowBackground} {
        background: linear-gradient(90.42deg, #2b9c82 16.5%, #737373 69.3%) !important;
      }
    `}
`;

Leaderboard.RankingRow = styled(Leaderboard.TableRow)<{ $rank: number }>`
  position: absolute;
  width: 100%;
  height: 200px;

  @media (min-width: ${({ theme }) => theme.breakpoints.medium}px) {
    height: 66px;
  }
`;

Leaderboard.TableBody = styled.div`
  width: 100%;
  display: grid;
  grid-auto-rows: 200px;

  @media (min-width: ${({ theme }) => theme.breakpoints.medium}px) {
    grid-auto-rows: 66px;
  }
`;

Leaderboard.EmptyState = styled.p`
  color: ${({ theme }) => theme.colors.white};
  text-align: center;
  font-weight: 700;
  text-transform: uppercase;
  font-size: 16px;
  line-height: 14px;
  padding: 48px 0;
`;

Leaderboard.TableNavigation = styled.form`
  display: grid;
  grid-gap: 8px;
  justify-content: center;
  grid-template-columns: 22px max-content 22px;
  align-items: center;
  padding: 20px 0;

  @media (min-width: ${({ theme }) => theme.breakpoints.medium}px) {
    grid-gap: 18px;
    padding: 44px 0;
  }
`;

Leaderboard.NavigationButton = styled(Button)`
  padding: 0;
  border: 0;
  height: 27px;

  &:last-child {
    transform: rotate(180deg);
  }

  &:hover {
    opacity: 0.8;
  }

  &:disabled {
    opacity: 0.5;
  }
`;

Leaderboard.InputWrapper = styled.div`
  display: grid;
  grid-template-columns: max-content 30px max-content;
  color: #fff;
  font-weight: 600;
  letter-spacing: 0.06em;
  font-size: 18px;
  grid-gap: 8px;
  line-height: 29px;
  height: 27px;

  @media (min-width: ${({ theme }) => theme.breakpoints.medium}px) {
    grid-template-columns: max-content 45px max-content;
    font-size: 22px;
  }
`;

Leaderboard.NavigationInput = styled.input`
  height: 27px;
  border: 1px solid ${({ theme }) => theme.colors.green};
  text-align: center;
  outline: none;
  background-color: ${({ theme }) => theme.colors.darkGray};
  color: ${({ theme }) => theme.colors.white};
  font-style: normal;
  font-weight: 600;
  font-size: 16px;

  @media (min-width: ${({ theme }) => theme.breakpoints.medium}px) {
    font-size: 20px;
  }
`;
