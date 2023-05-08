import Cookie from 'js-cookie';
import getConfig from 'next/config';

import {
  IAction,
  IAuthErrorAction,
  IAuthSuccessAction,
  ICurrentUserSuccessAction,
} from 'auth/types/ActionPayload';
import { authActions } from 'auth/state/authActions';
import { STORAGE } from 'shared/enums/storage';
import { IUser } from 'auth/types/User';
import { IAuth } from 'auth/types/Auth';

export interface IAuthState {
  error?: { message?: string; cause?: string };
  auth?: IAuth;
  user?: IUser;
  status: {
    authenticating: boolean;
    authenticated: boolean;
    registering: boolean;
    registered: boolean;
    unauthenticated: boolean;
  };
}

/**
 * ****************************************
 * STATE
 * ****************************************
 */
export const INITIAL_STATE: IAuthState = {
  status: {
    authenticating: false,
    authenticated: false,
    registering: false,
    registered: false,
    unauthenticated: true,
  },
};

/**
 * ****************************************
 * AUTH Type Guards
 * ****************************************
 */
const isAuthenticating = (action: IAction) => {
  return action.type === authActions.loginRequest;
};

const isAuthenticated = (action: IAction): action is IAuthSuccessAction => {
  return action.type === authActions.loginSuccess;
};

const isRegistering = (action: IAction) => {
  return action.type === authActions.registerRequest;
};

const isRegistered = (action: IAction): action is IAuthSuccessAction => {
  return action.type === authActions.registerSuccess;
};

const isUnauthenticating = (action: IAction) => {
  return action.type === authActions.logout;
};

const isUnauthenticated = (action: IAction): action is IAuthErrorAction => {
  return (
    action.type === authActions.loginError ||
    action.type === authActions.registerError ||
    action.type === authActions.currentUserError
  );
};

/**
 * ****************************************
 * USER Type Guards
 * ****************************************
 */
const isCurrentUser = (action: IAction): action is ICurrentUserSuccessAction => {
  return action.type === authActions.currentUserSuccess;
};

/**
 * ****************************************
 * CLEAN UP Type Guards
 * ****************************************
 */
const isClearErrors = (action: IAction) => action.type === authActions.clearErrors;

/**
 * ****************************************
 * REDUCER
 * ****************************************
 */
export const authReducer = (state: IAuthState, action: IAction) => {
  const { publicRuntimeConfig } = getConfig();

  // NOTE: turn on for debugging
  if (publicRuntimeConfig.RELEASE_ENV === 'development') {
    console.info('auth state action: ', action);
  }

  /**
   * ****************************************
   * Authentication Actions
   * ****************************************
   */
  if (isAuthenticating(action)) {
    state.status.authenticating = true;
    state.error = {};
  }

  if (isRegistering(action)) {
    state.status.registering = true;
    state.error = {};
  }

  if (isAuthenticated(action)) {
    state.status = {
      ...state.status,
      authenticating: false,
      authenticated: true,
      registering: false,
      unauthenticated: false,
    };
  }

  if (isRegistered(action)) {
    state.status = {
      authenticating: false,
      authenticated: true,
      registering: false,
      registered: true,
      unauthenticated: false,
    };
  }

  if (isAuthenticated(action) || isRegistered(action)) {
    state.error = {};

    if (action.payload) {
      state.auth = {
        accountId: action.payload.accountId,
        sessionTicket: action.payload.sessionTicket,
      };

      Cookie.set(STORAGE.USER_ACCOUNT, action.payload.accountId, { expires: 7 });
      Cookie.set(STORAGE.USER_SESSION, action.payload.sessionTicket, { expires: 7 });
    }
  }

  if (isUnauthenticating(action)) {
    state.status = {
      authenticating: false,
      authenticated: false,
      registering: false,
      registered: false,
      unauthenticated: false,
    };

    state.error = {};

    Cookie.remove(STORAGE.USER_ACCOUNT);
    Cookie.remove(STORAGE.USER_SESSION);
  }

  if (isUnauthenticated(action)) {
    state.status = {
      authenticating: false,
      authenticated: false,
      registering: false,
      registered: false,
      unauthenticated: false,
    };

    state.error = {
      message: action.payload?.message,
      cause: action.payload?.cause,
    };

    Cookie.remove(STORAGE.USER_ACCOUNT);
    Cookie.remove(STORAGE.USER_SESSION);
  }

  /**
   * ****************************************
   * User Actions
   * ****************************************
   */
  if (isCurrentUser(action)) {
    state.user = action.payload;

    state.status = {
      ...state.status,
      authenticated: true,
      unauthenticated: false,
    };
  }

  /**
   * ****************************************
   * Cleanup Actions
   * ****************************************
   */

  if (isClearErrors(action)) {
    state.error = {};
  }

  return state;
};
