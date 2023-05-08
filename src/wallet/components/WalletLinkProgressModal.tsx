import styled, { css } from 'styled-components';
import Link from 'next/link';

import { H2, Text, A } from 'shared/text';
import { Modal } from 'shared/components/Modal';
import { ProgressBar } from 'shared/components/ProgressBar';

interface IWalletLinkProgressModal {
  error?: string;
  progress: number;
  close: () => void;
}

export const WalletLinkProgressModal = ({ error, progress, close }: IWalletLinkProgressModal) => {
  return (
    <WalletLinkProgressModal.Modal onClose={close}>
      <WalletLinkProgressModal.ModalWrapper>
        <WalletLinkProgressModal.ModalBody>
          <WalletLinkProgressModal.ProgressBar progress={progress} errors={!!error} />
          <>
            <WalletLinkProgressModal.ModalHeader>
              link wallet to account
            </WalletLinkProgressModal.ModalHeader>
            <WalletLinkProgressModal.ModalText>
              {progress < 67 && !error && 'Signing message.'}
              {progress >= 67 && progress < 100 && !error && 'Linking wallet.'}
              {progress >= 100 && !error && 'Wallet linked!'}
              {error && error}
            </WalletLinkProgressModal.ModalText>
            {progress >= 100 && !error && (
              <WalletLinkProgressModal.Link href="/dashboard" aria-label="dashboard" onClick={close}>
                Go to dashboard
              </WalletLinkProgressModal.Link>
            )}
          </>
        </WalletLinkProgressModal.ModalBody>
      </WalletLinkProgressModal.ModalWrapper>
    </WalletLinkProgressModal.Modal>
  );
};

WalletLinkProgressModal.Modal = styled(Modal)`
  @media (max-width: ${({ theme }) => theme.breakpoints.medium}px) {
    width: 90vw;
    height: 90vh;
  }
`;

WalletLinkProgressModal.ModalWrapper = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  padding: 20px 50px;
  text-align: center;
  background-image: url(/presale/transaction-frame.png);
  background-size: 100% 100%;
  @media (max-width: ${({ theme }) => theme.breakpoints.medium}px) {
    padding: 20px;
  }
`;

WalletLinkProgressModal.ProgressBar = styled(ProgressBar)`
  margin-bottom: 10px;
`;

WalletLinkProgressModal.ModalHeader = styled(H2)`
  color: ${({ theme }) => theme.colors.white};
  font-weight: 600;
  padding-bottom: 10px;
  -webkit-text-stroke: 1px ${({ theme }) => theme.colors.green};
  -webkit-text-fill-color: ${({ theme }) => theme.colors.black}; ;
`;

WalletLinkProgressModal.ModalBody = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
`;

WalletLinkProgressModal.ModalLoader = styled.div`
  height: 50px;
`;

WalletLinkProgressModal.ModalText = styled(Text)`
  color: ${({ theme }) => theme.colors.white};
  text-transform: none;
  padding-bottom: 10px;
  text-align: center;
`;

WalletLinkProgressModal.ErrorMessage = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-rows: max-content 25px;
  justify-items: center;
`;

WalletLinkProgressModal.ErrorText = styled(WalletLinkProgressModal.ModalText)`
  width: 100%;
  height: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: center;
`;

WalletLinkProgressModal.Link = styled(Link)<{ $active?: boolean }>`
  color: ${({ theme }) => theme.colors.green};
  margin: 0 23px;
  font-weight: 600;
  font-size: 1em;
  text-decoration: none;

  ${({ $active }) =>
    $active &&
    css`
      border-bottom: 1px solid ${({ theme }) => theme.colors.white};
      padding-bottom: 4px;
    `}

  @media (max-width: ${({ theme }) => theme.breakpoints.medium}px) {
    padding: 26px 0;
  }
`;
