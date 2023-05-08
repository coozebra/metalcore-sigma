import styled, { css } from 'styled-components';
import { ReactNode } from 'react';

export const Card = ({ children, className }: { children: ReactNode; className?: string }) => {
  return (
    <Card.Wrapper className={className}>
      <Card.Corner />
      <Card.Corner $direction="upper-right" />
      <Card.Corner $direction="lower-left" />
      <Card.Corner $direction="lower-right" />
      {children}
      <Card.Background />
    </Card.Wrapper>
  );
};

Card.Wrapper = styled.div`
  position: relative;
  border: 3px solid ${({ theme }) => theme.colors.white};
`;

Card.Background = styled.div`
  background-color: ${({ theme }) => theme.colors.darkGreen};
  position: absolute;
  mix-blend-mode: overlay;
  opacity: 0.7;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  z-index: -1;
`;

Card.Corner = styled.div<{ $direction?: string }>`
  position: absolute;
  width: 36px;
  height: 36px;
  background-image: url('/corner.svg');
  top: -6px;
  left: -6px;

  ${({ $direction }) => {
    switch ($direction) {
      case 'upper-right':
        return css`
          left: unset;
          right: -6px;
          transform: rotate(90deg);
        `;
      case 'lower-left':
        return css`
          top: unset;
          bottom: -6px;
          transform: rotate(-90deg);
        `;
      case 'lower-right':
        return css`
          top: unset;
          left: unset;
          right: -6px;
          bottom: -6px;
          transform: rotate(-180deg);
        `;
      default:
        return css``;
    }
  }}
`;
