import styled from 'styled-components';
import { Text } from 'shared/text';
import { useAuth } from 'auth/providers/AuthProvider';

export const WelcomeCard = () => {
  const { user } = useAuth();
  const displayName = user?.displayName;

  return (
    <WelcomeCard.Wrapper>
      <WelcomeCard.TitleOutline src="/dashboard/title-border.png" />
      <WelcomeCard.TextWrapper>
        <WelcomeCard.WelcomeText>welcome</WelcomeCard.WelcomeText>
        {displayName && <WelcomeCard.WelcomeText>{displayName}</WelcomeCard.WelcomeText>}
      </WelcomeCard.TextWrapper>
    </WelcomeCard.Wrapper>
  );
};

WelcomeCard.Wrapper = styled.div`
  position: relative;
  display: grid;
  height: 80px;
  width: calc(100vw - 12px);

  @media (min-width: 424px) {
    width: 400px;
  }
`;

WelcomeCard.TitleOutline = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

WelcomeCard.TextWrapper = styled.div`
  display: grid;
  grid-gap: 2px;
  align-self: center;
  padding-top: 5px;

  @media (min-width: 424px) {
    padding-top: 8px;
  }
`;

WelcomeCard.WelcomeText = styled(Text)`
  color: ${({ theme }) => theme.colors.white};
  text-transform: uppercase;
  text-align: center;
`;
