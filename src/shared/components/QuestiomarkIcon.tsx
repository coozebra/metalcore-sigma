import styled, { keyframes } from 'styled-components';
import Image from 'next/image';

export const QuestionmarkIcon = ({ className }: { className?: string }) => {
  return (
    <QuestionmarkIcon.Wrapper className={className}>
      <QuestionmarkIcon.Icon>
        <QuestionmarkIcon.ImageWrapper>
          <QuestionmarkIcon.Image
            src="/icons/question-mark-icon.png"
            height="39"
            width="23"
            alt="question mark"
          />
        </QuestionmarkIcon.ImageWrapper>
        <QuestionmarkIcon.Circle />
        <QuestionmarkIcon.Fix />
      </QuestionmarkIcon.Icon>
    </QuestionmarkIcon.Wrapper>
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

QuestionmarkIcon.Wrapper = styled.div`
  width: 80px;
  height: 115px;
  margin: 0 auto;
`;

QuestionmarkIcon.Icon = styled.div`
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

QuestionmarkIcon.Circle = styled.div`
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

QuestionmarkIcon.Fix = styled.div`
  top: 8px;
  width: 5px;
  left: 26px;
  z-index: 1;
  height: 85px;
  position: absolute;
  transform: rotate(-45deg);
  background-color: background: ${({ theme }) => theme.colors.black};
`;

QuestionmarkIcon.ImageWrapper = styled.div`
  position: relative;
  top: 20px;
  left: 28px;
`;

QuestionmarkIcon.Image = styled(Image)`
  z-index: 10;
`;
