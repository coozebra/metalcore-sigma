import { useState } from 'react';
import getConfig from 'next/config';
import axios from 'axios';

import { IAsset, NFT_STATUS } from 'dashboard/types/NFT';
import { useLocalStorage } from 'shared/hooks/useLocalStorage';
import { useContract } from 'shared/hooks/useContract';
import { useWeb3 } from 'web3/providers/Web3Provider';
import ASSET_ABI from 'contracts/ABI/Asset.json';
import PORTAL_ABI from 'contracts/ABI/Portal.json';
import type { Asset, Portal } from 'contracts/types';

interface IUseNFTTransfer {
  progress: number;
  transfer: ({
    NFT,
    handleTransfer,
  }: {
    NFT: IAsset;
    handleTransfer: (NFT: IAsset) => void;
  }) => void;
  message?: string;
  error?: string;
  reset: () => void;
}

export const useNFTTransfer = (): IUseNFTTransfer => {
  const [progress, setProgress] = useState<number>(0);
  const [message, setMessage] = useState<string | undefined>();
  const [error, setError] = useState<string | undefined>();
  const { value: storageApprovals, update: updateApprovals } = useLocalStorage('approvals');

  const approvals = storageApprovals ?? {};

  const reset = () => {
    setProgress(0);
    setMessage(undefined);
    setError(undefined);
  };

  const { publicRuntimeConfig } = getConfig();
  const { chainId, library } = useWeb3();

  const assetAddress = publicRuntimeConfig.INFANTRY_ADDRESS as string;
  const portalAddress = publicRuntimeConfig.PORTAL_ADDRESS as string;

  const assetContract = useContract<Asset>(assetAddress, ASSET_ABI);
  const portalContract = useContract<Portal>(portalAddress, PORTAL_ABI);

  const handleSuccess = ({
    NFT,
    handleTransfer,
  }: {
    NFT: IAsset;
    handleTransfer: (NFT: IAsset) => void;
  }) => {
    const {
      attributes: { status },
    } = NFT;
    const isLocked = status === NFT_STATUS.locked;

    setProgress(100);
    setMessage('Success');
    handleTransfer({
      ...NFT,
      transferingDirection: isLocked ? NFT_STATUS.unlocked : NFT_STATUS.locked,
    });
  };

  const handleError = (error: any) => {
    setError(error.message ?? JSON.stringify(error));
  };

  const handleWithdrawal = async ({
    NFT,
    handleTransfer,
    signature,
  }: {
    NFT: IAsset;
    handleTransfer: (NFT: IAsset) => void;
    signature: string;
  }) => {
    try {
      setMessage('Awaiting withdrawal');

      await portalContract?.withdrawERC721(assetAddress, NFT.tokenId, signature).then(() => {
        handleSuccess({ NFT, handleTransfer });
      });
    } catch (error) {
      handleError(error);
    }
  };

  const handleApproval = ({
    hash,
    NFT,
    signature,
    handleTransfer,
  }: {
    NFT: IAsset;
    handleTransfer: (NFT: IAsset) => void;
    hash: string;
    signature: string;
  }) => {
    const { id: assetId, tokenId } = NFT;

    library.waitForTransaction(hash).then(async ({ status }) => {
      try {
        if (status === 0) {
          throw Error('Transaction failed');
        }

        setMessage('Awaiting deposit');
        setProgress(80);

        await portalContract?.depositERC721(assetAddress, tokenId, signature).then(() => {
          updateApprovals({ ...approvals, [assetId]: undefined });
          handleSuccess({ NFT, handleTransfer });
        });
      } catch (error) {
        handleError(error);
      }
    });
  };

  const handleDeposit = async ({
    NFT,
    handleTransfer,
    signature,
  }: {
    NFT: IAsset;
    handleTransfer: (NFT: IAsset) => void;
    signature: string;
  }) => {
    const { id: assetId, tokenId } = NFT;

    try {
      setMessage('Awaiting approval');
      const approvalHash = approvals[assetId];

      const approval = approvalHash
        ? { hash: approvalHash }
        : await assetContract?.approve(portalAddress, tokenId);

      const hash = approval?.hash;
      updateApprovals({ ...approvals, [assetId]: hash });

      setProgress(75);
      setMessage('Awaiting approval transaction');

      handleApproval({ NFT, hash, signature, handleTransfer });
    } catch (error) {
      handleError(error);
    }
  };

  const transfer = async ({
    NFT,
    handleTransfer,
  }: {
    NFT: IAsset;
    handleTransfer: (NFT: IAsset) => void;
  }) => {
    const {
      id: assetId,
      tokenId,
      attributes: { status },
    } = NFT;

    if (!tokenId || !assetId) return;

    setProgress(25);
    setMessage('Fetching signatures');

    try {
      const isLocked = status === NFT_STATUS.locked;
      const action = isLocked ? 'withdraw' : 'deposit';

      const {
        data: { signature },
      } = await axios.get('/api/v1/users/tranfer-signature', {
        params: { assetId, chainId, action },
      });

      setProgress(50);
      if (isLocked) {
        handleWithdrawal({ NFT, handleTransfer, signature });
      } else {
        handleDeposit({ NFT, handleTransfer, signature });
      }
    } catch (error: any) {
      handleError(error);
    }
  };

  return {
    progress,
    transfer,
    message,
    error,
    reset,
  };
};
