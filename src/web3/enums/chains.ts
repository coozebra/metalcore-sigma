export const ETHEREUM_MAINNET = 1;
export const ROPSTEN = 3;
export const RINKEBY = 4;
export const GOERLI = 5;
export const KOVAN = 42;
export const BINANCE_MAINNET = 56;
export const BINANCE_TESTNET = 97;

export const EXPLORER_CHAINS = {
  [ETHEREUM_MAINNET]: '',
  [ROPSTEN]: 'ropsten.',
  // [RINKEBY]: 'rinkeby.',
  [GOERLI]: 'goerli.',
  [KOVAN]: 'kovan.',
  [BINANCE_MAINNET]: 'bscscan.',
  [BINANCE_TESTNET]: 'testnet.bscscan.',
};

export const CHAINS = {
  [ETHEREUM_MAINNET]: 'ethereum mainnet',
  [ROPSTEN]: 'ropsten',
  // [RINKEBY]: 'rinkeby',
  [GOERLI]: 'goerli',
  [KOVAN]: 'kovan',
  [BINANCE_MAINNET]: 'binance mainnet',
  [BINANCE_TESTNET]: 'binance testnet',
};

export const CHAIN_CONFIRMATIONS = {
  [ETHEREUM_MAINNET]: 20,
  [ROPSTEN]: 12,
  // [RINKEBY]: 'rinkeby',
  [GOERLI]: 12,
  [KOVAN]: 12,
  [BINANCE_MAINNET]: 60,
  [BINANCE_TESTNET]: 36,
};
