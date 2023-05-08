import styled, { css } from 'styled-components';

import { H2, Text, A } from 'shared/text';
import { Modal } from 'shared/components/Modal';
import { Button } from 'shared/components/Button';
import { ProgressBar } from 'shared/components/ProgressBar';

interface INFTTransferProgressModal {
  isLocked: boolean;
  error?: string;
  message?: string;
  progress: number;
  close: () => void;
}

export const NFTTransferProgressModal = ({
  isLocked,
  error,
  message,
  progress,
  close,
}: INFTTransferProgressModal) => {
  return (
    <NFTTransferProgressModal.Modal onClose={close}>
      <NFTTransferProgressModal.ModalWrapper>
        <NFTTransferProgressModal.ModalHeader>
          {isLocked ? 'Withdraw' : 'Deposit'} NFT
        </NFTTransferProgressModal.ModalHeader>
        <NFTTransferProgressModal.ModalBody>
          <NFTTransferProgressModal.ProgressBar progress={progress} errors={!!error} />
          <>
            <NFTTransferProgressModal.TextWrapper>
              <NFTTransferProgressModal.ModalText>
                {error ?? message}
              </NFTTransferProgressModal.ModalText>
            </NFTTransferProgressModal.TextWrapper>
            {Boolean(progress === 100 || error) && (
              <Button onClick={close} primary>
                close
              </Button>
            )}
          </>
        </NFTTransferProgressModal.ModalBody>
      </NFTTransferProgressModal.ModalWrapper>
    </NFTTransferProgressModal.Modal>
  );
};

NFTTransferProgressModal.Modal = styled(Modal)`
  @media (max-width: ${({ theme }) => theme.breakpoints.medium}px) {
    width: 90vw;
    height: 90vh;
  }
`;

NFTTransferProgressModal.ModalWrapper = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  padding: 20px 50px;
  text-align: center;
  background-image: url(/modal-frame.png);
  background-size: 100% 100%;
  @media (max-width: ${({ theme }) => theme.breakpoints.medium}px) {
    padding: 20px;
  }
`;

NFTTransferProgressModal.ProgressBar = styled(ProgressBar)`
  margin-bottom: 10px;
`;

NFTTransferProgressModal.ModalHeader = styled(H2)`
  color: ${({ theme }) => theme.colors.white};
  font-weight: 600;
  padding-bottom: 10px;
  -webkit-text-stroke: 1px ${({ theme }) => theme.colors.green};
  -webkit-text-fill-color: ${({ theme }) => theme.colors.black}; ;
`;

NFTTransferProgressModal.ModalBody = styled.div`
  display: grid;
  grid-auto-flow: row;
  grid-auto-rows: 1fr;
  justify-items: center;
  gap: 12px;
`;

NFTTransferProgressModal.ModalLoader = styled.div`
  height: 50px;
`;

NFTTransferProgressModal.TextWrapper = styled.div`
  overflow-y: auto;
  max-width: 600px;
  word-break: break-word;
  height: 100%;
  max-height: 120px;
`;

NFTTransferProgressModal.ModalText = styled(Text)`
  color: ${({ theme }) => theme.colors.white};
  text-transform: none;
  padding-bottom: 10px;
  text-align: center;
`;

NFTTransferProgressModal.ErrorMessage = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-rows: max-content 25px;
  justify-items: center;
`;

NFTTransferProgressModal.ErrorText = styled(NFTTransferProgressModal.ModalText)`
  width: 100%;
  height: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: center;
`;

NFTTransferProgressModal.Link = styled(A)<{ $active?: boolean }>`
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
