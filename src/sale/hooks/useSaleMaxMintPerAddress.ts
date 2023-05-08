import useSWR from 'swr';
import { BigNumber } from '@ethersproject/bignumber';

import { useWeb3 } from 'web3/providers/Web3Provider';
import type { Sale } from 'contracts/types';
import SALE_ABI from 'contracts/ABI/Sale.json';
import { useContract } from 'shared/hooks/useContract';

export const useSaleMaxMintPerAddress = (contractAddress: string) => {
  const { account } = useWeb3();
  const contract = useContract<Sale>(contractAddress, SALE_ABI);

  const canFetch = typeof account === 'string' && !!contract;
  const key = ['useSaleMaxMintPerAddress', account, contractAddress];

  const response = useSWR(canFetch ? key : null, () => contract?.maxMintPerAddress());

  const data = response.data || 0;

  return {
    data: BigNumber.from(data)?.toNumber(),
  };
};
