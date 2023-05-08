import { parseEther } from '@ethersproject/units';
import axios from 'axios';
import getConfig from 'next/config';
import Bugsnag from '@bugsnag/js';

import { useWeb3 } from 'web3/providers/Web3Provider';
import type { Sale } from 'contracts/types';
import SALE_ABI from 'contracts/ABI/Sale.json';
import { useContract } from 'shared/hooks/useContract';
import { CustomError } from 'shared/utils/CustomError';
import { presaleActions } from 'presale/state/presaleActions';
import { IReceipt } from 'contracts/types/Receipt';

export interface IUsePresalePurchase {
  getTransactionReceipt: (hash: string) => Promise<IReceipt | null>;
  purchase: (amount: number, pricePerNFT: number) => void;
  waitForPurchaseTransaction: (hash: string) => void;
}

const PURCHASE_GAS_LIMIT_FALLBACK = 400000;

export const usePresalePurchase = ({ dispatch }): IUsePresalePurchase => {
  const { account, chainId, library } = useWeb3();
  const { publicRuntimeConfig } = getConfig();

  const contract = useContract<Sale>(
    publicRuntimeConfig.PRESALE_CONTRACT_ADDRESS as string,
    SALE_ABI,
  );

  const getTransactionReceipt = async (hash: string): Promise<IReceipt | null> => {
    if (!hash) {
      const error = new Error('No tx hash provided.');

      Bugsnag.notify(error, event => {
        event.severity = 'error';
        event.context = 'usePresalePurchase.getTransactionReceipt';
      });

      throw error;
    }

    try {
      return await library.getTransactionReceipt(hash);
    } catch (error: any) {
      if (!error?.message) {
        error.message = 'Error fetching transaction receipt.';
      }

      Bugsnag.notify(error, event => {
        event.severity = 'error';
        event.context = 'usePresalePurchase.getTransactionReceipt';
      });

      throw error;
    }
  };

  const getWhitelistSignature = async (amount: number): Promise<string | undefined> => {
    try {
      const nonce = await contract?.nonces(account as string);

      const response: { data: { signature?: string | undefined } } = await axios.get(
        '/api/v1/whitelist',
        {
          params: {
            amount,
            assetAddress: publicRuntimeConfig.ASSET_CONTRACT_ADDRESS,
            chainId,
            nonce: nonce?.toNumber(),
            walletAddress: account?.toLowerCase(),
          },
        },
      );

      return response?.data?.signature;
    } catch (error: any) {
      if (!error?.message) {
        error.message = 'Error fetching whitelist signature';
      }

      Bugsnag.notify(error, event => {
        event.severity = 'error';
        event.context = 'usePresalePurchase.getWhitelistSignature';
      });

      throw error;
    }
  };

  const waitForPurchaseTransaction = async (hash: string) => {
    try {
      const response = await library.waitForTransaction(hash);

      if (response?.status === 0) {
        const message = 'Your transaction failed. Please try again.';
        const cause = `${hash}`;

        const error = new CustomError(cause, message);

        if (!error?.message) {
          error.message = 'Error fetching whitelist signature';
        }

        Bugsnag.notify(error, event => {
          event.severity = 'error';
          event.context = 'usePresalePurchase.waitForPurchaseTransaction';
        });

        dispatch({
          type: presaleActions.purchaseError,
          payload: { message, cause },
        });

        throw error;
      }

      dispatch({ type: presaleActions.purchaseSuccess });

      return response;
    } catch (error: any) {
      Bugsnag.notify(error, event => {
        event.severity = 'error';
        event.context = 'usePresalePurchase.waitForPurchaseTransaction';
      });

      throw new CustomError(error?.cause, error?.message);
    }
  };

  const purchase = async (amount: number, pricePerNFT: number) => {
    // NOTE: disabled for free mint sale
    // if (!pricePerNFT) {
    //   throw new Error('Price must be set.');
    // }

    dispatch({ type: presaleActions.purchaseRequest });

    let signature;

    try {
      signature = await getWhitelistSignature(amount);

      if (!signature) {
        const error = new Error('whitelist signature is required.');

        Bugsnag.notify(error, event => {
          event.severity = 'error';
          event.context = 'usePresalePurchase.purchase';
        });

        throw error;
      }
    } catch (error: any) {
      Bugsnag.notify(error, event => {
        event.severity = 'error';
        event.context = 'usePresalePurchase.purchase';
      });

      dispatch({
        type: presaleActions.purchaseError,
        payload: {
          message: error?.message,
          cause: error?.cause,
        },
      });

      throw new CustomError(error?.cause, error?.message);
    }

    const value = parseEther(`${amount * pricePerNFT}`);

    let gasLimit;

    await contract?.estimateGas
      ?.purchase(amount, signature, { value })
      .then(gas => {
        gasLimit = gas?.toNumber();
      })
      .catch(() => {
        gasLimit = PURCHASE_GAS_LIMIT_FALLBACK;
      });

    try {
      const response = await contract?.purchase(amount, signature, {
        value,
        gasLimit,
      });

      dispatch({
        type: presaleActions.purchaseConfirmed,
        payload: { hash: response?.hash },
      });

      return await waitForPurchaseTransaction(response?.hash as string);
    } catch (error: any) {
      Bugsnag.notify(error, event => {
        event.severity = 'error';
        event.context = 'usePresalePurchase.purchase';
      });

      dispatch({
        type: presaleActions.purchaseError,
        payload: {
          message: error?.message,
          cause: error?.cause,
        },
      });

      throw new CustomError(error?.cause, error?.message);
    }
  };

  return {
    getTransactionReceipt,
    purchase,
    waitForPurchaseTransaction,
  };
};
