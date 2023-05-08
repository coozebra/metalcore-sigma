import { useRouter } from 'next/router';
import { createContext, useContext, ReactNode, useEffect, Dispatch } from 'react';
import { useImmerReducer } from 'use-immer';
import axios from 'axios';
import Cookie from 'js-cookie';
import useSWR from 'swr';
import getConfig from 'next/config';
import Bugsnag from '@bugsnag/js';

import { authReducer, IAuthState, INITIAL_STATE } from 'auth/state/authReducer';
import { authActions } from 'auth/state/authActions';
import {
  IAuthErrorAction,
  IAuthSuccessAction,
  ICurrentUserSuccessAction,
} from 'auth/types/ActionPayload';
import { STORAGE } from 'shared/enums/storage';
import { nemesisErrorResponseToString } from 'shared/utils/errors';

export interface ICredentials {
  email?: string;
  displayName?: string;
  password: string;
}

interface IAuthContext extends IAuthState {
  login: (credentials: ICredentials) => void;
  logout: () => void;
  register: (credentials: ICredentials) => void;
}

export const AuthContext = createContext<IAuthContext>({
  ...INITIAL_STATE,
  login: () => new Promise(() => {}),
  logout: () => {},
  register: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { publicRuntimeConfig } = getConfig();

  const [state, dispatch] = useImmerReducer(authReducer, INITIAL_STATE);
  const router = useRouter();

  const login = async (credentials: ICredentials) => {
    dispatch({ type: authActions.loginRequest });

    try {
      const response = await axios.post('/api/v1/users/login', {
        data: { ...credentials },
      });

      const { accountId, sessionTicket, jwt } = response?.data?.data;

      (dispatch as Dispatch<IAuthSuccessAction>)({
        type: authActions.loginSuccess,
        payload: {
          accountId,
          sessionTicket,
        },
      });

      const isZendeskAuthCallback = router?.query?.return_to;

      if (isZendeskAuthCallback) {
        const zendesk = `${
          publicRuntimeConfig.ZENDESK_URL
        }/access/jwt?jwt=${jwt}&return_to=${encodeURIComponent(
          router?.query?.return_to as string,
        )}`;

        return (window.location.href = zendesk);
      }

      router.push('/dashboard');
    } catch (error: any) {
      Bugsnag.notify(error, event => {
        event.severity = 'error';
        event.context = 'AuthProvider.login';
      });

      (dispatch as Dispatch<IAuthErrorAction>)({
        type: authActions.loginError,
        payload: {
          message: nemesisErrorResponseToString(error) || 'Error authenticating. Please try again.',
        },
      });
    }
  };

  const logout = () => {
    dispatch({ type: authActions.logout });
  };

  const register = async (credentials: ICredentials) => {
    dispatch({ type: authActions.registerRequest });

    try {
      const response = await axios.post('/api/v1/users/register', { data: { ...credentials } });

      const { accountId, sessionTicket } = response?.data?.data;

      (dispatch as Dispatch<IAuthSuccessAction>)({
        type: authActions.registerSuccess,
        payload: {
          accountId,
          sessionTicket,
        },
      });
    } catch (error: any) {
      Bugsnag.notify(error, event => {
        event.severity = 'error';
        event.context = 'AuthProvider.register';
      });

      (dispatch as Dispatch<IAuthErrorAction>)({
        type: authActions.loginError,
        payload: {
          message: nemesisErrorResponseToString(error) || 'Error authenticating. Please try again.',
        },
      });
    }
  };

  const value = {
    ...state,
    login,
    logout,
    register,
  };

  useEffect(() => {
    router.events.on('routeChangeStart', () => dispatch({ type: authActions.clearErrors }));

    return () => router.events.off('routeChangeStart', () => {});
  }, []);

  useEffect(() => {
    if (publicRuntimeConfig.RELEASE_ENV === 'development') {
      console.info('auth state:', state);
    }
  }, [state]);

  const accountId = state?.user?.accountId || Cookie.get(STORAGE.USER_ACCOUNT);

  useSWR(accountId ? '/api/v1/users' : null, url => axios.get(url, { params: { accountId } }), {
    revalidateOnFocus: false,
    onError: error => {
      const message = nemesisErrorResponseToString(error) || 'Unauthenticated.';

      Bugsnag.notify(error, event => {
        event.severity = 'error';
        event.context = 'AuthProvider.login';
      });

      (dispatch as Dispatch<IAuthErrorAction>)({
        type: authActions.currentUserError,
        payload: { message },
      });

      logout();
    },
    onSuccess: response => {
      (dispatch as Dispatch<ICurrentUserSuccessAction>)({
        type: authActions.currentUserSuccess,
        payload: response?.data?.data,
      });
    },
  });

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
