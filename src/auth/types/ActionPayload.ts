import { IAuth } from './Auth';
import { IUser } from './User';

/**
 * **************************************************
 * Global Auth Action Payload Interfaces
 * **************************************************
 */
export interface IAction {
  type: string;
}

export interface IAuthErrorAction extends IAction {
  payload?: {
    message?: string;
    cause?: string;
  };
}

/**
 * ****************************************
 * Authentication Action Payload Interfaces
 * ****************************************
 */
export interface IAuthSuccessAction extends IAction {
  payload: IAuth;
}

/**
 * ****************************************
 * Current User Action Payload Interfaces
 * ****************************************
 */
export interface ICurrentUserSuccessAction extends IAction {
  payload: IUser;
}
