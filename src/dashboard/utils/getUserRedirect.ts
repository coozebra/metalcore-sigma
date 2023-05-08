import { STORAGE } from 'shared/enums/storage';
import { nemesisServerRequest } from 'server/utils/nemesisServerRequest';

export const getUserRedirect = async ({ req, isDev = false }) => {
  // TODO: temporary workaround for lack of feature flag, remove when deposit witdraw is live
  if (isDev && !(req?.hostname?.includes('staging') || req?.hostname?.includes('localhost'))) {
    return { redirect: { destination: '/' } };
  }

  if (!req?.cookies?.[STORAGE.USER_SESSION]) {
    return { redirect: { destination: '/login' } };
  }

  // check if user session is valid
  try {
    await nemesisServerRequest(req, {
      url: '/users',
      params: { accountId: req?.cookies?.[STORAGE.USER_ACCOUNT] },
    });
  } catch (error: any) {
    return { redirect: { destination: '/login' } };
  }
};
