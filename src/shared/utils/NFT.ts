import uniqBy from 'lodash.uniqby';

import { IAsset, INFT, INFTAttribute, NFT_STATUS } from '../../dashboard/types/NFT';

export const parseAttributes = (attributes: INFTAttribute[]) =>
  Object.fromEntries(attributes?.map(({ trait_type, value }) => [trait_type, value]));

export const parseNemesisNFT = (NFT: INFT): IAsset => ({
  ...NFT,
  attributes: {
    status: NFT.userId ? NFT_STATUS.locked : NFT_STATUS.unlocked,
    ...NFT.attributes,
    ...parseAttributes(NFT.attributes.attributes),
    isVideo: NFT?.attributes?.image?.includes('.mp4'),
  },
});

export const parseNemesisNFTs = (NFTs: INFT[]): IAsset[] => {
  const validNFTs = NFTs.filter(({ state }) => !['burnt', 'burning'].includes(state));

  return uniqBy(validNFTs.map(parseNemesisNFT), 'id');
};
