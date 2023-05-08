import useSWR from 'swr';

import { useWeb3 } from 'web3/providers/Web3Provider';
import type { Sale } from 'contracts/types';
import SALE_ABI from 'contracts/ABI/Sale.json';
import { useContract } from 'shared/hooks/useContract';

export const useSaleMaxMintable = (contractAddress: string) => {
  const { account } = useWeb3();
  const contract = useContract<Sale>(contractAddress, SALE_ABI);

  const key = ['useSaleMaxMintable', account, contractAddress];
  const canFetch = typeof account === 'string' && !!contract;

  return useSWR(canFetch ? key : null, () => contract?.maxMintable());
};
