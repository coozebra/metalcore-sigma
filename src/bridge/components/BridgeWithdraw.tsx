import styled, { css } from 'styled-components';
import { Formik, Form, Field, FormikProps, FormikValues } from 'formik';
import { useEffect, useRef } from 'react';
import { parseEther } from '@ethersproject/units';

import { Button } from 'shared/components/Button';
import { H3, Text } from 'shared/text';
import { useBridge } from 'bridge/providers/BridgeProvider';
import { getBridgeWithdrawValidationSchema } from 'shared/utils/validations';
import { BridgeWithdrawModal } from 'bridge/components/BridgeWithdrawModal';
import { GATES } from 'bridge/enums/gates';
import { getBridgeTxs, getLatestBridgeTx } from 'bridge/utils/bridgeTx';
import { bridgeActions } from 'bridge/state/bridgeActions';
import { parseBalance } from 'web3/utils';

interface IBridgeWithdraw {
  fromNetwork?: string;
  toNetwork?: string;
}

export const BridgeWithdraw = ({ fromNetwork, toNetwork }: IBridgeWithdraw) => {
  const INITIAL_VALUES = { amount: '', transactionId: '' };

  const {
    balanceOf,
    dismissWithdrawModal,
    displayWithdrawModal,
    gate,
    getOperatorsSignatures,
    mint,
    modal,
    operators,
    withdraw,
    bridgeError,
  } = useBridge();

  const { data: balance } = balanceOf();
  const formikRef = useRef<FormikProps<FormikValues>>(null);

  const handleWithdraw = async (values, formikActions) => {
    displayWithdrawModal();

    try {
      if (!gate?.tokenAddresses?.[0] || !gate?.contract) {
        bridgeError({
          message: 'Token address or contract address is missing.',
          type: bridgeActions.withdrawError,
        });

        return;
      }

      const params = {
        tid: values.transactionId,
        tokenValue: parseEther(values.amount).toHexString(),
      };

      const response = await getOperatorsSignatures(params);

      const signatures = response?.splitSignatures;

      if (response?.originalSignatures?.length === operators.length) {
        switch (gate?.position) {
          case GATES.homeGate:
            await withdraw({ ...params, ...signatures! });
            formikActions.setSubmitting(false);
            formikActions.resetForm({
              values: { transactionId: '', amount: '' },
            });
            break;
          case GATES.foreignGate:
            await mint({ ...params, ...signatures! });
            formikActions.setSubmitting(false);
            formikActions.resetForm({
              values: { transactionId: '', amount: '' },
            });
            break;
          default:
            break;
        }
      } else {
        bridgeError({
          message: 'Not enough operator signatures.',
          type: bridgeActions.withdrawError,
        });
        formikActions.setSubmitting(false);
      }
    } catch (error: any) {
      bridgeError({
        message: error?.message,
        cause: error?.cause,
        type: bridgeActions.withdrawError,
      });
      formikActions.setSubmitting(false);
    }
  };

  // NOTE: If existing deposit transactions, autofill form
  useEffect(() => {
    const transactions = getBridgeTxs();

    if (!transactions.length) return;

    const transaction = getLatestBridgeTx(transactions[transactions.length - 1].tid);

    formikRef?.current?.setFieldValue('transactionId', transaction?.tid);
    formikRef?.current?.setFieldValue('amount', transaction?.tokenValue);
  }, []);

  return (
    <BridgeWithdraw.Wrapper>
      <BridgeWithdraw.InfoWrapper>
        <BridgeWithdraw.InfoLabel>from</BridgeWithdraw.InfoLabel>
        <BridgeWithdraw.InfoValue>{fromNetwork}</BridgeWithdraw.InfoValue>
        <BridgeWithdraw.InfoLabel>to</BridgeWithdraw.InfoLabel>
        <BridgeWithdraw.InfoValue>{toNetwork}</BridgeWithdraw.InfoValue>
        <BridgeWithdraw.InfoLabel>balance</BridgeWithdraw.InfoLabel>
        <BridgeWithdraw.InfoValue>{parseBalance(balance ?? 0, 18, 2)} mgt</BridgeWithdraw.InfoValue>
      </BridgeWithdraw.InfoWrapper>
      <Formik
        enableReinitialize
        initialValues={INITIAL_VALUES}
        innerRef={formikRef}
        key="bridge"
        onSubmit={handleWithdraw}
        validateOnBlur
        validateOnChange={false}
        validationSchema={getBridgeWithdrawValidationSchema()}
      >
        {({ errors, isSubmitting, isValid, dirty, touched, resetForm }) => (
          <BridgeWithdraw.Form>
            <BridgeWithdraw.Label htmlFor="transactionId">transaction id</BridgeWithdraw.Label>
            <BridgeWithdraw.Input
              id="transactionId"
              name="transactionId"
              autoComplete="off"
              $error={!!errors.transactionId && touched.transactionId}
            />
            <BridgeWithdraw.ErrorMessage>
              {errors?.transactionId && touched.transactionId && errors?.transactionId}
            </BridgeWithdraw.ErrorMessage>

            <BridgeWithdraw.Label htmlFor="amount">amount</BridgeWithdraw.Label>
            <BridgeWithdraw.Input
              id="amount"
              name="amount"
              autoComplete="off"
              $error={!!errors.amount && touched.amount}
            />
            <BridgeWithdraw.ErrorMessage>
              {errors?.amount && touched.amount && errors?.amount}
            </BridgeWithdraw.ErrorMessage>
            <BridgeWithdraw.ClearButton
              onClick={() => resetForm({ values: { transactionId: '', amount: '' } })}
            >
              clear form
            </BridgeWithdraw.ClearButton>
            <BridgeWithdraw.SubmitButton
              {...{
                primary: isValid && dirty,
                secondary: !(isValid && dirty) || isSubmitting,
              }}
              disabled={!(isValid && dirty) || isSubmitting}
              type="submit"
            >
              withdraw tokens
            </BridgeWithdraw.SubmitButton>
          </BridgeWithdraw.Form>
        )}
      </Formik>
      {modal?.isWithdrawVisible && <BridgeWithdrawModal onClose={dismissWithdrawModal} />}
    </BridgeWithdraw.Wrapper>
  );
};

BridgeWithdraw.Wrapper = styled.div`
  padding-top: 24px;

  @media (min-width: ${({ theme }) => theme.breakpoints.large}px) {
    padding-top: 42px;
  }
`;

BridgeWithdraw.InfoWrapper = styled.div`
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

BridgeWithdraw.InfoLabel = styled(H3)`
  color: ${({ theme }) => theme.colors.darkGray};
`;

BridgeWithdraw.InfoValue = styled(H3)`
  color: ${({ theme }) => theme.colors.lightGray};
`;

BridgeWithdraw.Form = styled(Form)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: left;
  padding-top: 24px;
`;

BridgeWithdraw.Label = styled.label`
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

BridgeWithdraw.Input = styled(Field)<{ $error: boolean }>`
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

BridgeWithdraw.ErrorMessage = styled(Text)`
  color: ${({ theme }) => theme.colors.red};
  text-transform: none;
  height: 19px;
`;

BridgeWithdraw.SubmitButton = styled(Button)`
  width: 100%;
  margin-top: 10px;
`;

BridgeWithdraw.ClearButton = styled(Text)`
  color: ${({ theme }) => theme.colors.green};
  cursor: pointer;
  text-decoration: underline;
  text-transform: uppercase;
  font-size: 12px;
  text-align: right;
`;
