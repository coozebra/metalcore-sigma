import styled from 'styled-components';
import { useRef, ReactNode, useEffect } from 'react';
import { disableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock';

import { fadeIn } from 'styles/theme';
import Image from 'next/image';

interface IModalProps {
  children: ReactNode;
  className?: string;
  onClose: () => void;
  showClose?: boolean;
}

export const Modal = ({ children, className, onClose, showClose = true }: IModalProps) => {
  const ref = useRef(null);

  useEffect(() => {
    setTimeout(() => disableBodyScroll(ref?.current));

    return () => clearAllBodyScrollLocks();
  }, []);

  return (
    <Modal.Wrapper>
      <Modal.Backdrop ref={ref} onClick={onClose} />
      <Modal.ContentWrapper className={className}>
        {showClose && (
          <Modal.CloseWrapper>
            <span onClick={onClose}>
              <Image src="/close.svg" height="30" width="30" alt="x" />
            </span>
          </Modal.CloseWrapper>
        )}
        {children}
      </Modal.ContentWrapper>
    </Modal.Wrapper>
  );
};

Modal.Wrapper = styled.div`
  height: 100vh;
  width: 100vw;
  position: fixed;
  top: 0;
  left: 0;
  z-index: ${({ theme }) => theme.zIndex.backdrop};
`;

Modal.Backdrop = styled.div`
  height: 100vh;
  width: 100vw;
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  top: 0;
  left: 0;
  padding: 20px;
  background-color: rgba(255, 255, 255, 0.3);
  z-index: ${({ theme }) => theme.zIndex.backdrop};
  ${fadeIn}
`;

Modal.ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 700px;
  height: 500px;
  z-index: ${({ theme }) => theme.zIndex.modal};
  background-color: ${({ theme }) => theme.colors.black};
  top: 0;
  position: absolute;
  bottom: 0;
  right: 0;
  left: 0;
  margin: auto;
`;

Modal.CloseWrapper = styled.div`
  position: absolute;
  right: 0;
  padding: 10px;

  > span {
    cursor: pointer;
  }
`;
