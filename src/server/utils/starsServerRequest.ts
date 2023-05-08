import axios, { AxiosRequestConfig } from 'axios';
import getConfig from 'next/config';

export const starsServerRequest = async (req, options: AxiosRequestConfig) => {
  const { serverRuntimeConfig } = getConfig();

  if (!options.url || typeof options.url !== 'string') {
    throw new Error('required url.');
  }

  try {
    const response = await axios.request({
      ...options,
      baseURL: serverRuntimeConfig.STARS_API_URL,
      headers: {
        ...options.headers,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: options.method || 'GET',
    });

    return response;
  } catch (error: any) {
    const detail = error?.response?.data?.errors?.[0]?.detail;

    if (detail) {
      error.message = detail;
    }

    throw new Error(detail);
  }
};
