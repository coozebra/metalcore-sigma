import styled, { keyframes } from 'styled-components';

export const Pulse = ({ className }: { className?: string }) => {
  return (
    <div className={className}>
      <Pulse.Circle />
      <Pulse.Button />
    </div>
  );
};

const pulse = keyframes`
  0% {
    transform: scale(1, 1);
  }
  50% {
    opacity: 0.3;
  }
  100% {
    transform: scale(3);
    opacity: 0;
  }
`;

Pulse.Circle = styled.div`
  animation: ${pulse} 2s ease infinite;
  background: ${({ theme }) => theme.colors.green};
  height: 10px;
  border-radius: 100%;
  width: 10px;
  position: absolute;
`;

Pulse.Button = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  border: none;
  background: ${({ theme }) => theme.colors.green};
  background-size: 18px;
  cursor: pointer;
  outline: none;
  width: 10px;
  height: 10px;
  border-radius: 100%;
  opacity: 0.7;
`;
