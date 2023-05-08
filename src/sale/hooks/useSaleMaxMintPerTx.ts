import useSWR from 'swr';
import { BigNumber } from '@ethersproject/bignumber';

import { useWeb3 } from 'web3/providers/Web3Provider';
import type { Sale } from 'contracts/types';
import SALE_ABI from 'contracts/ABI/Sale.json';
import { useContract } from 'shared/hooks/useContract';

export const useSaleMaxMintPerTx = (contractAddress: string) => {
  const { account } = useWeb3();
  const contract = useContract<Sale>(contractAddress, SALE_ABI);

  const key = ['useSaleMaxMintPerTx', account, contractAddress];
  const canFetch = typeof account === 'string' && !!contract;

  const response = useSWR(canFetch ? key : null, () => contract?.maxMintPerTx());

  const data = response.data || 0;

  return {
    data: BigNumber.from(data)?.toNumber(),
  };
};
