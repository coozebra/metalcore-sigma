import { getAddress } from '@ethersproject/address';
import { BigNumberish } from '@ethersproject/bignumber';
import { BytesLike } from 'ethers';

import { useWeb3 } from 'web3/providers/Web3Provider';
import { getBridgeTxs } from 'bridge/utils/bridgeTx';
import type { ForeignGate } from 'contracts/types';
import FOREIGN_GATE_ABI from 'contracts/ABI/HomeGate.json';
import { useContract } from 'shared/hooks/useContract';
import { CustomError } from 'shared/utils/CustomError';
import { bridgeActions } from 'bridge/state/bridgeActions';

interface IMint {
  rs: BytesLike[];
  ss: BytesLike[];
  tid: string;
  tokenValue: string;
  vs: BigNumberish[];
  retry?: number;
}

export interface IUseForeignGateContract {
  mint: (params: IMint) => Promise<void>;
  waitForForeignGateTransaction: (hash: string, params) => void;
}

export const useForeignGateContract = ({ dispatch, state }): IUseForeignGateContract => {
  const { account, library } = useWeb3();

  const contract = useContract<ForeignGate>(state.gate?.contract, FOREIGN_GATE_ABI);

  const getRecipient = () => {
    const bridgeTxs = getBridgeTxs();
    const lastStoredTransaction = bridgeTxs[bridgeTxs.length - 1];

    return getAddress(lastStoredTransaction?.recipient ?? account);
  };

  const waitForForeignGateTransaction = async (hash: string, { errorType, successType }) => {
    try {
      const response = await library.waitForTransaction(hash);

      if (response?.status === 0) {
        const message = 'Your transaction failed. Please try again.';
        const cause = `${hash}`;

        dispatch({ type: errorType, payload: { message, cause } });

        throw new CustomError(cause, message);
      }

      dispatch({ type: successType });

      return response;
    } catch (error: any) {
      throw new CustomError(error?.cause, error?.message);
    }
  };

  const canMint = async ({ tid, tokenValue }: { tid: string; tokenValue: string }) => {
    dispatch({ type: bridgeActions.mintableRequest });

    if (!state.gate?.contract) {
      dispatch({
        type: bridgeActions.mintableError,
        payload: { message: 'Gate contract must be defined.' },
      });

      return;
    }

    const tokenContract = state.gate?.tokenAddresses?.[0];
    const recipient = getRecipient();

    try {
      const response = await contract?.canMint(tid, tokenContract, recipient, tokenValue);

      dispatch({ type: bridgeActions.mintableSuccess });

      return response;
    } catch (error: any) {
      dispatch({
        type: bridgeActions.mintableError,
        payload: { message: error?.message },
      });

      throw new Error(error?.message);
    }
  };

  const mint = async ({ retry = 5, rs, ss, tid, tokenValue, vs }: IMint) => {
    if (!state.gate?.contract) {
      dispatch({
        type: bridgeActions.mintError,
        payload: { message: 'Gate contract must be defined.' },
      });

      return;
    }

    /**
     * NOTE: since contract address is defined by a param will need to wait for
     * contract to be initialized first
     */
    if (!contract && retry > 0) {
      setTimeout(() => {
        mint({
          retry: retry - 1,
          rs,
          ss,
          tid,
          tokenValue,
          vs,
        });
      }, 1000);

      return;
    }

    /**
     * NOTE: if contract was never defined after 5 retries display error
     */
    if (!contract) {
      dispatch({
        type: bridgeActions.mintError,
        payload: { message: 'Contract must be defined.' },
      });

      return;
    }

    const tokenContract = state.gate?.tokenAddresses?.[0];
    const recipient = getRecipient();

    try {
      const mintable = await canMint({ tid, tokenValue });

      if (mintable) {
        const gasLimit = await contract?.estimateGas?.mint(
          tid,
          tokenContract,
          recipient,
          tokenValue,
          vs,
          rs,
          ss,
        );

        dispatch({ type: bridgeActions.mintRequest });

        const response = await contract?.mint(
          tid,
          tokenContract,
          recipient,
          tokenValue,
          vs,
          rs,
          ss,
          { gasLimit: gasLimit?.toNumber() || 100000 },
        );

        dispatch({
          type: bridgeActions.mintConfirmed,
          payload: { hash: response?.hash },
        });

        dispatch({
          type: bridgeActions.withdrawableTxHash,
          payload: { hash: tid },
        });

        return await waitForForeignGateTransaction(response?.hash as string, {
          errorType: bridgeActions.mintError,
          successType: bridgeActions.mintSuccess,
        });
      }
    } catch (error: any) {
      dispatch({
        type: bridgeActions.mintError,
        payload: { message: error?.message, cause: error?.cause },
      });
    }
  };

  return {
    mint,
    waitForForeignGateTransaction,
  };
};
