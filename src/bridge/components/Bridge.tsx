import { useState } from 'react';
import styled from 'styled-components';

import { H1 } from 'shared/text';
import { BridgeInstructions } from 'bridge/components/BridgeInstructions';
import { BridgeBank } from 'bridge/components/BridgeBank';
import { TABS } from 'bridge/enums/tabs';

export const Bridge = () => {
  const [tab, setTab] = useState(TABS.DEPOSIT);

  const handleChangeTab = tabIndex => {
    setTab(tabIndex);
  };

  return (
    <Bridge.Wrapper>
      <Bridge.HeaderWrapper>
        <Bridge.Header>token bridge</Bridge.Header>
      </Bridge.HeaderWrapper>
      <Bridge.Row>
        <Bridge.InstructionCard>
          <BridgeInstructions tab={tab} />
        </Bridge.InstructionCard>
        <Bridge.BankCard>
          <BridgeBank onSelect={handleChangeTab} tab={tab} />
        </Bridge.BankCard>
      </Bridge.Row>
    </Bridge.Wrapper>
  );
};

Bridge.Wrapper = styled.div`
  min-height: 100vh;
  background-image: url('/metalcore-background-main.png');
  background-size: cover;
  padding: 40px 10%;

  @media (max-width: ${({ theme }) => theme.breakpoints.medium}px) {
    padding: 40px 5%;
  }
`;

Bridge.Row = styled.div`
  display: flex;
  justify-content: space-between;

  @media (max-width: ${({ theme }) => theme.breakpoints.medium}px) {
    flex-direction: column;
  }
`;

Bridge.HeaderWrapper = styled(Bridge.Row)`
  align-items: center;
  justify-content: flex-start;
  border-bottom: 1px solid ${({ theme }) => theme.colors.white};
  padding-bottom: 40px;
`;

Bridge.Header = styled(H1)`
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.white};
`;

Bridge.Card = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 30px;
  width: 50%;

  @media (max-width: ${({ theme }) => theme.breakpoints.medium}px) {
    width: 100%;
    padding: 20px 0 0 0;
  }
`;

Bridge.InstructionCard = styled(Bridge.Card)`
  padding-right: 15px;

  @media (max-width: ${({ theme }) => theme.breakpoints.medium}px) {
    padding-right: 0;
    padding: 20px 0 0 0;
  }
`;

Bridge.BankCard = styled(Bridge.Card)`
  padding-left: 15px;

  @media (max-width: ${({ theme }) => theme.breakpoints.medium}px) {
    padding-left: 0;
  }
`;
