import { ethers } from 'ethers';
import Bugsnag from '@bugsnag/js';

import { useWeb3 } from 'web3/providers/Web3Provider';
import { timestampInSeconds } from 'shared/utils/date';

export const useSigner = () => {
  const { account, library } = useWeb3();

  const getMessage = () => {
    return `LinkWallet: ${account} ${timestampInSeconds()}`;
  };

  const signMessage = async () => {
    const provider = new ethers.providers.Web3Provider(library.provider);

    try {
      const signer = await provider.getSigner();

      const message = getMessage();

      const signature = await signer.signMessage(message);

      return signature;
    } catch (error: any) {
      Bugsnag.notify(error, event => {
        event.severity = 'error';
        event.context = 'useSigner.signMessage';
      });

      throw error;
    }
  };

  return {
    getMessage,
    signMessage,
  };
};
