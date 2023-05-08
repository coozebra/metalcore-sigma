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
  Rarity?: string;
  faction?: string;
  status?: NFT_STATUS;
  isVideo?: boolean;
}

export interface INFT {
  id: string;
  userId?: string;
  collectionId?: string;
  type: string;
  tokenId: string | number;
  attributes: IAttributes;
  transferingDirection?: NFT_STATUS;
  transferingTx?: string;
  state: string;
}

export interface IInfantryAttributes extends IAttributes {
  Faction?: string | number;
  'Combat Role'?: string | number;
  'Sub Class Name'?: string | number;
  'Special Ability'?: string | number;
  'Weapon Slots'?: string | number;
  Loadout?: string | number;
  'Utility Slots'?: string | number;
  Utility?: string | number;
  'Stats Defense'?: string | number;
  'Stats Offense'?: string | number;
  'Stats Mobility'?: string | number;
  'Stats Versatility'?: string | number;
  'Character Quote'?: string | number;
}

export interface IInfantry extends INFT {
  attributes: IInfantryAttributes;
}

export type IAsset = IInfantry | INFT;
