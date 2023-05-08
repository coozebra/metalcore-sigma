import { createContext, useContext, ReactNode, useEffect, Dispatch } from 'react';
import { useImmerReducer } from 'use-immer';

import { useWeb3 } from 'web3/providers/Web3Provider';
import { IBridgeState, INITIAL_STATE, bridgeReducer } from 'bridge/state/bridgeReducer';
import { useTokenContract, IUseTokenContract } from 'bridge/hooks/useTokenContract';
import { useOperator, IUseOperator } from 'bridge/hooks/useOperator';
import { useHomeGateContract, IUseHomeGateContract } from 'bridge/hooks/useHomeGateContract';
import {
  useForeignGateContract,
  IUseForeignGateContract,
} from 'bridge/hooks/useForeignGateContract';
import {
  IBridgeBurnConfirmedAction,
  IBridgeErrorAction,
  IBridgeMintConfirmedAction,
  IBridgeWithdrawConfirmedAction,
} from 'bridge/types/ActionPayload';
import { bridgeActions } from 'bridge/state/bridgeActions';

interface IBridgeContext
  extends IBridgeState,
    IUseTokenContract,
    IUseOperator,
    IUseHomeGateContract,
    IUseForeignGateContract {
  bridgeError: (params: { message?: string; cause?: string; type: string }) => void;
  displayDepositModal: () => void;
  dismissDepositModal: () => void;
  displayWithdrawModal: () => void;
  dismissWithdrawModal: () => void;
  mintConfirmed: (hash: string) => void;
  mintError: (hash: string) => void;
  mintSuccess: () => void;
  depositConfirmed: (hash: string) => void;
  depositError: (hash: string) => void;
  depositSuccess: () => void;
  withdrawConfirmed: (hash: string) => void;
  withdrawSuccess: () => void;
  withdrawError: (hash: string) => void;
}

const noop = () => {};

export const BridgeContext = createContext<IBridgeContext>({
  ...INITIAL_STATE,
  balanceOf: () => ({ data: '' }),
  bridgeError: noop,
  burn: () => new Promise(noop),
  dismissDepositModal: noop,
  dismissWithdrawModal: noop,
  displayDepositModal: noop,
  displayWithdrawModal: noop,
  getOperatorsInfo: noop,
  getOperatorsSignatures: () => new Promise(noop),
  getTransactionReceipt: async () => null,
  mint: () => new Promise(noop),
  mintConfirmed: noop,
  mintError: noop,
  mintSuccess: noop,
  depositConfirmed: noop,
  depositError: noop,
  depositSuccess: noop,
  transfer: () => new Promise(noop),
  waitForHomeGateTransaction: noop,
  waitForForeignGateTransaction: noop,
  waitForConfirmation: noop,
  withdraw: () => new Promise(noop),
  withdrawConfirmed: noop,
  withdrawError: noop,
  withdrawSuccess: noop,
});

export const useBridge = () => useContext(BridgeContext);

export const BridgeProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useImmerReducer(bridgeReducer, INITIAL_STATE);

  const { account, chainId } = useWeb3();
  const { balanceOf, burn, getTransactionReceipt, transfer, waitForConfirmation } =
    useTokenContract({ dispatch, state });
  const { getOperatorsInfo, getOperatorsSignatures } = useOperator({
    dispatch,
    state,
  });
  const { waitForHomeGateTransaction, withdraw } = useHomeGateContract({
    dispatch,
    state,
  });
  const { mint, waitForForeignGateTransaction } = useForeignGateContract({
    dispatch,
    state,
  });

  /**
   * ****************************************
   * Modal Dispatchers
   * ****************************************
   */
  const displayDepositModal = () => dispatch({ type: bridgeActions.displayDepositModal });
  const dismissDepositModal = () => dispatch({ type: bridgeActions.dismissDepositModal });
  const displayWithdrawModal = () => dispatch({ type: bridgeActions.displayWithdrawModal });
  const dismissWithdrawModal = () => dispatch({ type: bridgeActions.dismissWithdrawModal });

  /**
   * ****************************************
   * Deposit Dispatchers
   * ****************************************
   */
  /**
   * NOTE: Assumes that the transaction is a burn but can also be a
   * transfer. Perhaps we can separate out burn / transfer by transaction
   * type like mint / withdraw however not as necessary as transactions
   * happen within the same contract as opposed to mint / withdraw
   */
  const depositConfirmed = (hash: string) => {
    (dispatch as Dispatch<IBridgeBurnConfirmedAction>)({
      type: bridgeActions.burnConfirmed,
      payload: { hash },
    });
  };

  const depositError = (cause?: string) => {
    bridgeError({
      message: 'Your transaction failed to deposit. Please try again.',
      cause,
      type: bridgeActions.burnError,
    });
  };

  const depositSuccess = () => dispatch({ type: bridgeActions.burnSuccess });

  /**
   * ****************************************
   * Mint Dispatchers
   * ****************************************
   */
  const mintConfirmed = (hash: string) => {
    (dispatch as Dispatch<IBridgeMintConfirmedAction>)({
      type: bridgeActions.mintConfirmed,
      payload: { hash },
    });
  };

  const mintError = (cause?: string) => {
    bridgeError({
      message: 'Your transaction failed to mint. Please try again.',
      cause,
      type: bridgeActions.mintError,
    });
  };

  const mintSuccess = () => dispatch({ type: bridgeActions.mintSuccess });

  /**
   * ****************************************
   * Withdraw Dispatchers
   * ****************************************
   */
  const withdrawConfirmed = (hash: string) => {
    (dispatch as Dispatch<IBridgeWithdrawConfirmedAction>)({
      type: bridgeActions.withdrawConfirmed,
      payload: { hash },
    });
  };

  const withdrawError = (cause?: string) => {
    bridgeError({
      message: 'Your transaction failed to withdraw. Please try again.',
      cause,
      type: bridgeActions.withdrawError,
    });
  };

  const withdrawSuccess = () => dispatch({ type: bridgeActions.withdrawSuccess });

  /**
   * ****************************************
   * Error Dispatchers
   * ****************************************
   */
  const bridgeError = ({
    message,
    cause,
    type,
  }: {
    message?: string;
    cause?: string;
    type: string;
  }) => {
    (dispatch as Dispatch<IBridgeErrorAction>)({
      type,
      payload: { message, cause },
    });
  };

  const value = {
    ...state,
    balanceOf,
    bridgeError,
    burn,
    displayDepositModal,
    dismissDepositModal,
    displayWithdrawModal,
    dismissWithdrawModal,
    getOperatorsInfo,
    getOperatorsSignatures,
    getTransactionReceipt,
    mint,
    mintConfirmed,
    mintError,
    mintSuccess,
    depositConfirmed,
    depositError,
    depositSuccess,
    transfer,
    waitForHomeGateTransaction,
    waitForForeignGateTransaction,
    waitForConfirmation,
    withdraw,
    withdrawConfirmed,
    withdrawError,
    withdrawSuccess,
  };

  useEffect(() => {
    if (account && chainId) {
      getOperatorsInfo(chainId);
    }
  }, [account, chainId]);

  useEffect(() => {
    // NOTE: turn on for debugging
    if (process.env.NODE_ENV === 'development') {
      // console.info('bridge state:', state);
    }
  }, [state]);

  return <BridgeContext.Provider value={value}>{children}</BridgeContext.Provider>;
};
