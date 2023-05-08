import styled from 'styled-components';
import { Text } from 'shared/text';
import { Button } from 'shared/components/Button';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

const INITIAL_VALUE = { email: '' };

const SignupSchema = Yup.object().shape({
  email: Yup.string().email('Please enter a valid email address.'),
});

export const Newsletter = () => {
  return (
    <Newsletter.Wrapper>
      <Newsletter.Text>
        Join our mailing list to keep up with our latest
        <br />
        community results, offers and news.
      </Newsletter.Text>
      <Formik initialValues={INITIAL_VALUE} validationSchema={SignupSchema} onSubmit={() => {}}>
        {({ errors, isSubmitting, isValid }) => (
          <Form>
            <Newsletter.InputWrapper>
              <Newsletter.InputError>{errors?.email}</Newsletter.InputError>
              <Newsletter.Input id="email" name="email" placeholder="Your email address" />
              <Newsletter.Button primary slanted disabled={isSubmitting || !isValid} type="submit">
                <Newsletter.ButtonText>join</Newsletter.ButtonText>
              </Newsletter.Button>
            </Newsletter.InputWrapper>
          </Form>
        )}
      </Formik>
    </Newsletter.Wrapper>
  );
};

Newsletter.Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: end;
  justify-content: end;
  gap: 12px;

  @media (max-width: ${({ theme }) => theme.breakpoints.medium}px) {
    width: 300px;
    align-items: center;
  }
`;

Newsletter.Text = styled.p`
  color: ${({ theme }) => theme.colors.white};
  font-weight: 600;
  font-size: 18px;
  line-height: 29px;
  text-align: right;
  letter-spacing: -0.035em;

  @media (max-width: ${({ theme }) => theme.breakpoints.medium}px) {
    text-align: center;
  }
`;

Newsletter.InputWrapper = styled.div`
  display: flex;
  height: 35px;
  border: 1px solid ${({ theme }) => theme.colors.green};
  background: rgba(0, 255, 197, 0.25);
`;

Newsletter.Input = styled(Field)`
  height: 100%;
  width: 249px;
  font-family: 'Rajdhani';
  font-style: normal;
  font-weight: 700;
  font-size: 15px;
  line-height: 18px;
  letter-spacing: -0.035em;
  padding: 0 10px;
  outline: none;
  border: none;
  color: ${({ theme }) => theme.colors.white};
  background: transparent;

  &::placeholder {
    opacity: 0.8;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.medium}px) {
    width: 200px;
  }
`;

Newsletter.InputError = styled(Text)`
  color: ${({ theme }) => theme.colors.red};
  position: absolute;
  margin: 40px 0;
`;

Newsletter.Button = styled(Button)`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 14px;
  height: 100%;
  transform: skewX(0deg);
  width: 85px;
`;

Newsletter.ButtonText = styled.p`
  font-weight: 700;
  font-size: 16px;
  line-height: 14px;
  letter-spacing: 0.065em;
  padding-top: 4px;
`;
