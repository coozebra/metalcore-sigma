import * as Yup from 'yup';

const errorMessage = {
  terms: 'Terms of service must be accepted.',
};

export const getMintNFTValidationSchema = ({ max }) => {
  const validation = {
    // count: Yup.number()
    //   .required('Required.')
    //   .min(1, 'Must purchase at least 1.')
    //   .max(max, `Cannot purchase more than ${max}.`)
    //   .typeError('Must specify a number.'),
    terms: Yup.boolean().required(errorMessage.terms).oneOf([true], errorMessage.terms),
  };

  return Yup.object().shape(validation);
};

export const getBridgeDepositValidationSchema = ({ max }) => {
  const validation = {
    amount: Yup.number()
      .required('Required.')
      .min(0.0001, 'Must specify an amount to deposit.')
      .max(max, `Cannot deposit more than ${max}.`)
      .typeError('Must specify a number.'),
  };

  return Yup.object().shape(validation);
};

export const getBridgeWithdrawValidationSchema = () => {
  const validation = {
    amount: Yup.number()
      .required('Required.')
      .min(0.0001, 'Must specify an amount to deposit.')
      .typeError('Must specify a number.'),
    transactionId: Yup.string()
      .required('Required.')
      .test('matches', 'Not a valid transaction id.', value =>
        value ? Boolean(value.match(/0x[A-Za-z0-9]+$/)) : false,
      ),
  };

  return Yup.object().shape(validation);
};
