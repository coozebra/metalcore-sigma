import Head from 'next/head';
import styled from 'styled-components';
import Bugsnag from '@bugsnag/js';

import { Footer } from 'shared/components/Footer';
import { Header } from 'navigation/components/Header';
import { AuthenticationForm } from 'auth/components/AuthenticationForm';
import { useAuth } from 'auth/providers/AuthProvider';
import { useWeb3 } from 'web3/providers/Web3Provider';
import { ConnectWalletCard } from 'web3/components/ConnectWalletCard';
import { WalletLinkCard } from 'wallet/components/WalletLinkCard';
import { STORAGE } from 'shared/enums/storage';
import { nemesisServerRequest } from 'server/utils/nemesisServerRequest';

const LoginPage = () => {
  const { status } = useAuth();
  const { account } = useWeb3();

  return (
    <>
      <Head>
        <title>METALCORE | LOGIN</title>
      </Head>
      <Header />
      <LoginPage.Wrapper>
        <LoginPage.PrimaryBackground />
        <LoginPage.SecondaryBackground />
        <LoginPage.ContentWrapper>
          {!status.registered && <AuthenticationForm />}
          {status.registered && typeof account !== 'string' && <ConnectWalletCard />}
          {status.registered && typeof account === 'string' && <WalletLinkCard />}
        </LoginPage.ContentWrapper>
      </LoginPage.Wrapper>
      <Footer />
    </>
  );
};

export const getServerSideProps = async ({ req, query }) => {
  const isZendeskAuthCallback = query?.return_to;

  if (isZendeskAuthCallback) {
    return { props: {} };
  }

  const options = {
    url: '/users',
    params: { accountId: req?.cookies?.[STORAGE.USER_ACCOUNT] },
  };

  try {
    await nemesisServerRequest(req, options);

    return { redirect: { destination: '/dashboard' } };
  } catch (error: any) {
    Bugsnag.notify(error, event => {
      event.severity = 'error';
      event.context = 'login.getServerSideProps';
      event.addMetadata('custom', options);
    });

    return { props: {} };
  }
};

LoginPage.Wrapper = styled.div`
  display: grid;
  min-height: 85vh;
  position: relative;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 96px 12px;

  @media (min-width: ${({ theme }) => theme.breakpoints.small}px) {
    padding: 96px 38px;
  }
`;

LoginPage.PrimaryBackground = styled.div`
  height: 100%;
  width: 100%;
  background-image: url('/background-primary-login.png');
  background-color: ${({ theme }) => theme.colors.black};
  background-size: cover;
  position: absolute;
  z-index: -1;
  top: 0;
`;

LoginPage.SecondaryBackground = styled.div`
  background-image: url('/background-secondary-login.png');
  background-size: cover;
  height: 100%;
  width: 100%;
  position: absolute;
  z-index: -1;
  top: 0;
`;

LoginPage.ContentWrapper = styled.div`
  width: 100vw;
  max-width: calc(100vw - 24px);

  @media (min-width: ${({ theme }) => theme.breakpoints.small}px) {
    width: 598px;
  }
`;

export default LoginPage;
