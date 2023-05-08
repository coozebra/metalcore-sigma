import styled from 'styled-components';
import { ButtonHTMLAttributes } from 'react';

interface IHamburger extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  height?: number;
  width?: number;
}

export const Hamburger = ({ className, width, height, onClick }: IHamburger) => {
  return (
    <Hamburger.Button aria-label="menu" type="button" className={className} onClick={onClick}>
      <Hamburger.Wrapper $height={height} $width={width}>
        <Hamburger.Slice />
        <Hamburger.Slice />
        <Hamburger.Slice />
      </Hamburger.Wrapper>
    </Hamburger.Button>
  );
};

Hamburger.Button = styled.button`
  background-color: ${({ theme }) => theme.colors.darkBlack};
  border: none;
  padding-left: 0;
  outline: none;
`;

Hamburger.Wrapper = styled.div<{ $height?: number; $width?: number }>`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  height: ${({ $height }) => ($height ? `${$height}px` : '30px')};
  width: ${({ $width }) => ($width ? `${$width}px` : '30px')};
  background-color: ${({ theme }) => theme.colors.darkBlack};
`;

Hamburger.Slice = styled.span`
  background-color: ${({ theme }) => theme.colors.lightGray};
  height: 3px;
`;
