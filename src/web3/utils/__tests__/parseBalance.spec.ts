import { BigNumber } from '@ethersproject/bignumber';

import { parseBalance } from '../parseBalance';

describe('parseBalance', () => {
  it('returns parsed balance', () => {
    const value = BigNumber.from('42');

    expect(parseBalance(value)).toEqual('0.0000');
  });
});
