import { InjectedConnector } from '@web3-react/injected-connector';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';
import { BscConnector } from '@binance-chain/bsc-connector';
import getConfig from 'next/config';

import { supportedChainIds } from 'web3/constants/supportedChainIds';

interface IConnectors {
  [key: string]: any;
}

const { publicRuntimeConfig } = getConfig();

const API_KEY = publicRuntimeConfig.INFURA_API_KEY as string;

// TODO: initialize connectors on server
export const connectors: IConnectors = {
  injected: new InjectedConnector({ supportedChainIds }),
  walletconnect: new WalletConnectConnector({
    rpc: {
      1: `https://mainnet.infura.io/v3/${API_KEY}`,
      3: `https://ropsten.infura.io/v3/${API_KEY}`,
    },
  }),
  bsc: new BscConnector({ supportedChainIds }),
};
