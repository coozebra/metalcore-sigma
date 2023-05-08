import Head from 'next/head';
import styled from 'styled-components';
import getConfig from 'next/config';
import Image from 'next/image';

import { SOCIAL } from 'shared/enums/social';
import { Button } from 'shared/components/Button';
import { Header } from 'navigation/components/Header';
import { Footer } from 'shared/components/Footer';
import { H2, Link, H3 } from 'shared/text';
import { Countdown } from 'shared/components/Countdown';
import { isExpired } from 'shared/utils/date';

const HomePage = () => {
  const { publicRuntimeConfig } = getConfig();

  const SALE_START_DATE = publicRuntimeConfig.SALE_START_DATE as string;
  const SALE_END_DATE = publicRuntimeConfig.SALE_END_DATE as string;

  const isSaleEnded = isExpired(SALE_END_DATE);
  const isSaleOngoing = isExpired(SALE_START_DATE) && !isSaleEnded;

  return (
    <>
      <Head>
        <title>METALCORE</title>
      </Head>
      <Header />
      <HomePage.Wrapper>
        <HomePage.ContentWrapper>
          <HomePage.Content>
            <HomePage.Header>welcome to the MetalCore NFT Mint Page.</HomePage.Header>

            <HomePage.Link
              href="https://medium.com/metalcoregame/metalcore-announces-date-of-infantry-genesis-mint-82196285de87"
              target="_blank"
              rel="noreferrer"
            >
              more info
            </HomePage.Link>

            <HomePage.Social>
              <HomePage.Body>
                <HomePage.SocialLink
                  href={SOCIAL.discord.url}
                  aria-label="nfts"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Image
                    height="23"
                    width="23"
                    src="/social/discord.png"
                    alt={SOCIAL.discord.name}
                  />
                  {SOCIAL.discord.name}
                </HomePage.SocialLink>
              </HomePage.Body>

              <HomePage.Body>
                <HomePage.SocialLink
                  href="https://opensea.io/collection/metalcore-infantry-genesis"
                  aria-label="nfts"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Image height="23" width="23" src="/social/opensea.svg" alt="opensea" />
                  OpenSea
                </HomePage.SocialLink>
              </HomePage.Body>
            </HomePage.Social>
          </HomePage.Content>

          <HomePage.CountdownContent>
            {isSaleOngoing && (
              <HomePage.OpenContent>
                <HomePage.SubHeader>Infantry NFT public sale now open!</HomePage.SubHeader>
                <HomePage.Link href="/sale" aria-label="nfts">
                  <HomePage.Button primary>Infantry NFT Public Sale</HomePage.Button>
                </HomePage.Link>
              </HomePage.OpenContent>
            )}
            {!isSaleOngoing && !isSaleEnded && (
              <HomePage.Countdown label="Infantry NFT public sale in" endDate={SALE_START_DATE} />
            )}
            {!isSaleOngoing && isSaleEnded && (
              <HomePage.OpenContent>
                <HomePage.Link href="/nfts" aria-label="nfts">
                  <HomePage.Button primary slanted>
                    View your MetalCore NFTs
                  </HomePage.Button>
                </HomePage.Link>
              </HomePage.OpenContent>
            )}
          </HomePage.CountdownContent>
        </HomePage.ContentWrapper>
      </HomePage.Wrapper>
      <Footer />
    </>
  );
};

HomePage.Wrapper = styled.div`
  min-height: calc(100vh - 210px - 94px);
  background-image: url('/metalcore-background-main.png');
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 5%;

  @media (max-width: ${({ theme }) => theme.breakpoints.medium}px) {
    min-height: 80vh;
  }
`;

HomePage.ContentWrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;

  @media (max-width: ${({ theme }) => theme.breakpoints.medium}px) {
    flex-direction: column;
  }
`;

HomePage.Content = styled.div`
  width: 100%;
`;

HomePage.Header = styled(H2)`
  color: ${({ theme }) => theme.colors.white};
`;

HomePage.SubHeader = styled(H3)`
  color: ${({ theme }) => theme.colors.white};
  padding-bottom: 10px;

  @media (max-width: ${({ theme }) => theme.breakpoints.medium}px) {
    font-size: 1.5em;
    text-align: center;
    line-height: 1em;
  }
`;

HomePage.Body = styled(H2)`
  color: ${({ theme }) => theme.colors.white};
  font-size: 1.25em;
  line-height: 1em;
  padding: 10px 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.medium}px) {
    font-size: 0.85em;
  }
`;

HomePage.Date = styled.span`
  text-decoration: underline;
`;

HomePage.CountdownContent = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;

  @media (max-width: ${({ theme }) => theme.breakpoints.medium}px) {
    padding-top: 50px;
    flex-direction: column;
  }
`;

HomePage.Countdown = styled(Countdown)`
  width: 100%;
`;

HomePage.Button = styled(Button)`
  width: 100%;
  flex-grow: 0;
  font-size: 12px;
  font-weight: 900;

  @media (max-width: ${({ theme }) => theme.breakpoints.medium}px) {
    width: 100%;
  }
`;

HomePage.Link = styled(Link)`
  text-decoration: none;
  color: ${({ theme }) => theme.colors.green};
  text-transform: uppercase;
  text-decoration: underline;

  :active,
  :hover {
    color: ${({ theme }) => theme.colors.green};
    text-decoration: none;
  }
`;

HomePage.Social = styled.div`
  display: grid;
  padding-top: 42px;
  grid-gap: 8px;
`;

HomePage.SocialLink = styled(Link)`
  display: grid;
  grid-template-columns: 23px max-content;
  grid-gap: 12px;
`;

HomePage.OpenContent = styled.div`
  flex-direction: column;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default HomePage;
