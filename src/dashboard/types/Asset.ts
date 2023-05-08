export enum NFT_STATUS {
  locked,
  unlocked,
}

export interface INFTAttribute {
  trait_type: string;
  value: string | number;
}

export interface IRawAttributes {
  name: string;
  image: string;
  attributes: INFTAttribute[];
}

export interface IAttributes extends IRawAttributes {
  rarity?: string;
  faction?: string;
  isVideo?: boolean;
}

export interface IAsset {
  id?: string;
  userId?: string;
  collectionId?: string;
  type: string;
  tokenId?: string | number;
  attributes: IAttributes;
  status?: NFT_STATUS;
}
