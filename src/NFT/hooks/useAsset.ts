import { BigNumber } from 'ethers';
import axios from 'axios';
import getConfig from 'next/config';
import Bugsnag from '@bugsnag/js';

import { INFT } from 'contracts/types/NFT';
import { useContract } from 'shared/hooks/useContract';
import { useWeb3 } from 'web3/providers/Web3Provider';
import ASSET_ABI from 'contracts/ABI/Asset.json';
import type { Asset } from 'contracts/types';

interface IUseAsset {
  getNFTs: () => Promise<INFT[] | undefined>;
}

export const useAsset = (): IUseAsset => {
  const { publicRuntimeConfig } = getConfig();
  const { account } = useWeb3();

  const CONTRACT = publicRuntimeConfig.ASSET_CONTRACT_ADDRESS as string;

  const contract = useContract<Asset>(CONTRACT, ASSET_ABI);

  const getNFTs = async (): Promise<INFT[]> => {
    const nfts: INFT[] = [];

    try {
      const balance = await contract?.balanceOf(account as string);

      if (balance) {
        for (let index = 0; index < balance?.toNumber(); index++) {
          const tokenId = await contract?.tokenOfOwnerByIndex(account as string, index);

          const tokenMetadataURI: string | undefined = await contract?.tokenURI(
            tokenId as BigNumber,
          );

          if (tokenMetadataURI) {
            const response = await axios.get(tokenMetadataURI);

            nfts.push(response?.data as INFT);
          }
        }
      }

      return nfts;
    } catch (error: any) {
      if (!error?.message) {
        error.message = `Error fetching NFTs. error: ${error?.message}`;
      }

      Bugsnag.notify(error, event => {
        event.severity = 'error';
        event.context = 'useAsset.getNFTs.balanceOf';
      });

      throw new Error('Error fetching NFTs.');
    }
  };

  return {
    getNFTs,
  };
};
