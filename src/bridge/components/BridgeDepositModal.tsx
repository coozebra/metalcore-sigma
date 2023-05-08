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
import { CHAIN_CONFIRMATIONS } from 'web3/enums/chains';

interface IBridgeDepositModal {
  toNetwork?: string;
}

export const BridgeDepositModal = ({ toNetwork }: IBridgeDepositModal) => {
  const { dismissDepositModal, transaction } = useBridge();
  const { chainId } = useWeb3();
  const [progress, setProgress] = useState(0);

  const showModalCloseButton =
    transaction.status !== BRIDGE_TRANSACTION_STATUS.BURNED &&
    transaction.status !== BRIDGE_TRANSACTION_STATUS.TRANSFERRED;

  const handleClose = () => {
    /**
     * NOTE: This ensures that the user cannot dismiss the modal and reads the
     * success message which instructs the user to switch their wallet accounts.
     * Once the chains change on their wallet the application will automatically
     * refresh thereby dismissing the modal
     */
    if (
      transaction.status === BRIDGE_TRANSACTION_STATUS.BURNED ||
      transaction.status === BRIDGE_TRANSACTION_STATUS.TRANSFERRED
    ) {
      return;
    }

    dismissDepositModal();
  };

  useEffect(() => {
    switch (transaction.status) {
      case BRIDGE_TRANSACTION_STATUS.BURNING:
      case BRIDGE_TRANSACTION_STATUS.TRANSFERRING:
        setProgress(33);
        break;
      case BRIDGE_TRANSACTION_STATUS.CONFIRMED:
        setProgress(66);
        break;
      case BRIDGE_TRANSACTION_STATUS.BURNED:
      case BRIDGE_TRANSACTION_STATUS.TRANSFERRED:
        setProgress(100);
        break;
      default:
        break;
    }
  }, [transaction.status]);

  return (
    <BridgeDepositModal.Modal onClose={handleClose} showClose={showModalCloseButton}>
      <BridgeDepositModal.ModalWrapper>
        <BridgeDepositModal.ModalBody>
          <BridgeDepositModal.ProgressBar
            progress={progress}
            errors={transaction.status === BRIDGE_TRANSACTION_STATUS.ERROR}
          />

          {(transaction.status === BRIDGE_TRANSACTION_STATUS.BURNING ||
            transaction.status === BRIDGE_TRANSACTION_STATUS.TRANSFERRING) && (
            <>
              <BridgeDepositModal.ModalHeader>
                * Initiating Transaction
              </BridgeDepositModal.ModalHeader>
              <BridgeDepositModal.ModalLoader>
                <Loader />
              </BridgeDepositModal.ModalLoader>
              <BridgeDepositModal.ModalText>
                Please confirm the transaction within your wallet such as MetaMask so we can deposit
                your tokens.
              </BridgeDepositModal.ModalText>
            </>
          )}

          {transaction.status === BRIDGE_TRANSACTION_STATUS.CONFIRMED && (
            <>
              <BridgeDepositModal.ModalHeader>
                * Waiting For Confirmation
              </BridgeDepositModal.ModalHeader>
              <BridgeDepositModal.ModalLoader>
                <Loader />
              </BridgeDepositModal.ModalLoader>
              <BridgeDepositModal.ModalText>
                Please do not refresh or close the page while we wait for the transaction to be
                confirmed. This may take a few minutes. In the meantime, you can also view your
                transaction on the block explorer:
              </BridgeDepositModal.ModalText>
              {transaction.hash && (
                <BridgeDepositModal.ModalLink
                  href={formatExplorerLink({
                    type: 'transaction',
                    data: [chainId, transaction.hash],
                  })}
                  target="_blank"
                  rel="noreferrer"
                >
                  Click here to view your transaction.
                </BridgeDepositModal.ModalLink>
              )}
              <BridgeDepositModal.ModalText>
                Waiting for confirmation blocks
              </BridgeDepositModal.ModalText>
              <BridgeDepositModal.ModalText $primary>
                [{`${transaction.confirmations} / ${CHAIN_CONFIRMATIONS[chainId!]}`}]
              </BridgeDepositModal.ModalText>
            </>
          )}

          {(transaction.status === BRIDGE_TRANSACTION_STATUS.BURNED ||
            transaction.status === BRIDGE_TRANSACTION_STATUS.TRANSFERRED) && (
            <>
              <BridgeDepositModal.ModalHeader>
                * Confirmation Complete!
              </BridgeDepositModal.ModalHeader>
              <BridgeDepositModal.ModalText>Tokens successfully sent.</BridgeDepositModal.ModalText>
              <BridgeDepositModal.ModalText>
                <BridgeDepositModal.ModalTextUnderline>
                  Important:
                </BridgeDepositModal.ModalTextUnderline>{' '}
                Please switch over to{' '}
                <BridgeDepositModal.ModalTextUnderline>
                  {toNetwork}
                </BridgeDepositModal.ModalTextUnderline>{' '}
                within your wallet to continue the bridge process. Once you switch over to{' '}
                <BridgeDepositModal.ModalTextUnderline>
                  {toNetwork}
                </BridgeDepositModal.ModalTextUnderline>{' '}
                the page will automatically refresh and you will be directed to the withdraw tab.
              </BridgeDepositModal.ModalText>
            </>
          )}

          {transaction.status === BRIDGE_TRANSACTION_STATUS.ERROR && (
            <>
              <BridgeDepositModal.ModalHeader>* Transaction Failed</BridgeDepositModal.ModalHeader>
              {transaction.error?.message && (
                <BridgeDepositModal.ModalText>
                  {transaction.error?.message}
                </BridgeDepositModal.ModalText>
              )}
              <BridgeDepositModal.ModalText>
                If you are in need support feel free to{' '}
                <BridgeDepositModal.ModalLink
                  href="mailto:inquiries@metalcoregame.com"
                  aria-label="get in touch"
                >
                  get in touch
                </BridgeDepositModal.ModalLink>{' '}
                with us.
              </BridgeDepositModal.ModalText>
              {transaction.error?.cause && (
                <BridgeDepositModal.ModalLink
                  href={formatExplorerLink({
                    type: 'transaction',
                    data: [chainId, transaction.error?.cause],
                  })}
                  target="_blank"
                  rel="noreferrer"
                >
                  Click here to view more details about your transaction.
                </BridgeDepositModal.ModalLink>
              )}
            </>
          )}
        </BridgeDepositModal.ModalBody>
      </BridgeDepositModal.ModalWrapper>
    </BridgeDepositModal.Modal>
  );
};

BridgeDepositModal.Modal = styled(Modal)`
  @media (max-width: ${({ theme }) => theme.breakpoints.medium}px) {
    width: 90vw;
    height: 90vh;
  }
`;

BridgeDepositModal.ModalWrapper = styled.div<{ $centered?: boolean }>`
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

BridgeDepositModal.ProgressBar = styled(ProgressBar)`
  margin-bottom: 10px;
`;

BridgeDepositModal.ModalHeader = styled(H3)`
  color: ${({ theme }) => theme.colors.white};
  font-weight: 600;
  padding-bottom: 10px;
`;

BridgeDepositModal.ModalBody = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
`;

BridgeDepositModal.ModalLoader = styled.div`
  height: 50px;
`;

BridgeDepositModal.ModalFooter = styled.div`
  display: flex;
  justify-content: center;
`;

BridgeDepositModal.ModalButton = styled(Button)`
  width: 125px;
  flex-grow: 0;
  margin: 0 20px;

  @media (max-width: ${({ theme }) => theme.breakpoints.medium}px) {
    margin: 0 10px;
  }
`;

BridgeDepositModal.ModalText = styled(Text)<{ $primary?: boolean }>`
  color: ${({ theme, $primary }) => ($primary ? theme.colors.green : theme.colors.white)};
  text-transform: none;
  padding-bottom: 10px;
  text-align: center;
`;

BridgeDepositModal.ModalTextUnderline = styled.span`
  text-decoration: underline;
`;

BridgeDepositModal.ModalLink = styled(Link)`
  color: ${({ theme }) => theme.colors.green};
  text-transform: none;
  text-decoration: underline;
  padding-bottom: 10px;

  :active,
  :hover {
    color: ${({ theme }) => theme.colors.green};
    text-decoration: none;
  }
`;

BridgeDepositModal.InfoWrapper = styled.div`
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

BridgeDepositModal.InfoLabel = styled(H3)`
  color: ${({ theme }) => theme.colors.darkGray};
`;

BridgeDepositModal.InfoValue = styled(H3)`
  color: ${({ theme }) => theme.colors.lightGray};
`;
