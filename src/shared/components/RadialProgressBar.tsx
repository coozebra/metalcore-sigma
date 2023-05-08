import styled, { keyframes } from 'styled-components';

export const RadialProgressBar = ({
  className,
  percent = 0,
}: {
  className?: string;
  percent: number;
}) => {
  const max = -219.99078369140625;
  const offset = ((100 - percent) / 100) * max;

  return (
    <RadialProgressBar.Progress className={className} x="0" y="0" viewBox="0 0 80 80">
      <RadialProgressBar.Track d="M5,40a35,35 0 1,0 70,0a35,35 0 1,0 -70,0" />
      <RadialProgressBar.Fill d="M5,40a35,35 0 1,0 70,0a35,35 0 1,0 -70,0" offset={offset} />
      <RadialProgressBar.Value x="48%" y="65%">
        {percent}
        <small>%</small>
      </RadialProgressBar.Value>
      <RadialProgressBar.Small x="78%" y="50%">
        %
      </RadialProgressBar.Small>
    </RadialProgressBar.Progress>
  );
};

const draw = (target: number) => keyframes`
  to {
    stroke-dashoffset: ${target};
  }
`;

RadialProgressBar.Progress = styled.svg`
  width: 200px;
  height: 280px;
  user-select: none;
  cursor: default;
`;

RadialProgressBar.Track = styled.path`
  fill: rgba(0, 0, 0, 0);
  stroke-width: 3;
  transform: rotate(90deg) translate(0px, -80px);
  stroke: ${({ theme }) => theme.colors.darkGray};
`;

RadialProgressBar.Fill = styled.path<{ offset: number }>`
  fill: rgba(0, 0, 0, 0);
  stroke-width: 3;
  transform: rotate(90deg) translate(0px, -80px);

  stroke: ${({ theme }) => theme.colors.white};
  stroke-dasharray: 219.99078369140625;
  stroke-dashoffset: -219.99078369140625;
  stroke-linecap: round;

  animation: ${({ offset }) => draw(offset)} 1s linear forwards;
`;

RadialProgressBar.Value = styled.text`
  fill: ${({ theme }) => theme.colors.white};
  text-anchor: middle;
  font-size: 37px;
`;

RadialProgressBar.Small = styled.text`
  fill: ${({ theme }) => theme.colors.white};
  text-anchor: middle;
  font-size: 20px;
`;
