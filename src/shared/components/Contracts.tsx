import { ReactNode } from 'react';
import styled from 'styled-components';

import { Text } from 'shared/text';

export const Contracts = ({ className, children }: { className?: string; children: ReactNode }) => {
  return (
    <Contracts.Wrapper className={className}>
      <Contracts.Header>
        <Contracts.HeaderText>important contracts</Contracts.HeaderText>
        <Contracts.HeaderWhiteBar />
        <Contracts.HeaderGreenBar />
      </Contracts.Header>
      <Contracts.Body>{children}</Contracts.Body>
    </Contracts.Wrapper>
  );
};

Contracts.Row = styled.div`
  display: flex;
  justify-content: space-between;

  @media (max-width: ${({ theme }) => theme.breakpoints.medium}px) {
    flex-direction: column;
  }
`;

Contracts.Wrapper = styled(Contracts.Row)`
  flex-direction: column;
  justify-content: flex-start;
  width: 30%;

  > span,
  > a {
    padding-bottom: 10px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.medium}px) {
    padding-top: 40px;
    min-width: 80%;

    > span,
    > a {
      padding-bottom: 25px;
    }
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.large}px) and (min-width: ${({ theme }) =>
      theme.breakpoints.small}px) {
    width: 100%;
    align-items: center;
    justify-content: center;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.small}px) {
    width: 90%;
    padding: 100px 0;
  }
`;

Contracts.Header = styled(Contracts.Row)`
  flex-direction: column;
  width: 100%;
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray};
  position: relative;
`;

Contracts.HeaderText = styled(Text)`
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.white};
  padding: 0 0 10px 40px;

  @media (max-width: ${({ theme }) => theme.breakpoints.large}px) and (min-width: ${({ theme }) =>
      theme.breakpoints.small}px) {
    padding-bottom: 13px;
  }
`;

Contracts.HeaderWhiteBar = styled.span`
  width: 35px;
  height: 2px;
  background-color: ${({ theme }) => theme.colors.white};
  position: absolute;
  left: 0;
  bottom: 0;
`;

Contracts.HeaderGreenBar = styled.span`
  width: 15px;
  height: 2px;
  background-color: ${({ theme }) => theme.colors.green};
  position: absolute;
  right: 0;
  bottom: 0;
`;

Contracts.Body = styled(Contracts.Row)`
  flex-direction: column;
  align-items: end;
  padding-top: 10px;

  @media (max-width: ${({ theme }) => theme.breakpoints.small}px) {
    align-items: center;
  }
`;
