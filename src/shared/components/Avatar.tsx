import styled from 'styled-components';
import { ReactNode } from 'react';

import { Text } from 'shared/text';

export const Avatar = ({
  children,
  className,
  onMouseEnter,
  onMouseLeave,
  onClick,
}: {
  children: ReactNode
  className?: string;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onClick?: () => void;
}) => {
  return (
    <Avatar.Wrapper
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={className}
    >
      <Avatar.Text>{children}</Avatar.Text>
    </Avatar.Wrapper>
  );
};

Avatar.Wrapper = styled.div`
  height: 32px;
  width: 32px;
  border-radius: 50%;
  border: 1px solid white;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

Avatar.Text = styled(Text)`
  color: white;
`;
