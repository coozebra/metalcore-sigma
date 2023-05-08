/**
 * **************************************************
 * Contract Action Payload Interfaces
 * **************************************************
 */

export interface IAction {
  type: string;
}

export interface ISaleErrorAction extends IAction {
  payload: {
    message?: string;
    cause?: string;
  };
}

export interface ISalePurchaseConfirmedAction extends IAction {
  payload: {
    hash: string;
  };
}
