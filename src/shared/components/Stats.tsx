import { useState, ReactNode } from 'react';
import styled from 'styled-components';
import Image from 'next/image';

import { Link, Text } from 'shared/text';
import { CheckmarkIcon } from 'shared/components/CheckmarkIcon';
import { ErrorIcon } from 'shared/components/ErrorIcon';
import { QuestionmarkIcon } from 'shared/components/QuestiomarkIcon';
import { RadialProgressBar } from 'shared/components/RadialProgressBar';
import { Tooltip } from 'shared/components/Tooltip';
import { SALE_STAT_TYPE, SALE_STAT_STATUS } from 'shared/enums/stats';

interface IStatProps {
  type: string;
  title: string;
  status?: string;
  total?: number;
  current?: number;
}

interface IStatsProps {
  title: string;
  tooltipText?: string | ReactNode;
  stats: Array<IStatProps>;
}

const getStatusIcon = status => {
  switch (status) {
    case SALE_STAT_STATUS.NA:
      return <Stats.Questionmark />;
    case SALE_STAT_STATUS.YES:
      return <Stats.Checkmark />;
    case SALE_STAT_STATUS.NO:
      return <Stats.Error />;
    default:
      return null;
  }
};

const Stat = ({ title, type, status, total = 0, current = 0 }: IStatProps) => {
  switch (type) {
    case SALE_STAT_TYPE.COUNT:
      return (
        <Stat.Body>
          <Stat.Circle />
          <Stat.Title>{title}</Stat.Title>
          <Stat.Value $default>{current}</Stat.Value>
        </Stat.Body>
      );
    case SALE_STAT_TYPE.PROGRESS:
      return (
        <Stat.Body>
          <Stat.Circle>
            <Stats.RadialProgressBar percent={Math.floor((current / total || 0) * 100)} />
          </Stat.Circle>
          <Stat.Title>{title}</Stat.Title>
          <Stat.Value $default>
            {current} / <span>{total}</span>
          </Stat.Value>
        </Stat.Body>
      );
    case SALE_STAT_TYPE.STATUS:
      return (
        <Stat.Body>
          <Stat.Circle>{getStatusIcon(status)}</Stat.Circle>
          <Stat.Title>{title}</Stat.Title>
          <Stat.Value
            $success={status === SALE_STAT_STATUS.YES}
            $default={status === SALE_STAT_STATUS.NA}
          >
            {status}
          </Stat.Value>
        </Stat.Body>
      );
    default:
      return null;
  }
};

export const Stats = ({ title, tooltipText, stats = [] }: IStatsProps) => {
  const [tooltip, setTooltip] = useState('');

  const tooltipId = `stats-tooltip-for-${title}`;

  const handleTooltip = (icon: string) => {
    setTooltip(icon);
  };

  return (
    <Stats.Wrapper>
      <Stats.Header>
        <Stats.HeaderText>
          <Image src="/rectangle.svg" height="34" width="34" alt="" />
          {title}
          {!!tooltipText && (
            <>
              <a
                href="https://support.metalcore.gg/hc/en-us/articles/7646207444635-How-do-I-mint-in-the-Whitelisted-Infantry-Genesis-Mint"
                target="_blank"
                rel="noreferrer"
              >
                <Image
                  src="/icons/faq-icon.png"
                  height="20"
                  width="20"
                  alt="faq"
                  onMouseEnter={() => handleTooltip(tooltipId)}
                />
              </a>
              {tooltip === tooltipId && (
                <Stats.Tooltip onClose={() => handleTooltip('')}>
                  <Stats.TooltipText>{tooltipText}</Stats.TooltipText>
                </Stats.Tooltip>
              )}
            </>
          )}
        </Stats.HeaderText>

        <Stats.HeaderWhiteBar />
        <Stats.HeaderGreenBar />
      </Stats.Header>
      {stats.map(stat => (
        <Stat key={`stat-for-${stat.title} ${title}`} {...stat} />
      ))}
    </Stats.Wrapper>
  );
};

Stats.Row = styled.div`
  display: flex;
  justify-content: space-between;

  @media (max-width: ${({ theme }) => theme.breakpoints.small}px) {
    flex-direction: column;
  }
`;

Stats.Wrapper = styled(Stats.Row)`
  flex-direction: column;

  > span {
    padding-bottom: 10px;
    min-width: 275px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.medium}px) {
    align-items: center;

    > span {
      padding-bottom: 25px;
      min-width: 100%;
    }
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.large}px) and (min-width: ${({ theme }) =>
      theme.breakpoints.small}px) {
    width: 100%;
  }
`;

Stats.Header = styled(Stats.Row)`
  flex-direction: column;
  width: 100%;
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray};
  position: relative;
`;

Stats.HeaderText = styled(Text)`
  display: grid;
  align-items: center;
  grid-auto-flow: column;
  grid-auto-columns: max-content;
  grid-gap: 10px;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.white};
  font-size: 32px;
  margin-bottom: 10px;
`;

Stats.HeaderWhiteBar = styled.span`
  width: 35px;
  height: 2px;
  background-color: ${({ theme }) => theme.colors.white};
  position: absolute;
  left: 0;
  bottom: 0;
`;

Stats.HeaderGreenBar = styled.span`
  width: 15px;
  height: 2px;
  background-color: ${({ theme }) => theme.colors.green};
  position: absolute;
  right: 0;
  bottom: 0;
`;

Stats.Owner = styled(Link)`
  color: ${({ theme }) => theme.colors.green};
  text-decoration: underline;

  :active,
  :hover {
    color: ${({ theme }) => theme.colors.green};
    text-decoration: none;
  }
`;

Stats.RadialProgressBar = styled(RadialProgressBar)`
  transform: scale(0.2);
  position: absolute;
  top: -100px;
  left: -50px;
`;

Stats.Checkmark = styled(CheckmarkIcon)`
  transform: scale(0.4);
  position: absolute;
  top: -12px;
  left: 9px;
`;

Stats.Questionmark = styled(QuestionmarkIcon)`
  transform: scale(0.4);
  position: absolute;
  top: -12px;
  left: 9px;
`;

Stats.Error = styled(ErrorIcon)`
  transform: scale(0.4);
  position: absolute;
  top: -12px;
  left: 9px;
`;

Stats.Tooltip = styled(Tooltip)`
  padding: 0px 20px;
  width: 300px;
  left: 39%;
  height: 100px;
`;

Stats.TooltipText = styled(Text)`
  font-size: 12px;
  text-transform: none;
`;

Stats.ButtonWrapper = styled(Stats.Row)`
  justify-content: start;
  align-items: center;
  padding-left: 30px;

  @media (max-width: ${({ theme }) => theme.breakpoints.small}px) {
    padding-left: 0;
  }
`;

Stats.Link = styled(Link)`
  text-decoration: none;
`;

Stat.Body = styled(Stats.Row)`
  justify-content: start;
  align-items: center;

  @media (max-width: ${({ theme }) => theme.breakpoints.small}px) {
    flex-direction: row;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.large}px) and (min-width: ${({ theme }) =>
      theme.breakpoints.small}px) {
    width: 100%;
    justify-content: center;
  }
`;

Stat.Circle = styled.div`
  width: 80px;
  color: ${({ theme }) => theme.colors.white};
  position: relative;
  height: 80px;
`;

Stat.Title = styled(Text)`
  color: ${({ theme }) => theme.colors.white};
  text-transform: uppercase;
  width: 100px;
  font-size: 16px;
  text-align: center;
`;

Stat.Value = styled(Text)<{ $success?: boolean; $default?: boolean }>`
  color: ${({ $success, theme }) => ($success ? theme.colors.green : theme.colors.red)};
  color: ${({ $default, theme }) => $default && theme.colors.white};
  text-transform: uppercase;
  font-weight: 600;
  width: 100px;
  font-size: 16px;
  text-align: center;

  > span {
    color: ${({ $default, theme }) => $default && theme.colors.gray};
  }
`;
