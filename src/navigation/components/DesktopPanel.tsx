import styled, { css } from 'styled-components';
import { useState, useEffect } from 'react';
import getConfig from 'next/config';

import { Link, H3 } from 'shared/text';
import { ETHBalance } from 'web3/components/ETHBalance';
import { Button } from 'shared/components/Button';
import { isExpired } from 'shared/utils/date';
import { useAuth } from 'auth/providers/AuthProvider';
import { Avatar } from 'shared/components/Avatar';
import { DropdownMenu } from 'shared/components/DropdownMenu';

export const DesktopPanel = () => {
  const { publicRuntimeConfig } = getConfig();

  const { logout, status, user } = useAuth();

  const [showDashboardMenu, setShowDashboardMenu] = useState(false);

  const PRESALE_START_DATE = publicRuntimeConfig.PRESALE_START_DATE as string;
  const SALE_START_DATE = publicRuntimeConfig.SALE_START_DATE as string;

  // TODO: temporary workaround for lack of feature flag, remove when deposit witdraw is live
  const [isDev, setIsDev] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const hostname = window?.location?.hostname ?? '';

    setIsDev(hostname.includes('staging') || hostname.includes('localhost'));
  }, []);

  return (
    <>
      <DesktopPanel.Wrapper>
        <DesktopPanel.LinkRow>
          <DesktopPanel.Link
            aria-label="mainsite"
            href="https://metalcore.gg"
            target="_blank"
            rel="noreferrer"
          >
            mainsite
          </DesktopPanel.Link>
          {isExpired(PRESALE_START_DATE) && !isExpired(SALE_START_DATE) && (
            <DesktopPanel.Link href="/presale" aria-label="presale">
              presale
            </DesktopPanel.Link>
          )}

          {/* TODO: uncomment when sale is set */}
          {/* {isExpired(SALE_START_DATE) && (
            <DesktopPanel.NextLink href="/sale" passHref>
              <DesktopPanel.Link aria-label="sale">public sale</DesktopPanel.Link>
            </DesktopPanel.NextLink>
          )} */}

          {/* TODO: uncomment when leaderboard is ready */}
          {/* <Link href="/leaderboard" passHref>
            <DesktopPanel.Link aria-label="presale">leaderboard</DesktopPanel.Link>
          </Link> */}
          <DesktopPanel.Link href={isDev ? '/dashboard/nfts' : '/nfts'} aria-label="nfts">
            your nfts
          </DesktopPanel.Link>
          <DesktopPanel.Link
            aria-label="support"
            href="https://support.metalcore.gg"
            target="_blank"
            rel="noreferrer"
          >
            support
          </DesktopPanel.Link>
        </DesktopPanel.LinkRow>
        <DesktopPanel.AuthRow>
          {status.unauthenticated && (
            <DesktopPanel.Link href="/login" aria-label="login">
              login
            </DesktopPanel.Link>
          )}
          {status.authenticated && (
            <DesktopPanel.MenuWrapper>
              <DesktopPanel.Avatar onMouseEnter={() => setShowDashboardMenu(true)}>
                {user?.displayName?.substring(0, 2)}
              </DesktopPanel.Avatar>
              {showDashboardMenu && (
                <DesktopPanel.DropdownMenu onMouseLeave={() => setShowDashboardMenu(false)}>
                  <DesktopPanel.MenuLink href="/dashboard" aria-label="dashboard">
                    dashboard
                  </DesktopPanel.MenuLink>
                  <DesktopPanel.MenuLink href="/" aria-label="logout" onClick={logout}>
                    logout
                  </DesktopPanel.MenuLink>
                </DesktopPanel.DropdownMenu>
              )}
            </DesktopPanel.MenuWrapper>
          )}
          <ETHBalance />
        </DesktopPanel.AuthRow>
      </DesktopPanel.Wrapper>
    </>
  );
};

DesktopPanel.LinkWrapper = styled.div``;

DesktopPanel.LinkRow = styled.div``;

DesktopPanel.MenuWrapper = styled.div`
  position: relative;
`;

DesktopPanel.DropdownMenu = styled(DropdownMenu)`
  position: absolute;
  left: calc(-100% - 42px);
  margin-top: 22px;
`;

DesktopPanel.MenuLink = styled(Link)`
  text-decoration: none;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.white};

  &:hover {
    text-decoration: underline;
    color: ${({ theme }) => theme.colors.green};
  }
`;

DesktopPanel.AuthRow = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

DesktopPanel.Link = styled(Link)<{ $active?: boolean }>`
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

DesktopPanel.Wrapper = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 7px 14px;
  text-transform: uppercase;

  @media (max-width: ${({ theme }) => theme.breakpoints.small}px) {
    margin: 15px auto;
    position: relative;
  }
`;

DesktopPanel.Eth = styled(H3)`
  color: ${({ theme }) => theme.colors.green};
  font-weight: 600;
  font-size: 18px;
  padding-right: 25px;
  text-transform: uppercase;
`;

DesktopPanel.LoginButton = styled(Button)`
  flex-grow: 0;
  width: 100px;
`;

DesktopPanel.Avatar = styled(Avatar)`
  margin-right: 25px;
`;
