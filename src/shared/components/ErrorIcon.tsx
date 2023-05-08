import styled, { keyframes } from 'styled-components';

export const ErrorIcon = ({ className }: { className?: string }) => {
  return (
    <ErrorIcon.Wrapper className={className}>
      <ErrorIcon.Icon>
        <ErrorIcon.LineLeft />
        <ErrorIcon.LineRight />
        <ErrorIcon.Circle />
        <ErrorIcon.Fix />
      </ErrorIcon.Icon>
    </ErrorIcon.Wrapper>
  );
};

const rotate = keyframes`
  0% {
    transform: rotate(-45deg);
  }
  5% {
    transform: rotate(-45deg);
  }
  12% {
    transform: rotate(-405deg);
  }
  100% {
    transform: rotate(-405deg);
  }
`;

ErrorIcon.Wrapper = styled.div`
  width: 80px;
  height: 115px;
  margin: 0 auto;
`;

ErrorIcon.Icon = styled.div`
  width: 80px;
  height: 80px;
  position: relative;
  border-radius: 50%;
  box-sizing: content-box;
  border: 4px solid ${({ theme }) => theme.colors.white};

  &::before {
    top: 3px;
    left: -2px;
    width: 30px;
    transform-origin: 100% 50%;
    border-radius: 100px 0 0 100px;
  }

  &::after {
    top: 0;
    left: 30px;
    width: 60px;
    transform-origin: 0 50%;
    border-radius: 0 100px 100px 0;
    animation: ${rotate} 4.25s ease-in;
  }

  &::before,
  &::after {
    content: '';
    height: 100px;
    position: absolute;
    background: ${({ theme }) => theme.colors.black};
    transform: rotate(-45deg);
  }
`;
ErrorIcon.LineLeft = styled.span`
  height: 5px;
  background-color: ${({ theme }) => theme.colors.red};
  display: block;
  border-radius: 0px;
  position: absolute;
  z-index: 10;
  top: 38px;
  left: 15px;
  width: 50px;
  transform: rotate(45deg);
`;

ErrorIcon.LineRight = styled.span`
  height: 5px;
  background-color: ${({ theme }) => theme.colors.red};
  display: block;
  border-radius: 0px;
  position: absolute;
  z-index: 10;
  top: 38px;
  right: 13px;
  width: 53px;
  transform: rotate(-45deg);
`;

ErrorIcon.Circle = styled.div`
  top: -4px;
  left: -4px;
  z-index: 10;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  position: absolute;
  box-sizing: content-box;
  border: 4px solid ${({ theme }) => theme.colors.white};
`;

ErrorIcon.Fix = styled.div`
  top: 8px;
  width: 5px;
  left: 26px;
  z-index: 1;
  height: 85px;
  position: absolute;
  transform: rotate(-45deg);
  background-color: background: ${({ theme }) => theme.colors.black};
`;
