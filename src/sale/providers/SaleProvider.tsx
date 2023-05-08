import { createContext, Dispatch, ReactNode, useContext, useEffect } from 'react';
import { useImmerReducer } from 'use-immer';
import getConfig from 'next/config';

import { INITIAL_STATE, ISaleState, saleReducer } from 'sale/state/saleReducer';
import { IUseSalePurchase, useSalePurchase } from 'sale/hooks/useSalePurchase';
import { saleActions } from 'sale/state/saleActions';
import { ISalePurchaseConfirmedAction, ISaleErrorAction } from 'sale/types/ActionPayload';

interface ISaleContext extends ISaleState, IUseSalePurchase {
  purchaseConfirmedDispatcher: (hash: string) => void;
  purchaseErrorDispatcher: (hash?: string, message?: string) => void;
  purchaseSuccessDispatcher: () => void;
}

export const SaleContext = createContext<ISaleContext>({
  ...INITIAL_STATE,
  getTransactionReceipt: async () => null,
  purchase: () => ({ data: '' }),
  purchaseConfirmedDispatcher: () => {},
  purchaseErrorDispatcher: () => {},
  purchaseSuccessDispatcher: () => {},
  waitForPurchaseTransaction: () => {},
});

export const useSale = () => useContext(SaleContext);

export const SaleProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useImmerReducer(saleReducer, INITIAL_STATE);
  const { publicRuntimeConfig } = getConfig();

  const { getTransactionReceipt, purchase, waitForPurchaseTransaction } = useSalePurchase({
    dispatch,
  });

  /**
   * ****************************************
   * Dispatchers
   * ****************************************
   */
  const purchaseConfirmedDispatcher = (hash: string) => {
    (dispatch as Dispatch<ISalePurchaseConfirmedAction>)({
      type: saleActions.purchaseConfirmed,
      payload: { hash },
    });
  };

  const purchaseErrorDispatcher = (
    hash?: string,
    message = 'Your transaction failed. Please try again.',
  ) => {
    (dispatch as Dispatch<ISaleErrorAction>)({
      type: saleActions.purchaseError,
      payload: { message, cause: hash },
    });
  };

  const purchaseSuccessDispatcher = () => {
    dispatch({ type: saleActions.purchaseSuccess });
  };

  const value = {
    ...state,
    getTransactionReceipt,
    purchase,
    purchaseConfirmedDispatcher,
    purchaseErrorDispatcher,
    purchaseSuccessDispatcher,
    waitForPurchaseTransaction,
  };

  useEffect(() => {
    // NOTE: turn on for debugging
    if (publicRuntimeConfig.RELEASE_ENV === 'development') {
      // console.info('sale state:', state);
    }
  }, [state]);

  return <SaleContext.Provider value={value}>{children}</SaleContext.Provider>;
};
