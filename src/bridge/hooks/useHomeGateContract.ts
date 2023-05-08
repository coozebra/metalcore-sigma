import { getAddress } from '@ethersproject/address';
import { BigNumberish } from '@ethersproject/bignumber';
import { BytesLike } from 'ethers';

import { useWeb3 } from 'web3/providers/Web3Provider';
import { getBridgeTxs } from 'bridge/utils/bridgeTx';
import type { HomeGate } from 'contracts/types';
import HOME_GATE_ABI from 'contracts/ABI/HomeGate.json';
import { useContract } from 'shared/hooks/useContract';
import { CustomError } from 'shared/utils/CustomError';
import { bridgeActions } from 'bridge/state/bridgeActions';

interface IWithdraw {
  rs: BytesLike[];
  ss: BytesLike[];
  tid: string;
  tokenValue: string;
  vs: BigNumberish[];
  retry?: number;
}

export interface IUseHomeGateContract {
  waitForHomeGateTransaction: (hash: string, params) => void;
  withdraw: (params: IWithdraw) => Promise<void>;
}

export const useHomeGateContract = ({ dispatch, state }): IUseHomeGateContract => {
  const { account, library } = useWeb3();

  const contract = useContract<HomeGate>(state.gate?.contract, HOME_GATE_ABI);

  const getRecipient = () => {
    const bridgeTxs = getBridgeTxs();
    const lastStoredTransaction = bridgeTxs[bridgeTxs.length - 1];

    return getAddress(lastStoredTransaction?.recipient ?? account);
  };

  const waitForHomeGateTransaction = async (hash: string, { errorType, successType }) => {
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

  const canWithdraw = async ({ tid, tokenValue }: { tid: string; tokenValue: string }) => {
    dispatch({ type: bridgeActions.withdrawableRequest });

    if (!state.gate?.contract) {
      dispatch({
        type: bridgeActions.withdrawableError,
        payload: { message: 'Gate contract must be defined.' },
      });

      return;
    }

    const tokenContract = state.gate?.tokenAddresses?.[0];
    const recipient = getRecipient();

    try {
      const response = await contract?.canWithdraw(tid, tokenContract, recipient, tokenValue);

      dispatch({ type: bridgeActions.withdrawableSuccess });

      return response;
    } catch (error: any) {
      dispatch({
        type: bridgeActions.withdrawableError,
        payload: { message: error?.message },
      });

      throw new Error(error?.message);
    }
  };

  const withdraw = async ({ retry = 5, rs, ss, tid, tokenValue, vs }: IWithdraw) => {
    if (!state.gate?.contract) {
      dispatch({
        type: bridgeActions.withdrawError,
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
        withdraw({
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
        type: bridgeActions.withdrawError,
        payload: { message: 'Contract must be defined.' },
      });

      return;
    }

    const tokenContract = state.gate?.tokenAddresses?.[0];
    const recipient = getRecipient();

    try {
      const withdrawable = await canWithdraw({ tid, tokenValue });

      if (withdrawable) {
        const gasLimit = await contract?.estimateGas?.withdraw(
          tid,
          tokenContract,
          recipient,
          tokenValue,
          vs,
          rs,
          ss,
        );

        dispatch({ type: bridgeActions.withdrawRequest });

        const response = await contract?.withdraw(
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
          type: bridgeActions.withdrawConfirmed,
          payload: { hash: response?.hash },
        });

        dispatch({
          type: bridgeActions.withdrawableTxHash,
          payload: { hash: tid },
        });

        return await waitForHomeGateTransaction(response?.hash as string, {
          errorType: bridgeActions.withdrawError,
          successType: bridgeActions.withdrawSuccess,
        });
      } else {
        dispatch({
          type: bridgeActions.withdrawError,
          payload: { message: 'This transaction is not approved for a withdraw.' },
        });
      }
    } catch (error: any) {
      dispatch({
        type: bridgeActions.withdrawError,
        payload: { message: error?.message, cause: error?.cause },
      });
    }
  };

  return {
    waitForHomeGateTransaction,
    withdraw,
  };
};
