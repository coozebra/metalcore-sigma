import { formatEther } from '@ethersproject/units';
import { BigNumber } from '@ethersproject/bignumber';

import { STORAGE } from 'shared/enums/storage';

export const setBridgeTx = data => {
  const stored = JSON.parse(localStorage.getItem(STORAGE.BRIDGE_TXS) || '[]');

  const transactions = data ? [...stored, data] : stored;

  localStorage.setItem(STORAGE.BRIDGE_TXS, JSON.stringify(transactions));
};

export const getBridgeTxs = () => {
  const stored = JSON.parse(localStorage.getItem(STORAGE.BRIDGE_TXS) || '[]');

  return stored;
};

export const getLatestBridgeTx = (tid?: string) => {
  if (!tid) return;

  const stored = JSON.parse(localStorage.getItem(STORAGE.BRIDGE_TXS) || '[]');

  const transaction = stored.find(tx => tx.tid === tid);

  if (Object.keys(transaction).length === 0) return;

  return {
    ...transaction,
    tokenValue: formatEther(BigNumber.from(transaction?.tokenValue).toString()),
  };
};

export const removeBridgeTx = (tid?: string) => {
  if (!tid) return;

  const stored = JSON.parse(localStorage.getItem(STORAGE.BRIDGE_TXS) || '[]');

  const transactions = stored.filter(tx => tx.tid !== tid);

  localStorage.setItem(STORAGE.BRIDGE_TXS, JSON.stringify(transactions));
};
