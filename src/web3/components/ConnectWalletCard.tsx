import styled from 'styled-components';
import Link from 'next/link';

import { Card } from 'shared/components/Card';
import { H3, Text } from 'shared/text';
import { ConnectWalletButton } from 'web3/components/ConnectWalletButton';

export const ConnectWalletCard = () => {
  return (
    <ConnectWalletCard.Card>
      <ConnectWalletCard.Title>Connect Your Wallet</ConnectWalletCard.Title>
      <ConnectWalletCard.Description>
        Check if you own an NFT that is eligible to install the MetalCore game. Don&rsquo;t have an
        NFT? You can check out Opensea to buy one!
      </ConnectWalletCard.Description>
      <ConnectWalletCard.ConnectWalletButton />
      <Link href="/dashboard">
        <ConnectWalletCard.Link aria-label="dashboard">Skip this step</ConnectWalletCard.Link>
      </Link>
    </ConnectWalletCard.Card>
  );
};

ConnectWalletCard.Card = styled(Card)`
  padding: 50px;
`;

ConnectWalletCard.Title = styled(H3)`
  color: ${({ theme }) => theme.colors.white};
  font-size: 30px;
  text-align: center;
  padding-bottom: 50px;
`;

ConnectWalletCard.Description = styled(Text)`
  color: ${({ theme }) => theme.colors.white};
  text-transform: none;
`;

ConnectWalletCard.ConnectWalletButton = styled(ConnectWalletButton)`
  margin: 50px auto;
`;

ConnectWalletCard.Link = styled.span`
  color: ${({ theme }) => theme.colors.green};
  margin: 0 23px;
  font-weight: 600;
  font-size: 1em;
  text-decoration: none;
  cursor: pointer;

  @media (max-width: ${({ theme }) => theme.breakpoints.medium}px) {
    padding: 26px 0;
  }
`;
