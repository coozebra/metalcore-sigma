import styled, { css } from 'styled-components';

interface IProgressBar {
  className?: string;
  errors: boolean;
  progress: number;
}

export const ProgressBar = ({ className, errors, progress }: IProgressBar) => {
  return (
    <ProgressBar.Wrapper className={className} $progress={progress} $errors={errors}>
      <ProgressBar.Bar $progress={progress} $errors={errors} />
      <ProgressBar.Percentage>{progress}%</ProgressBar.Percentage>
    </ProgressBar.Wrapper>
  );
};

ProgressBar.Wrapper = styled.div<{ $progress: number; $errors: boolean }>`
  color: ${({ theme }) => theme.colors.black};
  align-self: center;
  height: 23px;
  width: 295px;
  position: relative;
  justify-self: center;
  background: ${({ theme }) => theme.colors.darkGray};

  ${({ $progress, $errors, theme }) => {
    const color = $errors ? theme.colors.red : theme.colors.green;

    return css`
      color: ${color};

      ${$progress >= 39 &&
      css`
        color: ${theme.colors.darkGray};
        text-shadow: -1px -1px 0 ${color}, 1px -1px 0 ${color}, -1px 1px 0 ${color},
          1px 1px 0 ${color};
      `}
    `;
  }}
`;

ProgressBar.Bar = styled.div<{ $progress: number; $errors: boolean }>`
  background: ${({ theme, $errors }) => ($errors ? theme.colors.red : theme.colors.green)};
  width: 0;
  width: ${({ $progress }) => $progress}%;
  transition: width 2s ease-out;
  height: 23px;

  ${({ $progress, $errors }) =>
    $progress <= 93 &&
    css`
      &::after {
        content: '';
        position: absolute;
        height: 23px;
        width: 20px;
        transition: left 2s ease-out;
        left: ${$progress}%;
        background: url('/${$errors ? 'progress-errors' : 'progress'}.svg');
      }
    `}
`;

ProgressBar.Percentage = styled.p`
  width: 50px;
  position: absolute;
  top: 1.5px;
  left: calc(50% - 25px);
  text-align: center;
  font-weight: 600;
  font-size: 18px;
  line-height: 21px;
  letter-spacing: 0.06em;
`;
