import { Contract } from '@ethersproject/contracts';
import { useMemo } from 'react';

import { useWeb3 } from 'web3/providers/Web3Provider';

export const useContract = <T extends Contract = Contract>(address: string, ABI: any): T | null => {
  const { library, account, chainId } = useWeb3();

  return useMemo(() => {
    if (!ABI || !address || !chainId || !library) {
      return null;
    }

    try {
      return new Contract(address, ABI, library.getSigner(account));
    } catch (error) {
      console.error('Failed to retrieve contract', error);

      return null;
    }
  }, [ABI, account, address, library]) as T;
};
