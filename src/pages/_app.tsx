import type { AppProps } from 'next/app';
import { ThemeProvider } from 'styled-components';
import Head from 'next/head';
import { Web3ReactProvider } from '@web3-react/core';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import getConfig from 'next/config';

import { AuthProvider } from 'auth/providers/AuthProvider';
import { BugsnagProvider } from 'shared/providers/BugsnagProvider';
import { GeofenceProvider } from 'shared/providers/GeofenceProvider';
import { getLibrary } from 'web3/utils';
import { PresaleProvider } from 'presale/providers/PresaleProvider';
import { theme } from 'styles/theme';
import { Web3Provider } from 'web3/providers/Web3Provider';
import GlobalStyles from 'styles/global';

import '../styles/reset.css';

const App = ({ Component, pageProps }: AppProps) => {
  const { publicRuntimeConfig } = getConfig();

  return (
    <BugsnagProvider>
      <Head>
        <link rel="icon" href="/favicon.png" key="favicon" />
        <meta name="description" content="METALCORE NFT sales portal" key="description" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0 maximum-scale=1.0"
          key="viewport"
        />
        <meta property="og:title" content="METALCORE NFT sales portal" key="og:title" />
      </Head>

      <GlobalStyles />
      <GeofenceProvider>
        <Web3ReactProvider getLibrary={getLibrary}>
          <Web3Provider>
            <ThemeProvider theme={theme}>
              <AuthProvider>
                <PresaleProvider>
                  <GoogleReCaptchaProvider
                    reCaptchaKey={publicRuntimeConfig.RECAPTCHA_KEY as string}
                  >
                    <Component {...pageProps} />
                  </GoogleReCaptchaProvider>
                </PresaleProvider>
              </AuthProvider>
            </ThemeProvider>
          </Web3Provider>
        </Web3ReactProvider>
      </GeofenceProvider>
    </BugsnagProvider>
  );
};

export default App;
