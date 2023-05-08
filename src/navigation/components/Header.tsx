import styled from 'styled-components';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';

import { useWindowSize } from 'shared/hooks/useWindowSize';
import { Hamburger } from 'shared/components/Hamburger';
import { useWeb3 } from 'web3/providers/Web3Provider';
import { Web3ConnectModal } from 'web3/components/Web3ConnectModal';
import { Avatar } from 'shared/components/Avatar';
import { DesktopPanel } from 'navigation/components/DesktopPanel';
import { MobilePanel } from 'navigation/components/MobilePanel';
import { useAuth } from 'auth/providers/AuthProvider';

export const Header = () => {
  const { isMobile, isDesktop, isTablet } = useWindowSize();
  const { isDisplayingModal, isCorrectChain } = useWeb3();
  const { logout, status, user } = useAuth();

  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showDashboardMenu, setShowDashboardMenu] = useState(false);

  const handleMenuClick = () => {
    setShowMobileMenu(prev => !prev);
  };

  return (
    <>
      {(isDisplayingModal || !isCorrectChain) && <Web3ConnectModal />}
      <Header.Wrapper>
        <div>
          <Link href="/" aria-label="METALCORE logo">
            <Image
              src="/metalcore-logo.png"
              alt="METALCORE"
              width={isDesktop ? '104' : '72'}
              height={isDesktop ? '83' : '57'}
            />
          </Link>
        </div>
        {isDesktop && <DesktopPanel />}
        {(isMobile || isTablet) && (
          <Header.MobileWrapper>
            {status.authenticated && (
              <MobilePanel.MenuWrapper>
                <MobilePanel.Avatar
                  onMouseEnter={() => setShowDashboardMenu(true)}
                  onClick={() => setShowDashboardMenu(prev => !prev)}
                >
                  {user?.displayName?.substring(0, 2)}
                </MobilePanel.Avatar>
                {showDashboardMenu && (
                  <MobilePanel.DropdownMenu onMouseLeave={() => setShowDashboardMenu(false)}>
                    <MobilePanel.MenuLink href="/dashboard" aria-label="dashboard">
                      dashboard
                    </MobilePanel.MenuLink>
                    <MobilePanel.MenuLink href="/" passHref aria-label="logout" onClick={logout}>
                      logout
                    </MobilePanel.MenuLink>
                  </MobilePanel.DropdownMenu>
                )}
              </MobilePanel.MenuWrapper>
            )}
            <Hamburger onClick={handleMenuClick} />
          </Header.MobileWrapper>
        )}
        {(isMobile || isTablet) && showMobileMenu && <MobilePanel />}
      </Header.Wrapper>
    </>
  );
};

Header.Wrapper = styled.header`
  position: sticky;
  position: -webkit-sticky;
  top: 0;
  height: 94px;

  display: flex;
  justify-content: space-between;
  align-items: center;

  background: ${({ theme }) => theme.colors.darkBlack};
  z-index: ${({ theme }) => theme.zIndex.header};
  padding: 12px 20px;
`;

Header.Avatar = styled(Avatar)`
  margin-right: 15px;
`;

Header.MobileWrapper = styled.div`
  display: flex;
`;
