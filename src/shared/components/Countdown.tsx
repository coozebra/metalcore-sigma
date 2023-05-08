import styled from 'styled-components';
import { formatDuration, intervalToDuration } from 'date-fns';
import { useEffect, useState } from 'react';

import { H2, H3, Text } from 'shared/text';

interface ICountdownProps {
  className?: string;
  label?: string;
  scrollToLabel?: string;
  endDate?: string;
  scrollTo?: HTMLDivElement;
}

export const Countdown = ({
  className,
  label,
  scrollToLabel,
  endDate,
  scrollTo,
}: ICountdownProps) => {
  const [countdown, setCountdown] = useState('');

  const handleClick = () => {
    scrollTo?.scrollIntoView({
      block: 'start',
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    if (!endDate) return;

    const getCountdown = () => {
      const start = new Date().getTime();
      const end = new Date(endDate as string).getTime();

      if (start > end) {
        clearInterval(interval);

        return '';
      }

      const duration = intervalToDuration({ start, end });

      return formatDuration(duration, {
        format: ['days', 'hours', 'minutes', 'seconds'],
      });
    };

    const interval = setInterval(() => {
      setCountdown(getCountdown());
    }, 1000);

    setCountdown(getCountdown());

    return () => clearInterval(interval);
  }, []);

  return (
    <Countdown.Wrapper className={className}>
      {label && <Countdown.Title>{label}:</Countdown.Title>}
      {countdown && <Countdown.Countdown>{countdown}</Countdown.Countdown>}
      {scrollToLabel && <Countdown.Text onClick={handleClick}>{scrollToLabel}</Countdown.Text>}
    </Countdown.Wrapper>
  );
};

Countdown.Row = styled.div`
  display: flex;
  justify-content: space-between;

  @media (max-width: ${({ theme }) => theme.breakpoints.small}px) {
    flex-direction: column;
  }
`;

Countdown.Wrapper = styled(Countdown.Row)`
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 30%;

  @media (max-width: ${({ theme }) => theme.breakpoints.large}px) and (min-width: ${({ theme }) =>
      theme.breakpoints.small}px) {
    width: 100%;
    padding-top: 20px;
    order: 3;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.small}px) {
    width: 100%;
  }
`;

Countdown.Title = styled(H3)`
  color: ${({ theme }) => theme.colors.white};

  @media (max-width: ${({ theme }) => theme.breakpoints.medium}px) {
    text-align: center;
  }
`;

Countdown.Countdown = styled(H2)`
  color: ${({ theme }) => theme.colors.white};
  padding-top: 6px;
  font-size: 24px;

  @media (max-width: ${({ theme }) => theme.breakpoints.medium}px) {
    text-align: center;
  }
`;

Countdown.Text = styled(Text)`
  color: ${({ theme }) => theme.colors.green};
  text-transform: uppercase;
  padding-top: 34px;
  text-decoration: underline;
  cursor: pointer;
`;
