import Cookie from 'js-cookie';
import getConfig from 'next/config';

import { IAction, ISaleErrorAction, ISalePurchaseConfirmedAction } from 'sale/types/ActionPayload';
import { saleActions } from 'sale/state/saleActions';
import { SALES_TRANSACTION_STATUS } from 'shared/enums/TransactionStatus';
import { STORAGE } from 'shared/enums/storage';

export interface ISaleState {
  transaction: {
    hash?: string;
    status: SALES_TRANSACTION_STATUS;
    error: {
      message?: string;
      cause?: string;
    };
  };
}

export const INITIAL_STATE: ISaleState = {
  transaction: {
    status: SALES_TRANSACTION_STATUS.UNPURCHASED,
    error: {},
  },
};

/**
 * ****************************************
 * Type Guards
 * ****************************************
 */
const isConfirmed = (action: IAction): action is ISalePurchaseConfirmedAction =>
  action.type === saleActions.purchaseConfirmed;

const isPurchasing = (action: IAction) => action.type === saleActions.purchaseRequest;

const isPurchased = (action: IAction) => action.type === saleActions.purchaseSuccess;

const isPurchaseError = (action: IAction): action is ISaleErrorAction =>
  action.type === saleActions.purchaseError;

/**
 * ****************************************
 * Reducer
 * ****************************************
 */
export const saleReducer = (state: ISaleState, action: IAction) => {
  const { publicRuntimeConfig } = getConfig();

  // NOTE: turn on for debugging
  if (publicRuntimeConfig.RELEASE_ENV === 'development') {
    // console.info('sale state action: ', action);
  }

  if (isPurchasing(action)) {
    state.transaction = {
      hash: '',
      status: SALES_TRANSACTION_STATUS.PURCHASING,
      error: {},
    };
  }

  if (isConfirmed(action)) {
    const { hash } = action.payload;

    state.transaction.status = SALES_TRANSACTION_STATUS.CONFIRMED;
    state.transaction.hash = hash;

    Cookie.set(STORAGE.SALE_TX_HASH, hash);
  }

  if (isPurchased(action)) {
    state.transaction.status = SALES_TRANSACTION_STATUS.PURCHASED;

    Cookie.remove(STORAGE.SALE_TX_HASH);
  }

  if (isPurchaseError(action)) {
    state.transaction.status = SALES_TRANSACTION_STATUS.ERROR;
    state.transaction.error = {
      message: action.payload?.message,
      cause: action.payload?.cause,
    };

    Cookie.remove(STORAGE.SALE_TX_HASH);
  }

  return state;
};
