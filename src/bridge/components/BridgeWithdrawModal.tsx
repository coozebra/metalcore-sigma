import styled, { css } from 'styled-components';
import { useEffect, useState } from 'react';

import { Modal } from 'shared/components/Modal';
import { H3, Text, Link } from 'shared/text';
import { Button } from 'shared/components/Button';
import { useBridge } from 'bridge/providers/BridgeProvider';
import { BRIDGE_TRANSACTION_STATUS } from 'shared/enums/TransactionStatus';
import { Loader } from 'shared/components/Loader';
import { formatExplorerLink } from 'web3/utils';
import { useWeb3 } from 'web3/providers/Web3Provider';
import { ProgressBar } from 'shared/components/ProgressBar';

interface IBridgeWithdrawModal {
  onClose: () => void;
}

export const BridgeWithdrawModal = ({ onClose }: IBridgeWithdrawModal) => {
  const { transaction } = useBridge();
  const { chainId } = useWeb3();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    switch (transaction.status) {
      case BRIDGE_TRANSACTION_STATUS.MINTABLE_REQUESTED:
      case BRIDGE_TRANSACTION_STATUS.WITHDRAWABLE_REQUESTED:
        setProgress(25);
        break;
      case BRIDGE_TRANSACTION_STATUS.MINTING:
      case BRIDGE_TRANSACTION_STATUS.WITHDRAWING:
        setProgress(50);
        break;
      case BRIDGE_TRANSACTION_STATUS.CONFIRMED:
        setProgress(75);
        break;
      case BRIDGE_TRANSACTION_STATUS.MINTED:
      case BRIDGE_TRANSACTION_STATUS.WITHDRAWN:
        setProgress(100);
        break;
      default:
        break;
    }
  }, [transaction.status]);

  return (
    <BridgeWithdrawModal.Modal onClose={onClose}>
      <BridgeWithdrawModal.ModalWrapper>
        <BridgeWithdrawModal.ModalBody>
          <BridgeWithdrawModal.ProgressBar
            progress={progress}
            errors={transaction.status === BRIDGE_TRANSACTION_STATUS.ERROR}
          />
          {(transaction.status === BRIDGE_TRANSACTION_STATUS.MINTABLE_REQUESTED ||
            transaction.status === BRIDGE_TRANSACTION_STATUS.WITHDRAWABLE_REQUESTED) && (
            <>
              <BridgeWithdrawModal.ModalHeader>
                * Fetching Signatures
              </BridgeWithdrawModal.ModalHeader>
              <BridgeWithdrawModal.ModalLoader>
                <Loader />
              </BridgeWithdrawModal.ModalLoader>
              <BridgeWithdrawModal.ModalText>
                Please wait while we confirm your transaction signatures.
              </BridgeWithdrawModal.ModalText>
            </>
          )}

          {(transaction.status === BRIDGE_TRANSACTION_STATUS.MINTING ||
            transaction.status === BRIDGE_TRANSACTION_STATUS.WITHDRAWING) && (
            <>
              <BridgeWithdrawModal.ModalHeader>
                * Initiating Transaction
              </BridgeWithdrawModal.ModalHeader>
              <BridgeWithdrawModal.ModalLoader>
                <Loader />
              </BridgeWithdrawModal.ModalLoader>
              <BridgeWithdrawModal.ModalText>
                Please confirm the transaction within your wallet so we can withdraw your tokens.
              </BridgeWithdrawModal.ModalText>
            </>
          )}

          {transaction.status === BRIDGE_TRANSACTION_STATUS.CONFIRMED && (
            <>
              <BridgeWithdrawModal.ModalHeader>
                * Waiting For Confirmation
              </BridgeWithdrawModal.ModalHeader>
              <BridgeWithdrawModal.ModalLoader>
                <Loader />
              </BridgeWithdrawModal.ModalLoader>
              <BridgeWithdrawModal.ModalText>
                Please do not refresh or close the page while we wait for the transaction to be
                confirmed. This may take a few minutes. In the meantime, you can also view your
                transaction on the block explorer:
              </BridgeWithdrawModal.ModalText>
              {transaction.hash && (
                <BridgeWithdrawModal.ModalLink
                  href={formatExplorerLink({
                    type: 'transaction',
                    data: [chainId, transaction.hash],
                  })}
                  target="_blank"
                  rel="noreferrer"
                >
                  Click here to view your transaction.
                </BridgeWithdrawModal.ModalLink>
              )}
            </>
          )}

          {(transaction.status === BRIDGE_TRANSACTION_STATUS.MINTED ||
            transaction.status === BRIDGE_TRANSACTION_STATUS.WITHDRAWN) && (
            <>
              <BridgeWithdrawModal.ModalHeader>
                * Confirmation Complete!
              </BridgeWithdrawModal.ModalHeader>
              <BridgeWithdrawModal.ModalText>
                Tokens successfully withdrawn. Please check your wallet for the updated balance. In
                the meantime, you can also view your transaction on the block explorer:
              </BridgeWithdrawModal.ModalText>
              {transaction.hash && (
                <BridgeWithdrawModal.ModalLink
                  href={formatExplorerLink({
                    type: 'transaction',
                    data: [chainId, transaction.hash],
                  })}
                  target="_blank"
                  rel="noreferrer"
                >
                  Click here to view your transaction.
                </BridgeWithdrawModal.ModalLink>
              )}
            </>
          )}

          {transaction.status === BRIDGE_TRANSACTION_STATUS.ERROR && (
            <>
              <BridgeWithdrawModal.ModalHeader>
                * Transaction Failed
              </BridgeWithdrawModal.ModalHeader>
              {transaction.error?.message && (
                <BridgeWithdrawModal.ModalText>
                  {transaction.error?.message}
                </BridgeWithdrawModal.ModalText>
              )}
              <BridgeWithdrawModal.ModalText>
                If you are in need support feel free to{' '}
                <BridgeWithdrawModal.ModalLink
                  href="mailto:inquiries@metalcoregame.com"
                  aria-label="get in touch"
                >
                  get in touch
                </BridgeWithdrawModal.ModalLink>{' '}
                with us.
              </BridgeWithdrawModal.ModalText>
              {transaction.error?.cause && (
                <BridgeWithdrawModal.ModalLink
                  href={formatExplorerLink({
                    type: 'transaction',
                    data: [chainId, transaction.error?.cause],
                  })}
                  target="_blank"
                  rel="noreferrer"
                >
                  Click here to view more details about your transaction.
                </BridgeWithdrawModal.ModalLink>
              )}
            </>
          )}
        </BridgeWithdrawModal.ModalBody>
      </BridgeWithdrawModal.ModalWrapper>
    </BridgeWithdrawModal.Modal>
  );
};

BridgeWithdrawModal.Modal = styled(Modal)`
  @media (max-width: ${({ theme }) => theme.breakpoints.medium}px) {
    width: 90vw;
    height: 90vh;
  }
`;

BridgeWithdrawModal.ModalWrapper = styled.div<{ $centered?: boolean }>`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  padding: 20px 50px;
  text-align: center;

  ${({ $centered }) =>
    $centered &&
    css`
      justify-content: center;

      @media (max-width: ${({ theme }) => theme.breakpoints.medium}px) {
        align-items: center;
      }
    `}

  @media (max-width: ${({ theme }) => theme.breakpoints.medium}px) {
    padding: 20px;
  }
`;

BridgeWithdrawModal.ProgressBar = styled(ProgressBar)`
  margin-bottom: 10px;
`;

BridgeWithdrawModal.ModalHeader = styled(H3)`
  color: ${({ theme }) => theme.colors.white};
  font-weight: 600;
  padding-bottom: 10px;
`;

BridgeWithdrawModal.ModalBody = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
`;

BridgeWithdrawModal.ModalLoader = styled.div`
  height: 50px;
`;

BridgeWithdrawModal.ModalFooter = styled.div`
  display: flex;
  justify-content: center;
`;

BridgeWithdrawModal.ModalButton = styled(Button)`
  width: 125px;
  flex-grow: 0;
  margin: 0 20px;

  @media (max-width: ${({ theme }) => theme.breakpoints.medium}px) {
    margin: 0 10px;
  }
`;

BridgeWithdrawModal.ModalText = styled(Text)`
  color: ${({ theme }) => theme.colors.white};
  text-transform: none;
  padding-bottom: 10px;
  text-align: center;
`;

BridgeWithdrawModal.ModalLink = styled(Link)`
  color: ${({ theme }) => theme.colors.green};
  text-transform: none;
  text-decoration: underline;

  :active,
  :hover {
    color: ${({ theme }) => theme.colors.green};
    text-decoration: none;
  }
`;

BridgeWithdrawModal.InfoWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-column-gap: 12px;
  grid-row-gap: 6px;
  width: 100%;
  border-bottom: 1px solid ${({ theme }) => theme.colors.white};
  padding-bottom: 24px;

  @media (min-width: ${({ theme }) => theme.breakpoints.medium}px) {
    grid-template-columns: min-content 1fr;
    grid-row-gap: 6px;
  }
`;

BridgeWithdrawModal.InfoLabel = styled(H3)`
  color: ${({ theme }) => theme.colors.darkGray};
`;

BridgeWithdrawModal.InfoValue = styled(H3)`
  color: ${({ theme }) => theme.colors.lightGray};
`;
