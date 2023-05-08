import Head from 'next/head';
import styled from 'styled-components';

const UnauthorizedPage = () => {
  return (
    <>
      <Head>
        <title>METALCORE | 404</title>
      </Head>
      <UnauthorizedPage.Wrapper>
        <h1>404</h1>
        <UnauthorizedPage.Divider>|</UnauthorizedPage.Divider>
        <h3>This page could not be found.</h3>
      </UnauthorizedPage.Wrapper>
    </>
  );
};

UnauthorizedPage.Wrapper = styled.div`
  display: flex;
  height: 100vh;
  align-items: center;
  justify-content: center;
`;

UnauthorizedPage.Divider = styled.h3`
  padding: 0 15px;
  font-size: 52px;
  font-weight: 100;
`;

export default UnauthorizedPage;
