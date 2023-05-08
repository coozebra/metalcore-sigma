import { ReactNode } from 'react';
import styled from 'styled-components';
import Image from 'next/image';

interface ITooltip {
  children: ReactNode;
  className?: string;
  top?: number;
  left?: number;
  onClose: () => void;
}

export const Tooltip = ({ children, className, onClose }: ITooltip) => {
  return (
    <Tooltip.Wrapper className={className} onMouseLeave={onClose}>
      <Tooltip.CloseWrapper onClick={onClose}>
        <Tooltip.Close src="/close.svg" height="20" width="20" alt="x" />
      </Tooltip.CloseWrapper>
      <Tooltip.Content>{children}</Tooltip.Content>
    </Tooltip.Wrapper>
  );
};

Tooltip.Wrapper = styled.div`
  width: 120px;
  height: 80px;
  background: ${({ theme }) => theme.colors.white};
  position: absolute;
  top: 120%;
  left: 60%;
  transform: skewX(15deg);
  display: flex;
  justify-content: center;
  align-items: center;

  &:before {
    content: '';
    position: absolute;
    left: 0;
    top: -13px;
    width: 0;
    height: 0;
    border-bottom: 13px solid ${({ theme }) => theme.colors.white};
    border-right: 13px solid transparent;
  }
`;

Tooltip.Content = styled.div`
  transform: skewX(-15deg);
`;

Tooltip.CloseWrapper = styled.div`
  transform: skewX(-15deg);
  position: absolute;
  top: 0;
  right: 0;
  padding: 5px;
  cursor: pointer;
  z-index: 10;
`;

Tooltip.Close = styled(Image)`
  filter: brightness(0) saturate(100%) invert(0%) sepia(6%) saturate(7500%) hue-rotate(324deg)
    brightness(94%) contrast(105%);
`;
