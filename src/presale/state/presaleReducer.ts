import Cookie from 'js-cookie';
import getConfig from 'next/config';

import {
  IAction,
  IPresaleErrorAction,
  IPresalePurchaseConfirmedAction,
  IPresaleWhitelistSuccessAction,
} from 'presale/types/ActionPayload';
import { presaleActions } from 'presale/state/presaleActions';
import { PRESALE_TRANSACTION_STATUS } from 'shared/enums/TransactionStatus';
import { STORAGE } from 'shared/enums/storage';

export interface IPresaleState {
  transaction: {
    hash?: string;
    status: PRESALE_TRANSACTION_STATUS;
    error: {
      message?: string;
      cause?: string;
    };
  };
  whitelist: {
    signature?: string;
  };
}

export const INITIAL_STATE: IPresaleState = {
  transaction: {
    status: PRESALE_TRANSACTION_STATUS.UNPURCHASED,
    error: {},
  },
  whitelist: {},
};

/**
 * ****************************************
 * Purchase Type Guards
 * ****************************************
 */
const isConfirmedGuard = (action: IAction): action is IPresalePurchaseConfirmedAction =>
  action.type === presaleActions.purchaseConfirmed;

const isPurchasingGuard = (action: IAction) => action.type === presaleActions.purchaseRequest;

const isPurchasedGuard = (action: IAction) => action.type === presaleActions.purchaseSuccess;

const isPurchaseErrorGuard = (action: IAction): action is IPresaleErrorAction =>
  action.type === presaleActions.purchaseError;

/**
 * ****************************************
 * Purchase Type Guards
 * ****************************************
 */
const isWhitelistRequestGuard = (action: IAction) =>
  action.type === presaleActions.whitelistRequest;

const isWhitelistSucessGuard = (action: IAction): action is IPresaleWhitelistSuccessAction =>
  action.type === presaleActions.whitelistSuccess;

const isWhitelistErrorGuard = (action: IAction): action is IPresaleErrorAction =>
  action.type === presaleActions.whitelistError;

/**
 * ****************************************
 * Reducer
 * ****************************************
 */
export const presaleReducer = (state: IPresaleState, action: IAction) => {
  const { publicRuntimeConfig } = getConfig();

  // NOTE: turn on for debugging
  if (publicRuntimeConfig.RELEASE_ENV === 'development') {
    // console.info('presale state action: ', action);
  }

  if (isPurchasingGuard(action)) {
    state.transaction = {
      hash: '',
      status: PRESALE_TRANSACTION_STATUS.PURCHASING,
      error: {},
    };
  }

  if (isConfirmedGuard(action)) {
    const { hash } = action.payload;

    state.transaction.status = PRESALE_TRANSACTION_STATUS.CONFIRMED;
    state.transaction.hash = hash;

    Cookie.set(STORAGE.PRESALE_TX_HASH, hash);
  }

  if (isPurchasedGuard(action)) {
    state.transaction.status = PRESALE_TRANSACTION_STATUS.PURCHASED;

    Cookie.remove(STORAGE.PRESALE_TX_HASH);
  }

  if (isPurchaseErrorGuard(action)) {
    state.transaction.status = PRESALE_TRANSACTION_STATUS.ERROR;
    state.transaction.error = {
      message: action.payload?.message,
      cause: action.payload?.cause,
    };

    Cookie.remove(STORAGE.PRESALE_TX_HASH);
  }

  if (isWhitelistRequestGuard(action)) {
    // TODO: need loading state
  }

  if (isWhitelistSucessGuard(action)) {
    state.whitelist.signature = action.payload?.signature;
  }

  if (isWhitelistErrorGuard(action)) {
    // TODO: need global error
  }

  return state;
};
