/**
 * **************************************************
 * Contract Action Payload Interfaces
 * **************************************************
 */

export interface IAction {
  type: string;
}

export interface IPresaleErrorAction extends IAction {
  payload: {
    message?: string;
    cause?: string;
  };
}

export interface IPresalePurchaseConfirmedAction extends IAction {
  payload: {
    hash: string;
  };
}

export interface IPresaleWhitelistSuccessAction extends IAction {
  payload: {
    signature?: string;
  };
}
