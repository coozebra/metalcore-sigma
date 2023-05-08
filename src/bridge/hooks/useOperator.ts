import axios from 'axios';
import { Dispatch } from 'react';
import { splitSignature, SignatureLike } from '@ethersproject/bytes';
import { getAddress } from '@ethersproject/address';
import { BigNumberish } from '@ethersproject/bignumber';
import { BytesLike } from 'ethers';

import { useWeb3 } from 'web3/providers/Web3Provider';
import { getBridgeTxs } from 'bridge/utils/bridgeTx';
import { bridgeActions } from 'bridge/state/bridgeActions';
import { OPERATORS } from 'bridge/enums/operators';
import {
  IOperatorInfoSuccessAction,
  IOperatorSignatureSuccessAction,
  IBridgeErrorAction,
} from 'bridge/types/ActionPayload';

export interface IUseOperator {
  getOperatorsInfo: (chainId: number) => void;
  getOperatorsSignatures: (params: { tid: string; tokenValue: string }) => Promise<
    | {
        originalSignatures: SignatureLike[];
        splitSignatures: {
          rs: BytesLike[];
          vs: BigNumberish[];
          ss: BytesLike[];
        };
      }
    | undefined
  >;
}

export const useOperator = ({ dispatch, state }): IUseOperator => {
  const { account } = useWeb3();

  const getOperatorsInfo = async (chainId: number) => {
    dispatch({ type: bridgeActions.operatorInfoRequest });

    try {
      const operators = Object.keys(OPERATORS);

      const responses = await Promise.all(
        operators.map(operator => {
          return axios.get(`${OPERATORS[operator]}/info`);
        }),
      );

      responses.map(response => {
        (dispatch as Dispatch<IOperatorInfoSuccessAction>)({
          type: bridgeActions.operatorInfoSuccess,
          payload: {
            data: response.data,
            chainId,
          },
        });
      });
    } catch (error: any) {
      (dispatch as Dispatch<IBridgeErrorAction>)({
        type: bridgeActions.operatorInfoError,
        payload: { message: error?.message },
      });
    }
  };

  const getOperatorsSignatures = async ({ tid, tokenValue }) => {
    dispatch({ type: bridgeActions.operatorSignatureRequest });

    try {
      const tokenContract = state.gate?.tokenAddresses?.[0];

      const bridgeTxs = getBridgeTxs();
      const lastStoredTransaction = bridgeTxs[bridgeTxs.length - 1];
      const recipient = getAddress(lastStoredTransaction?.recipient ?? account);

      const responses = await Promise.all(
        Object.values(OPERATORS).map(operator => {
          return axios.get(`${operator}/signature`, {
            params: { recipient, tid, tokenContract, tokenValue },
          });
        }),
      );

      const signatures: SignatureLike[] = [];

      responses.forEach(response => signatures.push(response.data.signature!));

      (dispatch as Dispatch<IOperatorSignatureSuccessAction>)({
        type: bridgeActions.operatorSignatureSuccess,
        payload: { signatures: splitSignatures(signatures) },
      });

      return {
        originalSignatures: signatures,
        splitSignatures: splitSignatures(signatures),
      };
    } catch (error: any) {
      (dispatch as Dispatch<IBridgeErrorAction>)({
        type: bridgeActions.operatorSignatureError,
        payload: { message: error?.message },
      });
    }
  };

  const splitSignatures = (signatures: SignatureLike[]) => {
    const rs: BytesLike[] = [];
    const vs: BigNumberish[] = [];
    const ss: BytesLike[] = [];

    signatures.forEach(signature => {
      const { r, v, s } = splitSignature(signature);

      rs.push(r);
      vs.push(v);
      ss.push(s);
    });

    return { rs: rs.reverse(), vs: vs.reverse(), ss: ss.reverse() };
  };

  return {
    getOperatorsInfo,
    getOperatorsSignatures,
  };
};
