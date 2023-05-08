import { useEffect, useRef } from 'react';
import { useBlockNumber } from 'web3/hooks/useBlockNumber';

interface IUseSWRLiveData {
  mutate: () => Promise<any>;
}

export const useSWRLiveData = ({ mutate }: IUseSWRLiveData) => {
  const mutateRef = useRef(mutate);

  useEffect(() => {
    mutateRef.current = mutate;
  }, []);

  /**
   * NOTE: when a new block arrives, trigger a mutation which in turn
   * breaks SWR caching to fetch latest data
   */
  const { data } = useBlockNumber();

  useEffect(() => {
    mutateRef.current();
  }, [data]);
};
