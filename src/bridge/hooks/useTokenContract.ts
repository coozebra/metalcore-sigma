import swr from 'swr';
import { parseEther } from '@ethersproject/units';

import { useWeb3 } from 'web3/providers/Web3Provider';
import TOKEN_ABI from 'contracts/ABI/Token.json';
import type { Token } from 'contracts/types';
import { useContract } from 'shared/hooks/useContract';
import { useSWRLiveData as swrLiveData } from 'web3/hooks/useSWRLiveData';
import { bridgeActions } from 'bridge/state/bridgeActions';
import { CustomError } from 'shared/utils/CustomError';
import { setBridgeTx } from 'bridge/utils/bridgeTx';
import { IReceipt } from 'contracts/types/Receipt';
import { CHAIN_CONFIRMATIONS } from 'web3/enums/chains';

export interface IUseTokenContract {
  balanceOf: () => { data? };
  burn: (params: { _amount: number; sourceChain: number; targetChain: number }) => Promise<void>;
  getTransactionReceipt: (hash: string) => Promise<IReceipt | null>;
  transfer: (params: {
    _amount: number;
    targetGateContract: string;
    sourceChain: number;
    targetChain: number;
  }) => Promise<void>;
  waitForConfirmation: (params) => void;
}

export const useTokenContract = ({ dispatch, state }): IUseTokenContract => {
  const { account, library, chainId } = useWeb3();

  const contract = useContract<Token>(state.gate?.tokenAddresses?.[0], TOKEN_ABI);

  const canFetch = typeof account === 'string' && !!contract;

  const generateSWRKey = (name: string, param?: any) => [
    name,
    ...(param ? [param] : []),
    account,
    state.gate?.contract,
  ];

  const balanceOf = () => {
    const response = swr(canFetch ? generateSWRKey('balanceOf') : null, () =>
      contract?.balanceOf(account as string),
    );

    swrLiveData({ mutate: response.mutate });

    return response;
  };

  const getTransactionReceipt = async (hash: string): Promise<IReceipt | null> => {
    if (!hash) {
      throw new Error('No tx hash provided.');
    }

    try {
      return await library.getTransactionReceipt(hash);
    } catch (error) {
      throw new Error('Error fetching transaction receipt.');
    }
  };

  const waitForTokenTransaction = async (hash: string, { errorType }) => {
    try {
      const response = await library.waitForTransaction(hash);

      if (response?.status === 0) {
        const message = 'Your transaction failed. Please try again.';
        const cause = `${hash}`;

        dispatch({ type: errorType, payload: { message, cause } });

        throw new CustomError(cause, message);
      }

      return response;
    } catch (error: any) {
      throw new CustomError(error?.cause, error?.message);
    }
  };

  const waitForConfirmation = async ({ hash, errorType, successType }) => {
    // NOTE: may not be necessary but keeping here for error handling
    const response = await waitForTokenTransaction(hash, { errorType });

    // TODO: see if we can get rid of this
    const transaction = await library.getTransaction(hash);

    if (transaction && chainId) {
      const target = CHAIN_CONFIRMATIONS[chainId] ?? 0;

      library.on('block', block => {
        dispatch({
          type: bridgeActions.setTransactionConfirmationBlocks,
          payload: { confirmations: block - response.blockNumber },
        });
      });

      transaction.wait(target).then(() => {
        dispatch({ type: successType });

        library.off('block');
      });
    } else {
      dispatch({
        type: errorType,
        payload: { message: 'Transaction does not exist.', cause: hash },
      });
    }
  };

  const burn = async ({
    _amount,
    sourceChain,
    targetChain,
  }: {
    _amount: number;
    sourceChain: number;
    targetChain: number;
  }) => {
    if (!_amount) {
      dispatch({
        type: bridgeActions.burnError,
        payload: { message: 'Amount must be specified.' },
      });

      return;
    }

    dispatch({ type: bridgeActions.burnRequest });

    try {
      const amount = parseEther(`${_amount}`).toHexString();

      const gasLimit = await contract?.estimateGas?.burn(amount);

      const response = await contract?.burn(amount, {
        gasLimit: gasLimit?.toNumber() || 100000,
      });

      dispatch({
        type: bridgeActions.burnConfirmed,
        payload: { hash: response?.hash },
      });

      setBridgeTx({
        recipient: response?.from,
        sourceChain,
        targetChain,
        tid: response?.hash,
        tokenValue: amount,
      });

      return await waitForConfirmation({
        hash: response?.hash,
        errorType: bridgeActions.burnError,
        successType: bridgeActions.burnSuccess,
      });
    } catch (error: any) {
      dispatch({
        type: bridgeActions.burnError,
        payload: {
          message: error?.message,
          cause: error?.cause,
        },
      });
    }
  };

  const transfer = async ({
    _amount,
    targetGateContract,
    sourceChain,
    targetChain,
  }: {
    _amount: number;
    targetGateContract: string;
    sourceChain: number;
    targetChain: number;
  }) => {
    if (!_amount) {
      dispatch({
        type: bridgeActions.transferError,
        payload: { message: 'Amount must be specified.' },
      });

      return;
    }

    dispatch({ type: bridgeActions.transferRequest });

    try {
      const amount = parseEther(`${_amount}`).toHexString();

      const gasLimit = await contract?.estimateGas?.transfer(targetGateContract, amount);

      const response = await contract?.transfer(targetGateContract, amount, {
        gasLimit: gasLimit?.toNumber() || 100000,
      });

      dispatch({
        type: bridgeActions.transferConfirmed,
        payload: { hash: response?.hash },
      });

      setBridgeTx({
        recipient: response?.from,
        sourceChain,
        targetChain,
        tid: response?.hash,
        tokenValue: amount,
      });

      return await waitForConfirmation({
        hash: response?.hash,
        errorType: bridgeActions.burnError,
        successType: bridgeActions.burnSuccess,
      });
    } catch (error: any) {
      dispatch({
        type: bridgeActions.transferError,
        payload: {
          message: error?.message,
          cause: error?.cause,
        },
      });
    }
  };

  return {
    balanceOf,
    burn,
    getTransactionReceipt,
    transfer,
    waitForConfirmation,
  };
};
