import styled, { css } from 'styled-components';
import Image from 'next/image';

import { Link } from 'shared/text';
import { Button } from 'shared/components/Button';
import { SOCIAL } from 'shared/enums/social';
import { Newsletter } from './Newsletter';

export const Footer = ({ hasNewsletter = false }) => {
  const getSocialIconWidth = (social: string) => {
    switch (social) {
      case SOCIAL.medium.name:
        return '30';
      default:
        return '25';
    }
  };

  return (
    <Footer.Wrapper>
      <Footer.TopRow $hasNewsletter={hasNewsletter}>
        <Footer.DiscordLink
          aria-label="discord"
          href={SOCIAL.discord.url}
          target="_blank"
          rel="noreferrer"
        >
          <Footer.Button primary slanted>
            <Image height="13" width="18" src="/discord.png" alt="discord" />
            <Footer.ButtonText>join our discord</Footer.ButtonText>
          </Footer.Button>
        </Footer.DiscordLink>
        {hasNewsletter && <Newsletter />}
      </Footer.TopRow>
      <Footer.BottomRow>
        <Footer.PolicyRow>
          <Footer.Terms
            aria-label="OpenSea"
            href="https://opensea.io/collection/metalcore-infantry-genesis"
            target="_blank"
            rel="noreferrer"
          >
            OpenSea
          </Footer.Terms>
          <Footer.Terms
            aria-label="terms of service"
            href="https://cdn.metalcore.gg/legal/v1.1_MetalCore_NFT_TCs_for_Websites.pdf"
            target="_blank"
            rel="noreferrer"
          >
            terms of service
          </Footer.Terms>
          <Footer.Terms
            aria-label="privacy policy"
            href="https://www.metalcoregame.com/privacy-policy"
            target="_blank"
            rel="noreferrer"
          >
            privacy policy
          </Footer.Terms>
        </Footer.PolicyRow>
        <Footer.SocialRow>
          {Object.values(SOCIAL).map(social => (
            <a
              key={social.name}
              aria-label={social.name}
              href={social.url}
              target="_blank"
              rel="noreferrer"
            >
              <Footer.Social
                src={`/social/${social.name}.png`}
                alt={social.name}
                width={getSocialIconWidth(social.name)}
                height="25"
              />
            </a>
          ))}
        </Footer.SocialRow>
        <Footer.PartnerRow>
          <a aria-label="369" href="https://www.369.fun" target="_blank" rel="noreferrer">
            <Footer.Social src="/studio369.png" alt="studio 369" width="57" height="57" />
          </a>
        </Footer.PartnerRow>
      </Footer.BottomRow>
    </Footer.Wrapper>
  );
};

Footer.Wrapper = styled.div`
  height: 210px;
  background-image: url('/footer.png');
  background-size: cover;
  background-position: bottom;
  padding: 40px 10%;
  display: flex;
  justify-content: space-evenly;
  flex-direction: column;
  gap: 20px;

  @media (max-width: ${({ theme }) => theme.breakpoints.medium}px) {
    padding: 17px 10px;
    height: auto;
    background-position: left;
  }
`;

Footer.Row = styled.div`
  display: flex;
  justify-content: space-between;
`;

Footer.TopRow = styled(Footer.Row)<{ $hasNewsletter?: boolean }>`
  justify-content: flex-end;
  padding-right: 30px;

  ${({ $hasNewsletter }) =>
    $hasNewsletter &&
    css`
      justify-content: space-between;
      padding-right: 13px;
    `}

  @media (max-width: ${({ theme }) => theme.breakpoints.medium}px) {
    flex-direction: column;
    justify-content: center;
    padding-right: 0;
    align-items: center;
    gap: 20px;
  }
`;

Footer.BottomRow = styled(Footer.Row)`
  align-items: flex-end;
  justify-content: flex-end;

  @media (max-width: ${({ theme }) => theme.breakpoints.large}px) and (min-width: ${({ theme }) =>
      theme.breakpoints.small}px) {
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.large}px) {
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
  }
`;

Footer.LinkRow = styled(Footer.Row)`
  @media (max-width: ${({ theme }) => theme.breakpoints.large}px) and (min-width: ${({ theme }) =>
      theme.breakpoints.small}px) {
    width: 90%;
    padding: 20px 0;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.small}px) {
    text-align: center;
    flex-direction: column;
    width: 100%;
  }
`;

Footer.PolicyRow = styled(Footer.Row)`
  flex-direction: column;
  text-align: right;

  @media (max-width: ${({ theme }) => theme.breakpoints.medium}px) {
    padding-bottom: 15px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.small}px) {
    width: 100%;
  }
`;

Footer.Terms = styled(Link)`
  color: ${({ theme }) => theme.colors.white};
  padding: 3px 1vw;

  :active,
  :hover {
    color: ${({ theme }) => theme.colors.green};
    text-decoration: none;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.medium}px) {
    padding: 5px 0;
    text-align: center;
  }
`;

Footer.SocialRow = styled(Footer.Row)`
  align-items: center;
  flex-wrap: wrap-reverse;
  height: 45px;
  width: 90px;

  @media (max-width: ${({ theme }) => theme.breakpoints.large}px) {
    flex-direction: row;
    text-align: center;
    margin-top: 15px;
  }
`;

Footer.DiscordLink = styled.a`
  text-decoration: none;

  @media (max-width: ${({ theme }) => theme.breakpoints.medium}px) {
    width: 80%;
  }
`;

Footer.Social = styled(Image)`
  padding: 5px !important;
`;

Footer.PartnerRow = styled(Footer.Row)``;

Footer.LinkWrapper = styled(Footer.Row)`
  align-items: center;
`;

Footer.Link = styled(Link)`
  padding: 0 3vw 3px 3vw;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.green};

  @media (max-width: ${({ theme }) => theme.breakpoints.medium}px) {
    padding: 5px;
  }
`;

Footer.Button = styled(Button)`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 14px;
  height: 32px;

  @media (max-width: ${({ theme }) => theme.breakpoints.medium}px) {
    width: 100%;
    margin: 17px 0;
  }
`;

Footer.ButtonText = styled.p`
  font-weight: 700;
  font-size: 16px;
  line-height: 14px;
  letter-spacing: 0.065em;
  padding-top: 4px;

  @media (max-width: ${({ theme }) => theme.breakpoints.large}px) {
    font-size: 13px;
  }
`;
