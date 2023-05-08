import { BigNumberish } from '@ethersproject/bignumber';
import { BytesLike } from 'ethers';

import { IOperator } from './Operator';

/**
 * **************************************************
 * Global Bridge Action Payload Interfaces
 * **************************************************
 */
export interface IAction {
  type: string;
}

export interface IBridgeErrorAction extends IAction {
  payload: {
    message?: string;
    cause?: string;
  };
}

export interface IBridgeSetConfirmationTransactionBlocksAction extends IAction {
  payload: { confirmations: number };
}

export interface IBridgeWithdrawableTxHashAction extends IAction {
  payload: { hash: string };
}

/**
 * ****************************************
 * Operator Action Payload Interfaces
 * ****************************************
 */
export interface IOperatorInfoSuccessAction extends IAction {
  payload: {
    data: IOperator;
    chainId: number;
  };
}

export interface IOperatorSignatureSuccessAction extends IAction {
  payload: {
    signatures: {
      rs: BytesLike[];
      vs: BigNumberish[];
      ss: BytesLike[];
    };
  };
}

/**
 * ****************************************
 * Burn Action Payload Interfaces
 * ****************************************
 */
export interface IBridgeBurnConfirmedAction extends IAction {
  payload: {
    hash: string;
  };
}

/**
 * ****************************************
 * Mint Action Payload Interfaces
 * ****************************************
 */
export interface IBridgeMintConfirmedAction extends IAction {
  payload: {
    hash: string;
  };
}

/**
 * ****************************************
 * Transfer Action Payload Interfaces
 * ****************************************
 */
export interface IBridgeTransferConfirmedAction extends IAction {
  payload: {
    hash: string;
  };
}

/**
 * ****************************************
 * Withdraw Action Payload Interfaces
 * ****************************************
 */
export interface IBridgeWithdrawConfirmedAction extends IAction {
  payload: {
    hash: string;
  };
}
