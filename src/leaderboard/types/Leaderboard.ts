export interface IToken {
  name: string;
  quantity: number;
  points: number;
}

export interface IRanking {
  rank: number;
  points: number;
  walletAddress: string;
  latestPurchaseDate: string;
  userName?: string;
  tokens?: Array<IToken>;
}
