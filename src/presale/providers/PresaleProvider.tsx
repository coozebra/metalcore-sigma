import { createContext, Dispatch, ReactNode, useContext, useEffect, useState } from 'react';
import { useImmerReducer } from 'use-immer';
import axios from 'axios';
import { useRouter } from 'next/router';
import Bugsnag from '@bugsnag/js';
import getConfig from 'next/config';

import { useWeb3 } from 'web3/providers/Web3Provider';
import { INITIAL_STATE, IPresaleState, presaleReducer } from 'presale/state/presaleReducer';
import { IUsePresalePurchase, usePresalePurchase } from 'presale/hooks/usePresalePurchase';
import { presaleActions } from 'presale/state/presaleActions';
import {
  IPresalePurchaseConfirmedAction,
  IPresaleErrorAction,
  IPresaleWhitelistSuccessAction,
} from 'presale/types/ActionPayload';

interface IPresaleContext extends IPresaleState, IUsePresalePurchase {
  purchaseConfirmedDispatcher: (hash: string) => void;
  purchaseErrorDispatcher: (hash?: string, message?: string) => void;
  purchaseSuccessDispatcher: () => void;
  whitelistRequestDispatcher: () => void;
  whitelistErrorDispatcher: (message?: string) => void;
  whitelistSuccessDispatcher: (payload) => void;
}

export const PresaleContext = createContext<IPresaleContext>({
  ...INITIAL_STATE,
  getTransactionReceipt: async () => null,
  purchase: () => ({ data: '' }),
  purchaseConfirmedDispatcher: () => {},
  purchaseErrorDispatcher: () => {},
  purchaseSuccessDispatcher: () => {},
  waitForPurchaseTransaction: () => {},
  whitelistRequestDispatcher: () => {},
  whitelistErrorDispatcher: () => {},
  whitelistSuccessDispatcher: () => {},
});

export const usePresale = () => useContext(PresaleContext);

export const PresaleProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useImmerReducer(presaleReducer, INITIAL_STATE);
  const { account, active } = useWeb3();
  const [hasFetchedWhitelist, setHasFetchedWhitelist] = useState(false);
  const router = useRouter();
  const { publicRuntimeConfig } = getConfig();

  const { getTransactionReceipt, purchase, waitForPurchaseTransaction } = usePresalePurchase({
    dispatch,
  });

  /**
   * ****************************************
   * Purchase Dispatchers
   * ****************************************
   */
  const purchaseConfirmedDispatcher = (hash: string) => {
    (dispatch as Dispatch<IPresalePurchaseConfirmedAction>)({
      type: presaleActions.purchaseConfirmed,
      payload: { hash },
    });
  };

  const purchaseErrorDispatcher = (
    hash?: string,
    message = 'Your transaction failed. Please try again.',
  ) => {
    (dispatch as Dispatch<IPresaleErrorAction>)({
      type: presaleActions.purchaseError,
      payload: { message, cause: hash },
    });
  };

  const purchaseSuccessDispatcher = () => {
    dispatch({ type: presaleActions.purchaseSuccess });
  };

  /**
   * ****************************************
   * Whitelist Dispatchers
   * ****************************************
   */
  const whitelistRequestDispatcher = () => {
    dispatch({ type: presaleActions.whitelistRequest });
  };

  const whitelistErrorDispatcher = (message = 'Error retrieving whitelist.') => {
    (dispatch as Dispatch<IPresaleErrorAction>)({
      type: presaleActions.whitelistError,
      payload: { message },
    });
  };

  const whitelistSuccessDispatcher = payload => {
    (dispatch as Dispatch<IPresaleWhitelistSuccessAction>)({
      type: presaleActions.whitelistSuccess,
      payload,
    });
  };

  /**
   * ****************************************
   * Initializers
   * ****************************************
   */
  const getInitialWhitelistSignature = async () => {
    whitelistRequestDispatcher();

    try {
      const response = await axios.get('/api/v1/whitelist', {
        params: { walletAddress: account?.toLowerCase() },
      });

      whitelistSuccessDispatcher(response?.data);
    } catch (error: any) {
      whitelistErrorDispatcher(error?.message);

      Bugsnag.notify(error, event => {
        event.severity = 'error';
        event.context = 'PresaleProvider.getInitialWhitelistSignature';
      });
    }
  };

  const value = {
    ...state,
    getTransactionReceipt,
    purchase,
    purchaseConfirmedDispatcher,
    purchaseErrorDispatcher,
    purchaseSuccessDispatcher,
    waitForPurchaseTransaction,
    whitelistRequestDispatcher,
    whitelistErrorDispatcher,
    whitelistSuccessDispatcher,
  };

  useEffect(() => {
    // NOTE: turn on for debugging
    if (publicRuntimeConfig.RELEASE_ENV === 'development') {
      console.info('presale state:', state);
    }
  }, [state]);

  useEffect(() => {
    if (!router.isReady) return;

    const { asPath } = router;

    if (
      active &&
      !hasFetchedWhitelist &&
      (asPath.includes('/presale') || asPath.includes('/sale'))
    ) {
      setHasFetchedWhitelist(true);
      getInitialWhitelistSignature();
    }
  }, [account, active, router.isReady]);

  return <PresaleContext.Provider value={value}>{children}</PresaleContext.Provider>;
};
