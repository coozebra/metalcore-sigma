import axios from 'axios';
import getConfig from 'next/config';

import { STORAGE } from '../../shared/enums/storage';

export const nemesisServerRequest = async (req, options) => {
  const { serverRuntimeConfig } = getConfig();

  if (!options.url || typeof options.url !== 'string') {
    throw new Error('required url.');
  }

  const config = {
    ...options,
    baseURL: serverRuntimeConfig.NEMESIS_API_URL,
    headers: {
      ...options.headers,
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${req?.cookies?.[STORAGE.USER_SESSION]}`,
    },
    method: options.method || 'GET',
  };

  try {
    const response = await axios.request(config);

    return response;
  } catch (error: any) {
    const detail = error?.response?.data?.errors?.[0]?.detail;

    if (detail) {
      error.message = detail;
    }

    throw new Error(detail);
  }
};
