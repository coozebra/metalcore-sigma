import styled, { css } from 'styled-components';
import { Formik, Form, Field } from 'formik';
import { formatUnits } from '@ethersproject/units';
import { useEffect, useState } from 'react';

import { Button } from 'shared/components/Button';
import { H3, Text } from 'shared/text';
import { useWeb3 } from 'web3/providers/Web3Provider';
import { useBridge } from 'bridge/providers/BridgeProvider';
import { parseBalance } from 'web3/utils';
import { getBridgeDepositValidationSchema } from 'shared/utils/validations';
import { BridgeDepositModal } from 'bridge/components/BridgeDepositModal';
import { GATES } from 'bridge/enums/gates';
import { bridgeActions } from 'bridge/state/bridgeActions';

interface IBridgeDeposit {
  fromNetwork?: string;
  toNetwork?: string;
}

interface IGate {
  chainId?: number;
  contract?: string;
  position?: string;
}

export const BridgeDeposit = ({ fromNetwork, toNetwork }: IBridgeDeposit) => {
  const INITIAL_VALUES = { amount: '' };

  const { chainId } = useWeb3();
  const { balanceOf, bridgeError, burn, displayDepositModal, modal, operators, transfer } =
    useBridge();
  const [gate, setGate] = useState<IGate>({});

  const { data: balance } = balanceOf();

  const handleDeposit = async (values, formikActions) => {
    displayDepositModal();

    if (!gate.contract || !gate.chainId) {
      bridgeError({
        message: 'Gate contract or gate chain id is missing.',
        type: bridgeActions.burnError,
      });

      return;
    }

    switch (gate.position) {
      case GATES.homeGate:
        try {
          await transfer({
            _amount: values.amount,
            targetGateContract: gate.contract,
            sourceChain: chainId!,
            targetChain: gate.chainId,
          });

          formikActions.setSubmitting(false);
        } catch (error: any) {
          bridgeError({
            message: error?.message,
            cause: error?.cause,
            type: bridgeActions.transferError,
          });

          formikActions.setSubmitting(false);
        }
        break;
      case GATES.foreignGate:
        try {
          burn({
            _amount: values.amount,
            sourceChain: chainId!,
            targetChain: gate.chainId,
          });

          formikActions.setSubmitting(false);
        } catch (error: any) {
          bridgeError({
            message: error?.message,
            cause: error?.cause,
            type: bridgeActions.burnError,
          });

          formikActions.setSubmitting(false);
        }
        break;
      default:
        bridgeError({
          message: 'Invalid gate position.',
          type: bridgeActions.burnError,
        });

        formikActions.setSubmitting(false);
        break;
    }
  };

  useEffect(() => {
    const mainOperator = operators?.[0];

    switch (chainId) {
      case mainOperator?.homeGate?.network?.chainId:
        setGate({
          chainId: mainOperator?.homeGate?.network?.chainId,
          contract: mainOperator?.homeGate?.contract as string,
          position: GATES.homeGate,
        });
        break;
      case mainOperator?.foreignGate?.network?.chainId:
        setGate({
          chainId: mainOperator?.foreignGate?.network?.chainId,
          contract: mainOperator?.foreignGate?.contract as string,
          position: GATES.foreignGate,
        });
        break;
      default:
        break;
    }
  }, [chainId, JSON.stringify(operators)]);

  return (
    <BridgeDeposit.Wrapper>
      <BridgeDeposit.InfoWrapper>
        <BridgeDeposit.InfoLabel>from</BridgeDeposit.InfoLabel>
        <BridgeDeposit.InfoValue>{fromNetwork}</BridgeDeposit.InfoValue>
        <BridgeDeposit.InfoLabel>to</BridgeDeposit.InfoLabel>
        <BridgeDeposit.InfoValue>{toNetwork}</BridgeDeposit.InfoValue>
        <BridgeDeposit.InfoLabel>balance</BridgeDeposit.InfoLabel>
        <BridgeDeposit.InfoValue>{parseBalance(balance ?? 0, 18, 2)} mgt</BridgeDeposit.InfoValue>
      </BridgeDeposit.InfoWrapper>
      <Formik
        enableReinitialize
        initialValues={INITIAL_VALUES}
        onSubmit={handleDeposit}
        validationSchema={getBridgeDepositValidationSchema({
          max: parseFloat(formatUnits(balance ?? 0, 18)),
        })}
        validateOnBlur
        validateOnChange={false}
        key="bridge"
      >
        {({ errors, isSubmitting, isValid, dirty }) => (
          <BridgeDeposit.Form>
            <BridgeDeposit.Label htmlFor="amount">amount</BridgeDeposit.Label>
            <BridgeDeposit.Input
              id="amount"
              name="amount"
              autoComplete="off"
              $error={!!errors.amount}
            />
            <BridgeDeposit.ErrorMessage>{errors?.amount}</BridgeDeposit.ErrorMessage>

            <BridgeDeposit.SubmitButton
              {...{
                primary: isValid && dirty,
                secondary: !(isValid && dirty) || isSubmitting,
              }}
              disabled={!(isValid && dirty) || isSubmitting}
              type="submit"
            >
              deposit tokens
            </BridgeDeposit.SubmitButton>
          </BridgeDeposit.Form>
        )}
      </Formik>
      {modal?.isDepositVisible && <BridgeDepositModal toNetwork={toNetwork} />}
    </BridgeDeposit.Wrapper>
  );
};

BridgeDeposit.Wrapper = styled.div`
  padding-top: 24px;

  @media (min-width: ${({ theme }) => theme.breakpoints.large}px) {
    padding-top: 42px;
  }
`;

BridgeDeposit.InfoWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-column-gap: 44px;
  grid-row-gap: 6px;
  width: 100%;
  border-bottom: 1px solid ${({ theme }) => theme.colors.white};
  padding-bottom: 54px;

  @media (min-width: ${({ theme }) => theme.breakpoints.medium}px) {
    grid-template-columns: min-content 1fr;
    grid-row-gap: 6px;
  }
`;

BridgeDeposit.InfoLabel = styled(H3)`
  color: ${({ theme }) => theme.colors.darkGray};
`;

BridgeDeposit.InfoValue = styled(H3)`
  color: ${({ theme }) => theme.colors.lightGray};
`;

BridgeDeposit.Form = styled(Form)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: left;
  padding-top: 24px;
`;

BridgeDeposit.Label = styled.label`
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 0.06em;
  color: ${({ theme }) => theme.colors.white};
  font-size: 14px;
  padding-top: 10px;

  @media (min-width: ${({ theme }) => theme.breakpoints.medium}px) {
    font-size: 18px;
  }
`;

BridgeDeposit.Input = styled(Field)<{ $error: boolean }>`
  height: 50px;
  width: 100%;
  text-align: center;
  border: none;
  outline: none;
  margin-bottom: 10px;
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

BridgeDeposit.ErrorMessage = styled(Text)`
  color: ${({ theme }) => theme.colors.red};
  text-transform: none;
  height: 19px;
`;

BridgeDeposit.SubmitButton = styled(Button)`
  width: 100%;
  margin-top: 10px;
`;
