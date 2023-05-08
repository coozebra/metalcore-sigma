import styled, { css } from 'styled-components';
import NextLink from 'next/link';

export const H1 = styled.h1`
  font-family: 'rajdhani';
  font-style: normal;
  font-weight: 600;
  font-size: 52px;
  line-height: 64px;
  letter-spacing: 0.06em;
  color: black;
  text-transform: uppercase;
  margin: 0;
`;

export const H2 = styled.h2`
  font-family: 'rajdhani';
  font-style: normal;
  font-weight: 600;
  font-size: 32px;
  line-height: 38px;
  letter-spacing: 0.06em;
  color: black;
  text-transform: uppercase;
  margin: 0;
`;

export const H3 = styled.h3`
  font-family: 'rajdhani';
  font-style: normal;
  font-weight: 600;
  font-size: 21px;
  line-height: 24px;
  letter-spacing: 0.085em;
  color: black;
  text-transform: uppercase;
  margin: 0;
`;

export const Text = styled.span`
  font-family: 'rajdhani';
  font-style: normal;
  font-weight: 600;
  font-size: 18px;
  line-height: 19px;
  letter-spacing: 0.06em;
  text-transform: lowercase;
  color: black;
`;

export const Small = styled.span`
  font-family: 'rajdhani';
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 16px;
  letter-spacing: 0.06em;
  text-transform: lowercase;
  color: black;
`;

export const LinkStyling = css`
  font-family: 'rajdhani';
  color: ${({ theme }) => theme.colors.white};
  cursor: pointer;
  font-style: normal;
  font-weight: 600;
  letter-spacing: 0.06em;
  line-height: 24px;
  text-transform: uppercase;
  text-decoration: none;
  font-size: 18px;

  :focus:not(:focus-visible) {
    outline: none;
  }

  :active,
  :hover {
    color: ${({ theme }) => theme.colors.white};
    text-decoration: none;
  }
`;

export const A = styled.a`
  ${LinkStyling}
`;

export const Link = styled(NextLink)`
  ${LinkStyling}
`;

export const OL = styled.ol`
  font-family: 'rajdhani';
  color: ${({ theme }) => theme.colors.white};
  font-style: normal;
  font-weight: 600;
  font-size: 18px;
  line-height: 19px;
  letter-spacing: 0.06em;

  > li {
    padding-bottom: 1rem;
  }
`;
