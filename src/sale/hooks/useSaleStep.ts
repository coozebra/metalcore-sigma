import useSWR from 'swr';

import { useWeb3 } from 'web3/providers/Web3Provider';
import { useSWRLiveData } from 'web3/hooks/useSWRLiveData';
import type { Sale } from 'contracts/types';
import SALE_ABI from 'contracts/ABI/Sale.json';
import { useContract } from 'shared/hooks/useContract';

export const useSaleStep = (contractAddress: string) => {
  const { account } = useWeb3();
  const contract = useContract<Sale>(contractAddress, SALE_ABI);

  const key = ['useSaleStep', account, contractAddress];
  const canFetch = typeof account === 'string' && !!contract;

  const response = useSWR(canFetch ? key : null, () => contract?.step());

  useSWRLiveData({ mutate: response.mutate });

  return response;
};
