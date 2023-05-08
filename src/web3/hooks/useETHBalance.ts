import useSwr from 'swr';
import { useSWRLiveData as swrLiveData } from 'web3/hooks/useSWRLiveData';
import { useWeb3 } from 'web3/providers/Web3Provider';

export const useETHBalance = () => {
  const { connected, account, chainId, library } = useWeb3();

  const fetcher = async () => {
    if (!account) return;

    const balance = await library?.getBalance(account);

    return balance;
  };

  const response = useSwr(connected ? ['ETHBalance', account, chainId] : null, fetcher);

  swrLiveData({ mutate: response.mutate });

  return response;
};
