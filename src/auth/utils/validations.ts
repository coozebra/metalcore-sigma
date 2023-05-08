import * as Yup from 'yup';

const emailSchema = Yup.string().email('Please enter a valid email address.').required('Required.');

export const passwordValidations = {
  length: {
    pattern: /^.{8,32}$/g,
    label: 'between 8 and 32 characters',
  },
  number: {
    pattern: /\W+/g,
    label: 'at least one special symbol, ex: (#<$)&*!',
  },
  upperCase: {
    pattern: /[A-Z]+/g,
    label: 'at least one upper case letter',
  },
};

const isPasswordValid = value =>
  Object.entries(passwordValidations).every(([, { pattern }]) => value && value.match(pattern));

export const registrationSchema = Yup.object().shape({
  displayName: Yup.string()
    .test(
      'isDisplayNameValid',
      'alpha-numeric characters only',
      value => !!(value && /^[a-z0-9]+$/gim.test(value)),
    )
    .required('required')
    .min(3, 'must be at least 3 digits long')
    .max(25, 'must be at most 25 digits long'),
  email: emailSchema,
  password: Yup.string()
    .required('required')
    .min(6, 'must be at least 6 digits long')
    .max(100, 'must be at most 100 digits long')
    .test('isPasswordValid', 'must meet requirements', isPasswordValid),
  passwordConfirmation: Yup.string()
    .required('required')
    .oneOf([Yup.ref('password'), null], "passwords don't match"),
});

export const loginSchema = Yup.object().shape({
  email: emailSchema,
  password: Yup.string().required('Required.'),
});
