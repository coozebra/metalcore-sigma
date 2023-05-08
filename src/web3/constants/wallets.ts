interface IWallet {
  title: string;
  iconUrl: string;
  connectorId: string;
  mainUrl: string;
}

export const wallets: Array<IWallet> = [
  {
    title: 'MetaMask',
    iconUrl: '/wallets/metamask.svg',
    connectorId: 'injected',
    mainUrl: 'https://metamask.io/',
  },
  {
    title: 'WalletConnect',
    iconUrl: '/wallets/walletconnect.svg',
    connectorId: 'walletconnect',
    mainUrl: 'https://walletconnect.com/',
  },
  {
    title: 'TrustWallet',
    iconUrl: '/wallets/trust.svg',
    connectorId: 'injected',
    mainUrl: 'https://trustwallet.com/',
  },
  // {
  //   title: "Binance",
  //   iconUrl: "/wallets/binance.svg",
  //   connectorId: "bsc",
  //   mainUrl: "https://www.binance.com/en/wallet-direct",
  // },
  // {
  //   title: "TokenPocket",
  //   iconUrl: "/wallets/tokenpocket.svg",
  //   connectorId: "injected",
  //   mainUrl: "https://www.tokenpocket.pro/en/download/app",
  // },
  // {
  //   title: "SafePal",
  //   iconUrl: "/wallets/safepal.svg",
  //   connectorId: "injected",
  //   mainUrl: "https://safepal.io/",
  // },
  // {
  //   title: "MathWallet",
  //   iconUrl: "/wallets/math.svg",
  //   connectorId: "injected",
  //   mainUrl: "https://mathwallet.org/",
  // },
];
