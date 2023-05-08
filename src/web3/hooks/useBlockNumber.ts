import useSwr from 'swr';
import { useWeb3 } from 'web3/providers/Web3Provider';

export const useBlockNumber = () => {
  const { library, connected } = useWeb3();

  const fetcher = async () => library?.getBlockNumber();

  return useSwr(connected ? ['BlockNumber'] : null, fetcher, {
    refreshInterval: 10000,
  });
};
