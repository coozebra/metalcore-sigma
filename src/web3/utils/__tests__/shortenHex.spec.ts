import { shortenHex } from '../shortenHex';

describe('shortenHex', () => {
  it('returns shorten hex string', () => {
    const account = '0x12345678901234567890';

    expect(shortenHex(account)).toEqual('0x1234...7890');
  });
});
