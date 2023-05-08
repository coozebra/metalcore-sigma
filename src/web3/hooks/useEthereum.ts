import { useEffect, useState } from 'react';

import { useCookie } from 'shared/hooks/useCookie';

// Binancer wallet is not injected instantaneously
const maxRetriesForBsc = 5;
const bscWaitTime = 500;

export const useEthereum = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [ethereum, setEthereum] = useState<any>(undefined);

  const { value: connectorId, remove: removeConnectorId } = useCookie('connectorId');
  const isBsc = connectorId === 'bsc';

  useEffect(() => {
    const waitUntilBscIsInjectedToWindow = async () => {
      for (let retries = 0; ; retries++) {
        const shouldBreak = retries >= maxRetriesForBsc;
        const bsc = await new Promise(resolve =>
          setInterval(() => resolve((window as any).BinanceChain), bscWaitTime),
        );

        if (bsc) {
          setEthereum(bsc);
          setIsLoading(false);
          break;
        }

        if (shouldBreak) {
          setIsLoading(false);
          removeConnectorId();
          break;
        }
      }
    };

    if (!isBsc) {
      const ethereum = (window as any).ethereum;

      if (ethereum) {
        setEthereum(ethereum);
        setIsLoading(false);
        return;
      }
    }

    waitUntilBscIsInjectedToWindow();
  }, []);

  return {
    isLoading,
    ethereum,
  };
};
