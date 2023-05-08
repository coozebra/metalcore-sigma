import axios from 'axios';
import useSWR from 'swr';

import { useSWRLiveData } from 'web3/hooks/useSWRLiveData';
import { useAuth } from 'auth/providers/AuthProvider';
import { INFT } from 'dashboard/types/NFT';

export interface IUseAPIAssets {
  data: INFT[];
  error: Error;
  isLoading: boolean;
}

export const useAPIAssets = ({ fallbackData }): IUseAPIAssets => {
  const { user } = useAuth();
  const accountId = user?.accountId;

  const response = useSWR(accountId ? '/api/v1/users/nfts' : null, url => axios.get(url), {
    fallbackData,
  }) as { data: { data: INFT[] }; error: Error; mutate: (arg0?: any) => any };

  useSWRLiveData({ mutate: response.mutate });

  const { data, error } = response;

  return {
    data: data?.data ?? [],
    error,
    isLoading: !error && !data,
  };
};
