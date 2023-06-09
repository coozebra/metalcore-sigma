import styled, { keyframes } from 'styled-components';

export const CheckmarkIcon = ({ className }: { className?: string }) => {
  return (
    <CheckmarkIcon.Wrapper className={className}>
      <CheckmarkIcon.Icon>
        <CheckmarkIcon.LineTip />
        <CheckmarkIcon.LineLong />
        <CheckmarkIcon.Circle />
        <CheckmarkIcon.Fix />
      </CheckmarkIcon.Icon>
    </CheckmarkIcon.Wrapper>
  );
};

const lineTip = keyframes`
  0% {
    width: 0;
    left: 1px;
    top: 19px;
  }
  54% {
    width: 0;
    left: 1px;
    top: 19px;
  }
  70% {
    width: 50px;
    left: -8px;
    top: 37px;
  }
  84% {
    width: 17px;
    left: 21px;
    top: 48px;
  }
  100% {
    width: 25px;
    left: 14px;
    top: 45px;
  }
`;

const lineLong = keyframes`
  0% {
    width: 0;
    right: 46px;
    top: 54px;
  }
  65% {
    width: 0;
    right: 46px;
    top: 54px;
  }
  84% {
    width: 55px;
    right: 0px;
    top: 35px;
  }
  100% {
    width: 47px;
    right: 8px;
    top: 38px;
  }
`;

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

CheckmarkIcon.Wrapper = styled.div`
  width: 80px;
  height: 115px;
  margin: 0 auto;
`;

CheckmarkIcon.Icon = styled.div`
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
CheckmarkIcon.LineTip = styled.span`
  height: 5px;
  background-color: ${({ theme }) => theme.colors.green};
  display: block;
  border-radius: 0px;
  position: absolute;
  z-index: 10;
  top: 46px;
  left: 14px;
  width: 25px;
  transform: rotate(45deg);
  animation: ${lineTip} 0.75s;
`;

CheckmarkIcon.LineLong = styled.span`
  height: 5px;
  background-color: ${({ theme }) => theme.colors.green};
  display: block;
  border-radius: 0px;
  position: absolute;
  z-index: 10;
  top: 38px;
  right: 8px;
  width: 47px;
  transform: rotate(-45deg);
  animation: ${lineLong} 0.75s;
`;

CheckmarkIcon.Circle = styled.div`
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

CheckmarkIcon.Fix = styled.div`
  top: 8px;
  width: 5px;
  left: 26px;
  z-index: 1;
  height: 85px;
  position: absolute;
  transform: rotate(-45deg);
  background-color: background: ${({ theme }) => theme.colors.black};
`;
