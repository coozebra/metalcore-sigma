import Head from 'next/head';
import styled from 'styled-components';

import { Header } from 'navigation/components/Header';
import { Footer } from 'shared/components/Footer';
import { Presale } from 'presale/components/Presale';

const PresalePage = () => {
  return (
    <>
      <Head>
        <title>METALCORE | PRESALE</title>
      </Head>
      <Header />
      <Presale />
      <Footer />
    </>
  );
};

export const getServerSideProps = ({ query }) => {
  let isAdmin;

  if (process.env.NODE_ENV === 'production') {
    isAdmin = query.admin === 'true';
  } else {
    isAdmin = true;
  }

  if (isAdmin) {
    return { props: {} };
  }

  return {
    redirect: { destination: '/nfts' },
  };
};

PresalePage.Loader = styled.div`
  min-height: 100vh;
  background-image: url('/metalcore-background-main.png');
  background-size: cover;
`;

export default PresalePage;
