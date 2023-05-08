import { useState } from 'react';
import axios from 'axios';
import Bugsnag from '@bugsnag/js';

import { useSigner } from 'web3/hooks/useSigner';

export const useWalletLink = () => {
  const { getMessage, signMessage } = useSigner();
  const [progress, setProgress] = useState(0);

  const linkWallet = async () => {
    setProgress(0);

    try {
      setProgress(33);

      const message = getMessage();
      const signature = await signMessage();

      setProgress(67);

      const response = await axios.post('/api/v1/users/wallet', {
        data: { message, signature },
      });

      setProgress(100);

      return response;
    } catch (error: any) {
      const message = error?.message || 'There was an error. Please try again.';

      Bugsnag.notify(error, event => {
        event.severity = 'error';
        event.context = 'useSigner.signMessage';
      });

      throw error;
    }
  };

  const resetWalletLink = () => {
    setProgress(0);
  };

  return {
    linkWallet,
    progress,
    resetWalletLink,
  };
};
