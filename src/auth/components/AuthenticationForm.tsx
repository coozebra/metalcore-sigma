import { useState } from 'react';
import styled, { css } from 'styled-components';
import { useFormik } from 'formik';
import Image from 'next/image';

import { loginSchema, passwordValidations, registrationSchema } from 'auth/utils/validations';
import { useAuth } from 'auth/providers/AuthProvider';
import { A, Text } from 'shared/text';
import { Button } from 'shared/components/Button';
import { Loader } from 'shared/components/Loader';
import { Card } from 'shared/components/Card';

export const AuthenticationForm = () => {
  const { error, register, login, status } = useAuth();

  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [isShowingRequirements, setIsShowingRequirements] = useState<boolean>(false);

  const onSubmit = async ({ displayName, email, password }) => {
    if (isLogin) {
      return await login({ email, password });
    }

    await register({ displayName, email, password });
  };

  const formik = useFormik({
    initialValues: {
      displayName: '',
      email: '',
      passwordConfirmation: '',
      password: '',
    },
    validationSchema: isLogin ? loginSchema : registrationSchema,
    onSubmit,
  });

  return (
    <Card>
      {status.authenticating && (
        <AuthenticationForm.Loader>
          <Loader />
        </AuthenticationForm.Loader>
      )}
      <AuthenticationForm.Form onSubmit={formik.handleSubmit} $disabled={status.authenticating}>
        <AuthenticationForm.Title>
          {isLogin ? 'Login' : 'Create Your Account'}
        </AuthenticationForm.Title>
        <AuthenticationForm.Description>
          {isLogin
            ? 'Login to install the game launcher and play METALCORE.'
            : 'Create an account with us to install the game launcher and play METALCORE.'}
        </AuthenticationForm.Description>
        <AuthenticationForm.InputWrapper>
          <AuthenticationForm.Label htmlFor="email">email:</AuthenticationForm.Label>
          <AuthenticationForm.Input
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            id="email"
            name="email"
            autoComplete="off"
            $error={!!(formik.touched.email && formik.errors.email)}
          />
          <AuthenticationForm.ErrorMessage>
            {formik.touched.email && formik.errors.email && <span>{formik.errors.email}</span>}
          </AuthenticationForm.ErrorMessage>
        </AuthenticationForm.InputWrapper>

        {!isLogin && (
          <AuthenticationForm.InputWrapper>
            <AuthenticationForm.Label htmlFor="displayName">display name:</AuthenticationForm.Label>
            <AuthenticationForm.Input
              value={formik.values.displayName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              id="displayName"
              name="displayName"
              autoComplete="off"
              $error={!!(formik.touched.displayName && formik.errors.displayName)}
            />
            <AuthenticationForm.ErrorMessage>
              {formik.touched.displayName && formik.errors.displayName && (
                <span>{formik.errors.displayName}</span>
              )}
            </AuthenticationForm.ErrorMessage>
          </AuthenticationForm.InputWrapper>
        )}

        <AuthenticationForm.InputWrapper>
          {isShowingRequirements && !isLogin && (
            <AuthenticationForm.Requirements>
              {Object.entries(passwordValidations).map(([, { pattern, label }]) => (
                <AuthenticationForm.Requirement key={`${label}-requirement`}>
                  <Image
                    alt="verification"
                    width="25"
                    height="25"
                    src={
                      formik.values.password && formik.values.password?.match(pattern)
                        ? '/rectangle.svg'
                        : '/rejected.svg'
                    }
                  />
                  <p>{label}</p>
                </AuthenticationForm.Requirement>
              ))}
            </AuthenticationForm.Requirements>
          )}

          <AuthenticationForm.Label htmlFor="password">password:</AuthenticationForm.Label>
          <AuthenticationForm.Input
            value={formik.values.password}
            onChange={formik.handleChange}
            onFocus={() => setIsShowingRequirements(true)}
            onBlur={e => {
              formik.handleBlur(e);
              setIsShowingRequirements(false);
            }}
            id="password"
            name="password"
            autoComplete="off"
            type="password"
            $error={!!(formik.touched.password && formik.errors.password)}
          />
          <AuthenticationForm.ErrorMessage>
            {formik.touched.password && formik.errors.password && (
              <span>{formik.errors.password}</span>
            )}
          </AuthenticationForm.ErrorMessage>
        </AuthenticationForm.InputWrapper>

        {!isLogin && (
          <AuthenticationForm.InputWrapper>
            <AuthenticationForm.Label htmlFor="passwordConfirmation">
              retype your password:
            </AuthenticationForm.Label>
            <AuthenticationForm.Input
              value={formik.values.passwordConfirmation}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              id="passwordConfirmation"
              name="passwordConfirmation"
              autoComplete="off"
              type="password"
              $error={!!(formik.touched.passwordConfirmation && formik.errors.passwordConfirmation)}
            />
            <AuthenticationForm.ErrorMessage>
              {formik.touched.passwordConfirmation && formik.errors.passwordConfirmation && (
                <span>{formik.errors.passwordConfirmation}</span>
              )}
            </AuthenticationForm.ErrorMessage>
          </AuthenticationForm.InputWrapper>
        )}

        <AuthenticationForm.SubmitButtonWrapper>
          {error && (
            <AuthenticationForm.FormError>
              <span>{error?.message}</span>
            </AuthenticationForm.FormError>
          )}
          <AuthenticationForm.SubmitButton
            primary={formik.isValid || !formik.isSubmitting}
            slanted
            disabled={!formik.isValid || status.authenticating}
            type="submit"
          >
            <Image alt="target" src="/target-icon.png" width="30" height="30" />
            <p>{isLogin ? 'LOGIN' : 'REGISTER'}</p>
          </AuthenticationForm.SubmitButton>
        </AuthenticationForm.SubmitButtonWrapper>
        <AuthenticationForm.Actions>
          <AuthenticationForm.Link onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? 'REGISTER' : 'LOGIN'}
          </AuthenticationForm.Link>
        </AuthenticationForm.Actions>
      </AuthenticationForm.Form>
    </Card>
  );
};

AuthenticationForm.Loader = styled.div`
  position: absolute;
  left: calc(50% - 25px);
  top: calc(50% - 5px);
`;

AuthenticationForm.FormBackground = styled.div`
  background-color: ${({ theme }) => theme.colors.darkGreen};
  position: absolute;
  mix-blend-mode: overlay;
  opacity: 0.7;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  z-index: -1;
`;

AuthenticationForm.Form = styled.form<{ $disabled: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  gap: 15px;
  padding: 24px 12px;
  height: 100%;

  ${({ $disabled }) =>
    $disabled &&
    css`
      opacity: 0.75;
      pointer-events: none;
      user-select: none;
    `}

  @media (min-width: ${({ theme }) => theme.breakpoints.small}px) {
    gap: 20px;
    width: 100%;
    padding: 32px 72px;
  }
`;

AuthenticationForm.Title = styled.h3`
  font-family: 'Rajdhani';
  color: ${({ theme }) => theme.colors.white};
  font-weight: 700;
  font-size: 30px;
  text-align: center;
`;

AuthenticationForm.Description = styled.p`
  font-family: 'Rajdhani';
  color: ${({ theme }) => theme.colors.white};
  font-weight: 600;
  padding: 0 12px;
  text-align: center;
  font-size: 14px;
  margin-bottom: 42px;
`;

AuthenticationForm.InputWrapper = styled.div`
  position: relative;
  display: grid;
  width: 100%;
  grid-auto-rows: 28px 48px 28px;
  grid-gap: 3px;
`;

AuthenticationForm.Label = styled.label`
  font-size: 18px;
  line-height: 22px;
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 0.085em;
  color: #ffffff;

  @media (min-width: ${({ theme }) => theme.breakpoints.small}px) {
    font-size: 22px;
    line-height: 26px;
  }
`;

AuthenticationForm.Input = styled.input<{ $error: boolean }>`
  height: 38px;
  width: 100%;
  font-size: 18px;
  line-height: 22px;
  font-family: 'Rajdhani';
  font-weight: 600;
  letter-spacing: 0.085em;
  padding: 10px;
  border: 1px solid ${({ theme }) => theme.colors.gray};
  background: ${({ theme }) => theme.colors.black};
  color: white;
  outline: none;
  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    opacity: 1;
  }

  &:focus {
    border: 1px solid ${({ theme }) => theme.colors.green};
    box-shadow: inset 0px 1px 10px ${({ theme }) => theme.colors.green};
  }

  ${({ $error }) =>
    $error &&
    css`
      border: 2px solid ${({ theme }) => theme.colors.red};
    `}

  @media (min-width: ${({ theme }) => theme.breakpoints.small}px) {
    height: 48px;
    font-size: 22px;
    line-height: 26px;
  }
`;

AuthenticationForm.Requirements = styled.div`
  position: absolute;
  width: 300px;
  right: calc(50% - 150px);
  top: 96px;
  z-index: 2;
  background-color: ${({ theme }) => theme.colors.darkGreen};
  border: 3px solid ${({ theme }) => theme.colors.white};
  display: grid;
  grid-auto-rows: 25px;
  gap: 12px;
  padding: 4px 0;
  padding-left: 4px;

  @media (min-width: ${({ theme }) => theme.breakpoints.large}px) {
    top: 30px;
    right: -324px;
  }
`;

AuthenticationForm.Requirement = styled.div`
  display: grid;
  grid-template-columns: 12px max-content;
  gap: 6px;

  p {
    color: ${({ theme }) => theme.colors.green};
    line-height: 23px;
  }
`;

AuthenticationForm.Link = styled(A)`
  color: ${({ theme }) => theme.colors.green};
  font-family: 'Rajdhani';
  font-weight: 600;
  font-size: 14px;
  line-height: 18px;
  letter-spacing: 0.065em;
  text-decoration-line: underline;
  text-shadow: 0px 4px 8px rgba(0, 0, 0, 0.75);
  text-transform: none;

  &:hover {
    text-decoration: none;
  }
`;

AuthenticationForm.Actions = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`;

AuthenticationForm.ErrorMessage = styled(Text)`
  position: absolute;
  bottom: -20px;
  color: ${({ theme }) => theme.colors.red};
  text-transform: none;
`;

AuthenticationForm.FormError = styled(AuthenticationForm.ErrorMessage)`
  position: initial;
  text-align: center;
`;

AuthenticationForm.SubmitButton = styled(Button)`
  height: 40px;
  width: 250px;
  font-size: 17px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  justify-items: center;
  font-weight: 700;
  line-height: 21px;
  letter-spacing: 0.03em;
  padding: 0;
  grid-row: 2;

  @media (min-width: ${({ theme }) => theme.breakpoints.small}px) {
    grid-template-columns: repeat(3, 1fr);
    height: 50px;
    width: 378px;
    font-size: 22px;
  }
`;

AuthenticationForm.SubmitButtonWrapper = styled.div`
  width: 280px;
  display: grid;
  justify-items: center;
  align-items: center;
  position: relative;
  margin-top: 12px;
  grid-gap: 6px;
  align-items: start;
  grid-template-rows: 30px 50px;

  @media (min-width: ${({ theme }) => theme.breakpoints.small}px) {
    width: 100%;
  }
`;
