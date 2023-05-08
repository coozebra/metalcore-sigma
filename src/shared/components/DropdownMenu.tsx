import styled from 'styled-components';
import React, { ReactNode } from 'react';

export const DropdownMenu = ({
  children,
  className,
  onMouseLeave,
}: {
  children: ReactNode;
  className?: string;
  onMouseLeave?: () => void;
}) => {
  return (
    <DropdownMenu.Wrapper className={className} onMouseLeave={onMouseLeave}>
      <DropdownMenu.List>
        {React.Children.map(children, child => (
          <DropdownMenu.ListItem>{child}</DropdownMenu.ListItem>
        ))}
      </DropdownMenu.List>
    </DropdownMenu.Wrapper>
  );
};

DropdownMenu.Wrapper = styled.div`
  min-width: 225px;
  background: rgba(0, 0, 0, 0.7);
  border: 1px solid white;
  padding: 0 12px;

  &:before {
    content: '';
    position: absolute;
    left: calc(63% - 42px);
    top: -13px;
    width: 0;
    height: 0;
    border-bottom: 13px solid white;
    border-right: 13px solid transparent;
    border-left: 13px solid transparent;

    @media (max-width: ${({ theme }) => theme.breakpoints.small}px) {
      left: calc(70% - 42px);
    }
  }
`;

DropdownMenu.List = styled.ul`
  list-style: none;
`;

DropdownMenu.ListItem = styled.li`
  font-family: 'rajdhani';
  font-style: normal;
  font-weight: 600;
  font-size: 18px;
  line-height: 19px;
  letter-spacing: 0.06em;
  text-transform: lowercase;
  color: white;
  padding: 12px 0;
`;
