export interface IUser {
  accountId?: string;
  balances: {
    fab?: string;
    mgt?: string;
  };
  displayName?: string;
  id?: string;
  jwt?: string;
  walletAddress?: string;
}
