import { EXPLORER_CHAINS } from 'web3/enums/chains';

export interface IFormatExplorerLink {
  type?: 'account' | 'transaction';
  data: [number?, string?];
}

export const formatExplorerLink = ({ type, data }: IFormatExplorerLink): string => {
  const [chainId, hash] = data;

  if (!chainId || !type) return '#';

  let pathname;

  switch (chainId) {
    // binance mainnet / testnet
    case 56:
    case 97:
      pathname = `https://${EXPLORER_CHAINS[chainId]}com`;
      break;
    default:
      pathname = `https://${EXPLORER_CHAINS[chainId]}etherscan.io`;
      break;
  }

  switch (type) {
    case 'transaction': {
      return `${pathname}/tx/${hash}`;
    }
    case 'account': {
      return `${pathname}/address/${hash}`;
    }
  }
};
