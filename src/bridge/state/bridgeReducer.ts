import { BigNumberish } from '@ethersproject/bignumber';
import { BytesLike } from 'ethers';
import Cookie from 'js-cookie';

import { IGate } from 'bridge/types/Gate';
import { IOperator } from 'bridge/types/Operator';
import { bridgeActions } from 'bridge/state/bridgeActions';
import {
  IAction,
  IBridgeErrorAction,
  IBridgeBurnConfirmedAction,
  IBridgeMintConfirmedAction,
  IBridgeTransferConfirmedAction,
  IBridgeWithdrawConfirmedAction,
  IOperatorInfoSuccessAction,
  IOperatorSignatureSuccessAction,
  IBridgeSetConfirmationTransactionBlocksAction,
  IBridgeWithdrawableTxHashAction,
} from 'bridge/types/ActionPayload';
import { BRIDGE_TRANSACTION_STATUS } from 'shared/enums/TransactionStatus';
import { removeBridgeTx } from 'bridge/utils/bridgeTx';
import { STORAGE } from 'shared/enums/storage';

export interface IBridgeState {
  transaction: {
    hash?: string;
    status: BRIDGE_TRANSACTION_STATUS;
    error?: { message?: string; cause?: string };
    confirmations?: number;
  };
  modal: {
    isDepositVisible?: boolean;
    isWithdrawVisible?: boolean;
  };
  operators: IOperator[];
  signatures: {
    rs: BytesLike[];
    vs: BigNumberish[];
    ss: BytesLike[];
  };
  gate: IGate;
  withdrawableTxHash?: string;
}

/**
 * ****************************************
 * STATE
 * ****************************************
 */
export const INITIAL_STATE: IBridgeState = {
  transaction: {
    status: BRIDGE_TRANSACTION_STATUS.INITIALIZING,
    error: {},
    confirmations: 0,
  },
  modal: {
    isDepositVisible: false,
    isWithdrawVisible: false,
  },
  operators: [],
  signatures: { rs: [], vs: [], ss: [] },
  gate: {},
};

/**
 * ****************************************
 * Operator Type Guards
 * ****************************************
 */
const isInitializing = (action: IAction) => action.type === bridgeActions.operatorInfoRequest;

const isInitialized = (action: IAction): action is IOperatorInfoSuccessAction =>
  action.type === bridgeActions.operatorInfoSuccess;

const isOperatorSignatureFetching = (action: IAction) =>
  action.type === bridgeActions.operatorSignatureRequest;

const isOperatorSignatureSuccess = (action: IAction): action is IOperatorSignatureSuccessAction =>
  action.type === bridgeActions.operatorSignatureSuccess;

/**
 * ****************************************
 * Deposit Transaction Type Guards
 * ****************************************
 */
const isConfirmationTransactionBlock = (
  action: IAction,
): action is IBridgeSetConfirmationTransactionBlocksAction =>
  action.type === bridgeActions.setTransactionConfirmationBlocks;

/**
 * ****************************************
 * Withdraw Transaction Type Guards
 * ****************************************
 */
const isWithdrawableTxHash = (action: IAction): action is IBridgeWithdrawableTxHashAction =>
  action.type === bridgeActions.withdrawableTxHash;

/**
 * ****************************************
 * Burn Type Guards
 * ****************************************
 */
const isBurning = (action: IAction) => action.type === bridgeActions.burnRequest;

const isBurnConfirmed = (action: IAction): action is IBridgeBurnConfirmedAction =>
  action.type === bridgeActions.burnConfirmed;

const isBurned = (action: IAction) => action.type === bridgeActions.burnSuccess;

/**
 * ****************************************
 * Transfer Type Guards
 * ****************************************
 */
const isTransferring = (action: IAction) => action.type === bridgeActions.transferRequest;

const isTransferConfirmed = (action: IAction): action is IBridgeTransferConfirmedAction =>
  action.type === bridgeActions.transferConfirmed;

const isTransferred = (action: IAction) => action.type === bridgeActions.transferSuccess;

/**
 * ****************************************
 * Mint Type Guards
 * ****************************************
 */
const isMintableRequest = (action: IAction) => action.type === bridgeActions.mintableRequest;

const isMintable = (action: IAction) => action.type === bridgeActions.mintSuccess;

const isMinting = (action: IAction) => action.type === bridgeActions.mintRequest;

const isMintConfirmed = (action: IAction): action is IBridgeMintConfirmedAction =>
  action.type === bridgeActions.mintConfirmed;

const isMinted = (action: IAction): action is IBridgeWithdrawConfirmedAction =>
  action.type === bridgeActions.mintSuccess;

/**
 * ****************************************
 * Withdraw Type Guards
 * ****************************************
 */
const isWithdrawableRequest = (action: IAction) =>
  action.type === bridgeActions.withdrawableRequest;

const isWithdrawable = (action: IAction) => action.type === bridgeActions.withdrawSuccess;

const isWithdrawing = (action: IAction) => action.type === bridgeActions.withdrawRequest;

const isWithdrawConfirmed = (action: IAction): action is IBridgeWithdrawConfirmedAction =>
  action.type === bridgeActions.withdrawConfirmed;

const isWithdrawn = (action: IAction): action is IBridgeWithdrawConfirmedAction =>
  action.type === bridgeActions.withdrawSuccess;

/**
 * ****************************************
 * Modal Type Guards
 * ****************************************
 */
const isDepositModalDisplayed = (action: IAction) =>
  action.type === bridgeActions.displayDepositModal;

const isDepositModalDismissed = (action: IAction) =>
  action.type === bridgeActions.dismissDepositModal;

const isWithdrawModalDisplayed = (action: IAction) =>
  action.type === bridgeActions.displayWithdrawModal;

const isWithdrawModalDismissed = (action: IAction) =>
  action.type === bridgeActions.dismissWithdrawModal;

/**
 * ****************************************
 * Error Type Guards
 * ****************************************
 */
const isError = (action: IAction): action is IBridgeErrorAction =>
  action.type === bridgeActions.burnError ||
  action.type === bridgeActions.mintableError ||
  action.type === bridgeActions.mintError ||
  action.type === bridgeActions.operatorInfoError ||
  action.type === bridgeActions.operatorSignatureError ||
  action.type === bridgeActions.transferError ||
  action.type === bridgeActions.withdrawableError ||
  action.type === bridgeActions.withdrawError;

/**
 * ****************************************
 * REDUCER
 * ****************************************
 */
export const bridgeReducer = (state: IBridgeState, action: IAction) => {
  // NOTE: turn on for debugging
  if (process.env.NODE_ENV === 'development') {
    // console.info('bridge state action: ', action);
  }

  /**
   * ****************************************
   * Operator Actions
   * ****************************************
   */
  if (isInitializing(action)) {
    state.transaction.status = BRIDGE_TRANSACTION_STATUS.INITIALIZING;
  }

  if (isInitialized(action)) {
    state.transaction.status = BRIDGE_TRANSACTION_STATUS.INITIALIZED;
    state.operators.push(action.payload.data);

    const gates: IGate[] = [];

    state.operators.map(operator => {
      gates.push(
        { ...operator?.homeGate, position: 'homeGate' },
        { ...operator?.foreignGate, position: 'foreignGate' },
      );
    });

    const gate = gates?.filter(
      _gate => Number(_gate?.network?.chainId) === Number(action.payload.chainId),
    )[0];

    // NOTE: sets the user's current gate
    state.gate = gate;
  }

  if (isOperatorSignatureFetching(action)) {
    // TODO: perhaps a loading state
  }

  if (isOperatorSignatureSuccess(action)) {
    state.signatures = action.payload.signatures;
  }

  /**
   * ****************************************
   * Deposit Transaction Actions
   * ****************************************
   */
  if (isConfirmationTransactionBlock(action)) {
    state.transaction.confirmations = action.payload.confirmations;
  }

  /**
   * ****************************************
   * Deposit Transaction Actions
   * ****************************************
   */
  if (isWithdrawableTxHash(action)) {
    state.withdrawableTxHash = action.payload.hash;
  }

  /**
   * ****************************************
   * Burn Actions
   * ****************************************
   */
  if (isBurning(action)) {
    state.transaction.status = BRIDGE_TRANSACTION_STATUS.BURNING;
  }

  if (isBurnConfirmed(action)) {
    const { hash } = action.payload;

    state.transaction.status = BRIDGE_TRANSACTION_STATUS.CONFIRMED;
    state.transaction.hash = hash;

    Cookie.set(STORAGE.BRIDGE_DEPOSIT_TX_HASH, hash);
  }

  if (isBurned(action)) {
    state.transaction.status = BRIDGE_TRANSACTION_STATUS.BURNED;
    state.transaction.confirmations = 0;

    Cookie.remove(STORAGE.BRIDGE_DEPOSIT_TX_HASH);
  }

  /**
   * ****************************************
   * Transfer Actions
   * ****************************************
   */
  if (isTransferring(action)) {
    state.transaction.status = BRIDGE_TRANSACTION_STATUS.TRANSFERRING;
  }

  if (isTransferConfirmed(action)) {
    const { hash } = action.payload;

    state.transaction.status = BRIDGE_TRANSACTION_STATUS.CONFIRMED;
    state.transaction.hash = hash;

    Cookie.set(STORAGE.BRIDGE_DEPOSIT_TX_HASH, hash);
  }

  if (isTransferred(action)) {
    state.transaction.status = BRIDGE_TRANSACTION_STATUS.TRANSFERRED;
    state.transaction.confirmations = 0;

    Cookie.remove(STORAGE.BRIDGE_DEPOSIT_TX_HASH);
  }

  /**
   * ****************************************
   * Mint Actions
   * ****************************************
   */
  if (isMintableRequest(action)) {
    state.transaction.status = BRIDGE_TRANSACTION_STATUS.MINTABLE_REQUESTED;
  }

  if (isMintable(action)) {
    state.transaction.status = BRIDGE_TRANSACTION_STATUS.MINTABLE;
  }

  if (isMinting(action)) {
    state.transaction.status = BRIDGE_TRANSACTION_STATUS.MINTING;
  }

  if (isMintConfirmed(action)) {
    const { hash } = action.payload;

    state.transaction.status = BRIDGE_TRANSACTION_STATUS.CONFIRMED;
    state.transaction.hash = hash;

    Cookie.set(STORAGE.BRIDGE_MINT_TX_HASH, hash);
  }

  if (isMinted(action)) {
    state.transaction.status = BRIDGE_TRANSACTION_STATUS.MINTED;

    removeBridgeTx(state.withdrawableTxHash);

    state.withdrawableTxHash = '';

    Cookie.remove(STORAGE.BRIDGE_MINT_TX_HASH);
  }

  /**
   * ****************************************
   * Withdraw Actions
   * ****************************************
   */
  if (isWithdrawableRequest(action)) {
    state.transaction.status = BRIDGE_TRANSACTION_STATUS.WITHDRAWABLE_REQUESTED;
  }

  if (isWithdrawable(action)) {
    state.transaction.status = BRIDGE_TRANSACTION_STATUS.WITHDRAWABLE;
  }

  if (isWithdrawing(action)) {
    state.transaction.status = BRIDGE_TRANSACTION_STATUS.WITHDRAWING;
  }

  if (isWithdrawConfirmed(action)) {
    const { hash } = action.payload;

    state.transaction.status = BRIDGE_TRANSACTION_STATUS.CONFIRMED;
    state.transaction.hash = hash;

    Cookie.set(STORAGE.BRIDGE_WITHDRAW_TX_HASH, hash);
  }

  if (isWithdrawn(action)) {
    state.transaction.status = BRIDGE_TRANSACTION_STATUS.WITHDRAWN;

    removeBridgeTx(state.withdrawableTxHash);

    Cookie.remove(STORAGE.BRIDGE_WITHDRAW_TX_HASH);
  }

  /**
   * ****************************************
   * Modal Actions
   * ****************************************
   */
  if (isDepositModalDisplayed(action)) {
    state.modal.isDepositVisible = true;
  }

  if (isDepositModalDismissed(action)) {
    state.modal.isDepositVisible = false;
  }

  if (isWithdrawModalDisplayed(action)) {
    state.modal.isWithdrawVisible = true;
  }

  if (isWithdrawModalDismissed(action)) {
    state.modal.isWithdrawVisible = false;
  }

  /**
   * ****************************************
   * Error Actions
   * ****************************************
   */
  if (isError(action)) {
    state.transaction.status = BRIDGE_TRANSACTION_STATUS.ERROR;
    state.transaction.error = {
      message: action.payload?.message,
      cause: action.payload?.cause,
    };

    switch (action.type) {
      case bridgeActions.burnError:
      case bridgeActions.transferError:
        Cookie.remove(STORAGE.BRIDGE_DEPOSIT_TX_HASH);
        break;
      case bridgeActions.mintError:
        Cookie.remove(STORAGE.BRIDGE_MINT_TX_HASH);
        break;
      case bridgeActions.withdrawError:
        Cookie.remove(STORAGE.BRIDGE_WITHDRAW_TX_HASH);
        break;
      default:
        break;
    }
  }

  return state;
};
