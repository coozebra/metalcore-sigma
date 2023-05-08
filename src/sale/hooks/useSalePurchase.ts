import { parseEther } from '@ethersproject/units';
import { constants } from 'ethers';
import getConfig from 'next/config';
import Bugsnag from '@bugsnag/js';

import { useWeb3 } from 'web3/providers/Web3Provider';
import type { Sale } from 'contracts/types';
import ABI from 'contracts/ABI/Sale.json';
import { useContract } from 'shared/hooks/useContract';
import { CustomError } from 'shared/utils/CustomError';
import { saleActions } from 'sale/state/saleActions';
import { IReceipt } from 'contracts/types/Receipt';

export interface IUseSalePurchase {
  getTransactionReceipt: (hash: string) => Promise<IReceipt | null>;
  purchase: (amount: number, pricePerNFT: number) => void;
  waitForPurchaseTransaction: (hash: string) => void;
}

const PURCHASE_GAS_LIMIT_FALLBACK = 400000;

export const useSalePurchase = ({ dispatch }): IUseSalePurchase => {
  const { publicRuntimeConfig } = getConfig();
  const { library } = useWeb3();

  const contractAddress = publicRuntimeConfig.SALE_CONTRACT_ADDRESS as string;

  const contract = useContract<Sale>(contractAddress, ABI);

  const getTransactionReceipt = async (hash: string): Promise<IReceipt | null> => {
    if (!hash) {
      const error = new Error('No tx hash provided.');

      Bugsnag.notify(error, event => {
        event.severity = 'error';
        event.context = 'useSalePurchase.getTransactionReceipt';
      });

      throw error;
    }

    try {
      return await library.getTransactionReceipt(hash);
    } catch (error: any) {
      Bugsnag.notify(error, event => {
        event.severity = 'error';
        event.context = 'useSalePurchase.getTransactionReceipt';
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

        const error = new Error('Your transaction failed. Please try again.');

        Bugsnag.notify(error, event => {
          event.severity = 'error';
          event.context = 'useSalePurchase.waitForPurchaseTransaction';
          event.addMetadata('custom', { hash });
        });

        dispatch({
          type: saleActions.purchaseError,
          payload: { message, cause },
        });

        throw new CustomError(cause, message);
      }

      dispatch({ type: saleActions.purchaseSuccess });

      return response;
    } catch (error: any) {
      Bugsnag.notify(error, event => {
        event.severity = 'error';
        event.context = 'useSalePurchase.waitForPurchaseTransaction';
        event.addMetadata('custom', { hash });
      });

      throw new CustomError(error?.cause, error?.message);
    }
  };

  const purchase = async (amount: number, pricePerNFT: number) => {
    // NOTE: disabled for free mint sale
    // if (!pricePerNFT) {
    //   throw new Error('Price must be set.');
    // }

    dispatch({ type: saleActions.purchaseRequest });

    try {
      const value = parseEther(`${amount * pricePerNFT}`);

      let gasLimit;

      await contract?.estimateGas
        ?.purchase(amount, constants.HashZero, { value })
        .then(gas => {
          gasLimit = gas?.toNumber();
        })
        .catch(() => {
          gasLimit = PURCHASE_GAS_LIMIT_FALLBACK;
        });

      const response = await contract?.purchase(amount, constants.HashZero, {
        value,
        gasLimit,
      });

      dispatch({
        type: saleActions.purchaseConfirmed,
        payload: { hash: response?.hash },
      });

      return await waitForPurchaseTransaction(response?.hash as string);
    } catch (error: any) {
      Bugsnag.notify(error, event => {
        event.severity = 'error';
        event.context = 'useSalePurchase.purchase';
      });

      dispatch({
        type: saleActions.purchaseError,
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
