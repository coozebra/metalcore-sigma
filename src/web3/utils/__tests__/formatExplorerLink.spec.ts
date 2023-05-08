import { formatExplorerLink, IFormatExplorerLink } from 'web3/utils/formatExplorerLink';

describe('formatExplorerLink', () => {
  describe('when type input is undefined', () => {
    const address = '0x000000';
    const chainId = 42;

    it('returns an empty link', () => {
      const payload: IFormatExplorerLink = { data: [chainId, address] };

      expect(formatExplorerLink(payload)).toEqual('#');
    });
  });

  describe('when type input is transaction', () => {
    const address = '0x000000';
    const chainId = 56;
    const testNetChainId = 97;

    describe('when its a binance main network', () => {
      it('returns binance mainnet + transaction details', () => {
        const payload: IFormatExplorerLink = {
          type: 'transaction',
          data: [chainId, address],
        };

        expect(formatExplorerLink(payload)).toEqual('https://bscscan.com/tx/0x000000');
      });
    });

    describe('when its a binance test network', () => {
      it('returns binance testnet + transaction details', () => {
        const payload: IFormatExplorerLink = {
          type: 'transaction',
          data: [testNetChainId, address],
        };

        expect(formatExplorerLink(payload)).toEqual('https://testnet.bscscan.com/tx/0x000000');
      });
    });
  });

  describe('when type input is account', () => {
    const address = '0x000000';
    const chainId = 56;
    const testNetChainId = 97;

    describe('when its a binance main network', () => {
      it('returns binance mainnet + address details', () => {
        const payload: IFormatExplorerLink = {
          type: 'account',
          data: [chainId, address],
        };

        expect(formatExplorerLink(payload)).toEqual('https://bscscan.com/address/0x000000');
      });
    });

    describe('when its a binance test network', () => {
      it('returns binance testnet + address details', () => {
        const payload: IFormatExplorerLink = {
          type: 'account',
          data: [testNetChainId, address],
        };

        expect(formatExplorerLink(payload)).toEqual('https://testnet.bscscan.com/address/0x000000');
      });
    });
  });

  describe('when its a kovan network', () => {
    const address = '0x000000';
    const chainId = 42;

    describe('when type input is transaction', () => {
      it('returns Kovan Testnet Network + transaction details', () => {
        const payload: IFormatExplorerLink = {
          type: 'transaction',
          data: [chainId, address],
        };

        expect(formatExplorerLink(payload)).toEqual('https://kovan.etherscan.io/tx/0x000000');
      });
    });

    describe('when type input is account', () => {
      it('returns Kovan Testnet Network + address details', () => {
        const payload: IFormatExplorerLink = {
          type: 'account',
          data: [chainId, address],
        };

        expect(formatExplorerLink(payload)).toEqual('https://kovan.etherscan.io/address/0x000000');
      });
    });
  });
});
