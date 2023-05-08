import styled from 'styled-components';
import getConfig from 'next/config';

export const ErrorFallback = () => {
  const { publicRuntimeConfig } = getConfig();

  return (
    <ErrorFallback.Wrapper>
      <h3>Looks like something went wrong.</h3>
      <p>
        Please contact{' '}
        <a href={publicRuntimeConfig.ZENDESK_URL} target="_blank" rel="noreferrer">
          support
        </a>
        .
      </p>
    </ErrorFallback.Wrapper>
  );
};

ErrorFallback.Wrapper = styled.div`
  min-height: 100vh;
  padding: 40px 10%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;
