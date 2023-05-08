import styled, { keyframes } from 'styled-components';

export const Loader = () => {
  return (
    <Loader.Wrapper>
      <Loader.FirstLine />
      <Loader.SecondLine />
      <Loader.ThirdLine />
    </Loader.Wrapper>
  );
};

const loading = keyframes`
  0 {
    transform: translate(0, 0);
  }

  50% {
    transform: translate(0, 15px);
  }

  100% {
    transform: translate(0, 0);
  }
`;

Loader.Wrapper = styled.div`
  width: 50px;
  display: flex;
  justify-content: space-evenly;
`;

Loader.Line = styled.div`
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 10px;
  background-color: ${({ theme }) => theme.colors.green};
`;

Loader.FirstLine = styled(Loader.Line)`
  animation: ${loading} 0.6s 0.1s linear infinite;
`;

Loader.SecondLine = styled(Loader.Line)`
  animation: ${loading} 0.6s 0.2s linear infinite;
`;

Loader.ThirdLine = styled(Loader.Line)`
  animation: ${loading} 0.6s 0.3s linear infinite;
`;
