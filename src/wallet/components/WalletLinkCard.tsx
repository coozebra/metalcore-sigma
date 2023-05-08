import styled, { css } from 'styled-components';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { Card } from 'shared/components/Card';
import { H3, Text, A } from 'shared/text';
import { ConnectWalletButton } from 'web3/components/ConnectWalletButton';
import { useWeb3 } from 'web3/providers/Web3Provider';
import { useWalletLink } from 'wallet/hooks/useWalletLink';
import { Button } from 'shared/components/Button';
import { WalletLinkProgressModal } from 'wallet/components/WalletLinkProgressModal';

export const WalletLinkCard = () => {
  const { connected } = useWeb3();
  const { linkWallet, progress, resetWalletLink } = useWalletLink();

  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);

  const handleWalletLinkClick = async () => {
    setError('');

    try {
      await linkWallet();
    } catch (error: any) {
      setError(error?.message);
    }
  };

  const handleCloseClick = () => {
    setShowModal(false);
    setError('');
    resetWalletLink();
  };

  useEffect(() => {
    if (progress > 0) {
      setShowModal(true);
    }
  }, [progress]);

  return (
    <>
      <WalletLinkCard.Card>
        {progress !== 100 ? (
          <>
            <WalletLinkCard.Title>Successfully Connected!</WalletLinkCard.Title>
            <WalletLinkCard.Description>
              Congrats! Next you can choose to link your wallet or proceed to the dashboard. Linking
              your wallet will allow us to give you special rewards! More than one wallet can be
              linked to your METALCORE account.
            </WalletLinkCard.Description>
            {connected ? (
              <WalletLinkCard.LinkWallet primary slanted onClick={handleWalletLinkClick}>
                Link your wallet
              </WalletLinkCard.LinkWallet>
            ) : (
              <WalletLinkCard.ConnectWalletButton />
            )}

            <WalletLinkCard.Link href="/dashboard" aria-label="dashboard">
              Skip this step
            </WalletLinkCard.Link>
          </>
        ) : (
          <>
            <WalletLinkCard.Title>Successfully Linked!</WalletLinkCard.Title>
            <WalletLinkCard.Description>
              Please proceed to the&nbsp;
              <WalletLinkCard.Link href="/dashboard" aria-label="dashboard">
                dashboard
              </WalletLinkCard.Link>
              .
            </WalletLinkCard.Description>
          </>
        )}
      </WalletLinkCard.Card>

      {progress > 0 && showModal && (
        <WalletLinkProgressModal error={error} progress={progress} close={handleCloseClick} />
      )}
    </>
  );
};

WalletLinkCard.Card = styled(Card)`
  padding: 50px;
  text-align: center;
`;

WalletLinkCard.Title = styled(H3)`
  color: ${({ theme }) => theme.colors.white};
  font-size: 30px;
  text-align: center;
  padding-bottom: 50px;
`;

WalletLinkCard.Description = styled(Text)`
  color: ${({ theme }) => theme.colors.white};
  text-transform: none;
`;

WalletLinkCard.ConnectWalletButton = styled(ConnectWalletButton)`
  margin: 50px auto;
`;

WalletLinkCard.Link = styled(Link)<{ $active?: boolean }>`
  color: ${({ theme }) => theme.colors.green};
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

WalletLinkCard.LinkWallet = styled(Button)`
  font-family: 'Syncopate';
  font-weight: 700;
  font-size: 16px;
  line-height: 17px;
  letter-spacing: 0.065em;
  color: #000000;
  width: 280px;
  margin: 50px auto;
`;
