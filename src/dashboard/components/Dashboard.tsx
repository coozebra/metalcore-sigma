import styled from 'styled-components';
import { useEffect, useState } from 'react';

import { Button } from 'shared/components/Button';
import { useWalletLink } from 'wallet/hooks/useWalletLink';
import { useWeb3 } from 'web3/providers/Web3Provider';
import { WalletLinkProgressModal } from 'wallet/components/WalletLinkProgressModal';
import { useAuth } from 'auth/providers/AuthProvider';
import { WelcomeCard } from 'dashboard/components/WelcomeCard';
import { DownloadGameCard } from 'dashboard/components/DownloadGameCard';
import { IAccessKey } from 'dashboard/types/AccessKey';

export const Dashboard = ({ accessKeys }: { accessKeys?: IAccessKey[] }) => {
  const { connected } = useWeb3();
  const { linkWallet, progress, resetWalletLink } = useWalletLink();
  const { user } = useAuth();

  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);

  const handleCloseClick = () => {
    setShowModal(false);
    setError('');
    resetWalletLink();
  };

  const handleWalletLinkClick = async () => {
    setError('');

    try {
      await linkWallet();
    } catch (error: any) {
      setError(error?.message);
    }
  };

  useEffect(() => {
    if (progress > 0) {
      setShowModal(true);
    }
  }, [progress]);

  return (
    <Dashboard.Wrapper>
      <Dashboard.Header>
        <WelcomeCard />
        <Dashboard.LinkWalletWrapper>
          {connected && !user?.walletAddress && (
            <Dashboard.LinkWallet primary slanted onClick={handleWalletLinkClick}>
              Link wallet
            </Dashboard.LinkWallet>
          )}

          {connected && user?.walletAddress && (
            <Dashboard.LinkedWallet ghost slanted disabled>
              Wallet linked
            </Dashboard.LinkedWallet>
          )}
        </Dashboard.LinkWalletWrapper>
      </Dashboard.Header>
      <Dashboard.Body>
        <DownloadGameCard accessKeys={accessKeys} />
      </Dashboard.Body>

      <Dashboard.Footer>
        <Dashboard.CTALink href="https://medium.com/metalcoregame">
          <Dashboard.CTAText>NEWSFEED</Dashboard.CTAText>
          <Dashboard.CTAImage src="/dashboard/newsfeed-background.png" />
        </Dashboard.CTALink>

        <Dashboard.CTALink href="https://support.metalcore.gg">
          <Dashboard.CTAText>SUPPORT</Dashboard.CTAText>
          <Dashboard.CTAImage src="/dashboard/support-background.png" />
        </Dashboard.CTALink>

        <Dashboard.CTALink href="https://litepaper.metalcore.gg">
          <Dashboard.CTAText>LITEPAPER</Dashboard.CTAText>
          <Dashboard.CTAImage src="/dashboard/litepaper-background.png" />
        </Dashboard.CTALink>
      </Dashboard.Footer>

      {progress > 0 && showModal && (
        <WalletLinkProgressModal error={error} progress={progress} close={handleCloseClick} />
      )}
    </Dashboard.Wrapper>
  );
};

Dashboard.Wrapper = styled.div`
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.black};
  background-image: url('/dashboard/dashboard-background.png');
  background-size: cover;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
`;

Dashboard.Header = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px;
  height: 10vh;
`;

Dashboard.Body = styled.div`
  height: 80vh;
  width: 100vw;
  padding: 16px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
`;

Dashboard.LinkWalletWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 12px 20px;
  position: absolute;
  top: 75px;

  @media (min-width: ${({ theme }) => theme.breakpoints.small}px) {
    top: 0;
    right: 0;
  }
`;

Dashboard.LinkWallet = styled(Button)`
  color: #000000;
  font-family: 'Syncopate';
  font-size: 12px;
  font-weight: 700;
  height: 25px;
  letter-spacing: 0.065em;
  line-height: 17px;
  margin: 0;
  padding: 0;
  width: 280px;

  > button {
    margin: 0;
    padding: 0;
    height: 25px;
  }
`;

Dashboard.LinkedWallet = styled(Button)`
  color: #000000;
  font-family: 'Syncopate';
  font-size: 12px;
  font-weight: 700;
  height: 25px;
  letter-spacing: 0.065em;
  line-height: 17px;
  margin: 0;
  padding: 0;
  width: 280px;
  background: transparent;

  > button {
    margin: 0;
    padding: 0;
    height: 25px;
    color: ${({ theme }) => theme.colors.green};
  }
`;

Dashboard.Footer = styled.div`
  height: 10vh;
  width: 100vw;
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding-bottom: 50px;

  @media (max-width: ${({ theme }) => theme.breakpoints.small}px) {
    flex-direction: column;
    height: 40vh;
  }
`;

Dashboard.CTAText = styled.p`
  color: ${({ theme }) => theme.colors.white};
  text-transform: uppercase;
  position: absolute;
  top: 5px;
  left: 20px;
`;

Dashboard.CTALink = styled.a`
  position: relative;
`;

Dashboard.CTAImage = styled.img`
  width: 25vw;

  @media (max-width: ${({ theme }) => theme.breakpoints.small}px) {
    width: 90vw;
  }
`;
