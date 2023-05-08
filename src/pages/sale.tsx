import Head from 'next/head';

import { Header } from 'navigation/components/Header';
import { Footer } from 'shared/components/Footer';
import { SaleProvider } from 'sale/providers/SaleProvider';
import { Sale } from 'sale/components/Sale';

const SalePage = () => {
  return (
    <>
      <Head>
        <title>METALCORE | SALE</title>
      </Head>
      <Header />
      <SaleProvider>
        <Sale />
      </SaleProvider>
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

export default SalePage;
