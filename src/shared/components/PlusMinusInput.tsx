import styled, { css } from 'styled-components';
import Image from 'next/image';
import { Field } from 'formik';

import { Button } from 'shared/components/Button';

interface IProps {
  value: number;
  decrease: () => void;
  increase: () => void;
  name: string;
  hasError: boolean;
  max: number;
  min?: number;
}

export const PlusMinusInput = ({
  value,
  decrease,
  increase,
  name,
  hasError,
  max,
  min = 1,
  ...rest
}: IProps) => {
  return (
    <PlusMinusInput.InputWrapper>
      <PlusMinusInput.InputButton onClick={decrease} disabled={value <= min} ghost>
        <Image alt="" src="/minus.svg" width="30" height="30" />
      </PlusMinusInput.InputButton>
      <PlusMinusInput.Input id={name} name={name} autoComplete="off" $error={hasError} {...rest} />
      <PlusMinusInput.InputButton ghost onClick={increase} disabled={value >= max}>
        <Image alt="" src="/plus.svg" width="30" height="30" />
      </PlusMinusInput.InputButton>
    </PlusMinusInput.InputWrapper>
  );
};

PlusMinusInput.InputWrapper = styled.div`
  display: grid;
  grid-template-columns: 30px max-content 30px;
  gap: 24px;
  align-items: center;
`;

PlusMinusInput.InputButton = styled(Button)`
  margin: 0;
  border: 0;
  padding: 0;

  &:disabled {
    opacity: 0.5;
  }
`;

PlusMinusInput.Input = styled(Field)<{ $error: boolean }>`
  height: 31px;
  width: 100px;
  text-align: center;
  border: none;
  outline: none;
  background-color: ${({ theme }) => theme.colors.darkGray};
  border: 0.844203px solid ${({ theme }) => theme.colors.green};
  color: ${({ theme }) => theme.colors.green};
  font-family: 'rajdhani';
  font-style: normal;
  font-weight: 600;
  font-size: 22px;

  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    opacity: 1;
  }

  ${({ $error }) =>
    $error &&
    css`
      border: 2px solid ${({ theme }) => theme.colors.red};
    `}
`;
