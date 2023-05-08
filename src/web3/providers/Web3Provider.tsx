import { useEffect, useState, createContext, useContext } from 'react';
import { useWeb3React, UnsupportedChainIdError } from '@web3-react/core';
import { UserRejectedRequestError as WalletConnectUserRejectedError } from '@web3-react/walletconnect-connector';
import {
  NoEthereumProviderError,
  UserRejectedRequestError as InjectedUserRejectedError,
} from '@web3-react/injected-connector';
import {
  NoBscProviderError,
  UserRejectedRequestError as BSCUserRejectedError,
} from '@binance-chain/bsc-connector';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';

import { useCookie } from 'shared/hooks/useCookie';
import { connectors } from 'web3/utils';
import { useEthereum } from 'web3/hooks/useEthereum';
import { supportedChainIds } from 'web3/constants/supportedChainIds';

interface IUseWeb3 {
  account?: string | null;
  active?: boolean;
  chainId?: number;
  connected: boolean;
  connecting: boolean;
  connectToWallet: (params?: any) => void;
  ENS: string;
  error?: Error;
  hasConnector: boolean;
  hideModal: () => void;
  isCorrectChain: boolean;
  isDisplayingModal: boolean;
  library: any;
  showModal: () => void;
}

const initialState: IUseWeb3 = {
  account: undefined,
  active: false,
  chainId: undefined,
  connected: false,
  connecting: false,
  connectToWallet: () => {},
  ENS: '',
  error: undefined,
  hasConnector: false,
  hideModal: () => {},
  isCorrectChain: false,
  isDisplayingModal: false,
  library: undefined,
  showModal: () => {},
};

const Web3Context = createContext(initialState);

export const Web3Provider = ({ children }) => {
  const { account, activate, deactivate, active, chainId, library } = useWeb3React();
  const { ethereum } = useEthereum();
  const [connecting, setConnecting] = useState(false);
  const [triedConnecting, setTriedConnecting] = useState<string | undefined>(undefined);
  const [isDisplayingModal, setIsDisplayingModal] = useState(false);
  const [hasConnector, setHasConnector] = useState(true);
  const [isCorrectChain, setIsCorrectChain] = useState(true);
  const [error, setError] = useState<Error | undefined>(undefined);
  const [ENS, setENS] = useState('');

  const {
    value: connectorId,
    remove: removeConnectorId,
    update: updateConnectorId,
  } = useCookie('connectorId');

  const isChainSupported = chainId => supportedChainIds.includes(chainId);

  const connector = connectorId && connectors[connectorId];
  const activateConnector = () => activate(connector, handleError).catch(handleError);

  const isWalletConnect = connector instanceof WalletConnectConnector;

  const clearErrors = () => {
    setError(undefined);
    setHasConnector(true);
    setIsCorrectChain(true);
  };

  const showModal = () => setIsDisplayingModal(true);

  const hideModal = () => {
    clearErrors();
    setIsDisplayingModal(false);
  };

  const connected = !!account;

  useEffect(() => {
    async function setListeners() {
      ethereum.on('chainChanged', () => window.location.reload());

      ethereum.on('accountsChanged', (accounts: Array<string>) => {
        const [address] = accounts;

        if (!address) {
          deactivate();
          removeConnectorId();
          return;
        }
      });
    }

    if (ethereum) {
      setListeners();
    }
  }, [ethereum]);

  useEffect(() => {
    if (chainId) {
      setIsCorrectChain(isChainSupported(chainId));
    }
  }, [chainId]);

  useEffect(() => {
    if (connector && !isWalletConnect) {
      connector.isAuthorized().then(isAuthorized => {
        if (isAuthorized) {
          activateConnector();
        }
      });

      return;
    }

    const walletConnect = window.localStorage.getItem('walletconnect');

    if (walletConnect) {
      const parsedJson = JSON.parse(walletConnect);

      if (parsedJson.connected) {
        activateConnector();
      }
    }
  }, [activate, connectorId]);

  useEffect(() => {
    if (connected && isChainSupported(chainId) && triedConnecting) {
      hideModal();
      updateConnectorId(triedConnecting);
      setTriedConnecting(undefined);
    }
  }, [connected, triedConnecting]);

  const handleTriedConnect = (connectorId: string) => {
    setConnecting(false);
    setTriedConnecting(connectorId);
  };

  const handleError = (error: Error) => {
    setError(error);
    deactivate();

    switch (true) {
      case error instanceof NoEthereumProviderError:
      case error instanceof NoBscProviderError:
        setHasConnector(false);
        break;
      case error instanceof UnsupportedChainIdError:
        setIsCorrectChain(false);
        break;
      case error instanceof WalletConnectUserRejectedError:
      case error instanceof InjectedUserRejectedError:
      case error instanceof BSCUserRejectedError:
        removeConnectorId();
        break;
      default:
        break;
    }
  };

  const connectToWallet = (connectorId: string) => {
    setConnecting(true);

    try {
      activate(connectors[connectorId], handleError, true)
        .then(() => handleTriedConnect(connectorId))
        .catch(handleError);
    } catch (error) {
      handleError(error as Error);
    }
  };

  useEffect(() => {
    if (active || error) {
      setConnecting(false);
    }
  }, [active, error]);

  // NOTE: set ethereum name service
  useEffect(() => {
    if (library && typeof account === 'string') {
      let stale = false;

      library
        .lookupAddress(account)
        .then((name: string) => {
          if (!stale && typeof name === 'string') {
            setENS(name);
          }
        })
        .catch(() => {});

      return () => {
        stale = true;
        setENS('');
      };
    }
  }, [account, chainId, library]);

  return (
    <Web3Context.Provider
      value={{
        account,
        active,
        chainId,
        connected,
        connecting,
        connectToWallet,
        ENS,
        error,
        hasConnector,
        hideModal,
        isCorrectChain,
        isDisplayingModal,
        library,
        showModal,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = () => useContext(Web3Context);
