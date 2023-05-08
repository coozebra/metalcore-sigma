import { useState } from 'react';
import styled, { css } from 'styled-components';
import Image from 'next/image';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import { H2, Text, Link } from 'shared/text';
import { Button } from 'shared/components/Button';
import { Modal } from 'shared/components/Modal';
import { Loader } from 'shared/components/Loader';
import { ProgressBar } from 'shared/components/ProgressBar';
import { useWeb3 } from 'web3/providers/Web3Provider';
import { formatExplorerLink } from 'web3/utils';
import { SALES_TRANSACTION_STATUS } from 'shared/enums/TransactionStatus';
import { CheckmarkIcon } from 'shared/components/CheckmarkIcon';

interface IProps {
  close: () => void;
  retry: (params?: any) => void;
  progress: number;
  status: SALES_TRANSACTION_STATUS;
  hash?: string;
  errorMessage?: string;
  errorCause?: string;
}

export const SalesProgressModal = ({
  close,
  retry,
  progress,
  status,
  hash,
  errorMessage,
  errorCause,
}: IProps) => {
  const { chainId } = useWeb3();
  const [hasCopied, setHasCopied] = useState(false);

  const handleContractCopy = () => {
    setHasCopied(true);

    setTimeout(() => setHasCopied(false), 3000);
  };

  return (
    <SalesProgressModal.Modal onClose={close}>
      <SalesProgressModal.ModalWrapper
        $centered={
          status === SALES_TRANSACTION_STATUS.PURCHASING ||
          status === SALES_TRANSACTION_STATUS.CONFIRMED
        }
      >
        <SalesProgressModal.ModalBody>
          <SalesProgressModal.ProgressBar
            progress={progress}
            errors={status === SALES_TRANSACTION_STATUS.ERROR}
          />

          {status === SALES_TRANSACTION_STATUS.PURCHASING && (
            <>
              <SalesProgressModal.ModalHeader>
                Initiating Transaction
              </SalesProgressModal.ModalHeader>
              <SalesProgressModal.ModalLoader>
                <Loader />
              </SalesProgressModal.ModalLoader>
              <SalesProgressModal.ModalText>
                Please confirm the transaction within your wallet so we can create the NFT(s) in
                your wallet.
              </SalesProgressModal.ModalText>
            </>
          )}
          {status === SALES_TRANSACTION_STATUS.CONFIRMED && (
            <>
              <SalesProgressModal.ModalHeader>
                Waiting For Confirmation
              </SalesProgressModal.ModalHeader>
              <SalesProgressModal.ModalLoader>
                <Loader />
              </SalesProgressModal.ModalLoader>
              <SalesProgressModal.ModalText>
                Please do not refresh or close the page while we wait for the transaction to be
                confirmed in Etherscan so we can finish generating the NFT(s) in your wallet. This
                may take a few minutes.
              </SalesProgressModal.ModalText>
              {hash && (
                <SalesProgressModal.ModalLink
                  href={formatExplorerLink({
                    type: 'transaction',
                    data: [chainId, hash],
                  })}
                  target="_blank"
                  rel="noreferrer"
                >
                  Click here to view the status of your transaction.
                </SalesProgressModal.ModalLink>
              )}
            </>
          )}
          {status === SALES_TRANSACTION_STATUS.PURCHASED && (
            <>
              <SalesProgressModal.ModalHeader>
                Confirmation Complete!
              </SalesProgressModal.ModalHeader>
              <SalesProgressModal.ModalText>
                Congrats! You are now an owner of one of the unique infantry from METALCORE. You can
                check your wallet to see the NFT(s) address.
              </SalesProgressModal.ModalText>

              {hash && (
                <SalesProgressModal.ModalLink
                  href={formatExplorerLink({
                    type: 'transaction',
                    data: [chainId, hash],
                  })}
                  target="_blank"
                  rel="noreferrer"
                >
                  Click here to view your transaction.
                </SalesProgressModal.ModalLink>
              )}
            </>
          )}
          {status === SALES_TRANSACTION_STATUS.ERROR && (
            <>
              <SalesProgressModal.ModalHeader>Transaction Failed</SalesProgressModal.ModalHeader>
              {errorMessage && (
                <SalesProgressModal.ErrorMessage>
                  <SalesProgressModal.ErrorText>{errorMessage}</SalesProgressModal.ErrorText>
                  <SalesProgressModal.CopyToClipboard>
                    <CopyToClipboard text={errorMessage} onCopy={handleContractCopy}>
                      <SalesProgressModal.CopyToClipboardWrapper>
                        <SalesProgressModal.CopyToClipboardText>
                          Copy error message to clipboard
                        </SalesProgressModal.CopyToClipboardText>
                        {hasCopied ? (
                          <SalesProgressModal.Checkmark />
                        ) : (
                          <SalesProgressModal.Copy
                            src="/icons/copy-icon.png"
                            height="25"
                            width="25"
                            alt="copy error message to clipboard"
                          />
                        )}
                      </SalesProgressModal.CopyToClipboardWrapper>
                    </CopyToClipboard>
                  </SalesProgressModal.CopyToClipboard>
                </SalesProgressModal.ErrorMessage>
              )}
              <SalesProgressModal.ModalText>
                If you are in need support feel free to{' '}
                <SalesProgressModal.ModalLink
                  href="mailto:inquiries@metalcoregame.com"
                  aria-label="get in touch"
                >
                  get in touch
                </SalesProgressModal.ModalLink>{' '}
                with us.
              </SalesProgressModal.ModalText>
              {errorCause && (
                <SalesProgressModal.ModalLink
                  href={formatExplorerLink({
                    type: 'transaction',
                    data: [chainId, errorCause],
                  })}
                  target="_blank"
                  rel="noreferrer"
                >
                  Click here to view more details about your transaction.
                </SalesProgressModal.ModalLink>
              )}
            </>
          )}
        </SalesProgressModal.ModalBody>
        <SalesProgressModal.ModalFooter>
          {status === SALES_TRANSACTION_STATUS.ERROR && (
            <SalesProgressModal.ModalButton primary onClick={retry}>
              try again
            </SalesProgressModal.ModalButton>
          )}

          {status === SALES_TRANSACTION_STATUS.PURCHASED && (
              <SalesProgressModal.NFTLink href="/nfts" aria-label="nfts">view nfts</SalesProgressModal.NFTLink>
          )}

          {(status === SALES_TRANSACTION_STATUS.ERROR ||
            status === SALES_TRANSACTION_STATUS.PURCHASED) && (
            <SalesProgressModal.ModalButton ghost onClick={close}>
              close
            </SalesProgressModal.ModalButton>
          )}
        </SalesProgressModal.ModalFooter>
      </SalesProgressModal.ModalWrapper>
    </SalesProgressModal.Modal>
  );
};

SalesProgressModal.Modal = styled(Modal)`
  @media (max-width: ${({ theme }) => theme.breakpoints.medium}px) {
    width: 90vw;
    height: 90vh;
  }
`;

SalesProgressModal.ModalWrapper = styled.div<{ $centered: boolean }>`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  padding: 20px 50px;
  text-align: center;
  background-image: url(/modal-frame.png);
  background-size: 100% 100%;

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

SalesProgressModal.ProgressBar = styled(ProgressBar)`
  margin-bottom: 10px;
`;

SalesProgressModal.ModalHeader = styled(H2)`
  color: ${({ theme }) => theme.colors.white};
  font-weight: 600;
  padding-bottom: 10px;
  -webkit-text-stroke: 1px ${({ theme }) => theme.colors.green};
  -webkit-text-fill-color: ${({ theme }) => theme.colors.black}; ;
`;

SalesProgressModal.ModalBody = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
`;

SalesProgressModal.ModalLoader = styled.div`
  height: 50px;
`;

SalesProgressModal.ModalFooter = styled.div`
  display: flex;
  justify-content: center;
`;

SalesProgressModal.ModalButton = styled(Button)`
  width: 135px;
  flex-grow: 0;
  margin: 0 20px;

  @media (max-width: ${({ theme }) => theme.breakpoints.medium}px) {
    margin: 0 10px;
  }
`;

SalesProgressModal.ModalText = styled(Text)`
  color: ${({ theme }) => theme.colors.white};
  text-transform: none;
  padding-bottom: 10px;
  text-align: center;
`;

SalesProgressModal.NFTLink = styled(Link)`
  color: ${({ theme }) => theme.colors.black};
  background: ${({ theme }) => theme.colors.green};
  font-weight: 600;
  width: 125px;
  margin: 0 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-grow: 0;
  text-align: center;

  :active,
  :hover {
    color: ${({ theme }) => theme.colors.black};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.medium}px) {
    margin: 0 10px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.small}px) {
    width: 150px;
  }
`;

SalesProgressModal.CopyToClipboardWrapper = styled.div`
  display: grid;
  grid-template-columns: 174px 25px;
  cursor: pointer;
`;

SalesProgressModal.CopyToClipboardText = styled(SalesProgressModal.ModalText)`
  color: ${({ theme }) => theme.colors.green};
  padding: 0;
  font-size: 12px;
  line-height: 27px;
`;

SalesProgressModal.ErrorMessage = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-rows: max-content 25px;
  justify-items: center;
`;

SalesProgressModal.CopyToClipboard = styled.div`
  display: grid;
  position: relative;
`;

SalesProgressModal.ErrorText = styled(SalesProgressModal.ModalText)`
  width: 100%;
  height: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: center;
`;

SalesProgressModal.Checkmark = styled(CheckmarkIcon)`
  height: 25px;
  width: 25px;
  transform: scale(0.15);
  position: absolute;
  top: -4px;
  right: 0;
`;

SalesProgressModal.Copy = styled(Image)`
  cursor: pointer;
`;

SalesProgressModal.ModalLink = styled(Link)`
  color: ${({ theme }) => theme.colors.green};
  text-transform: none;
  text-decoration: underline;

  :active,
  :hover {
    color: ${({ theme }) => theme.colors.green};
    text-decoration: none;
  }
`;
