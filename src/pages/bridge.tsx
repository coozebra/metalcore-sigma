import Head from 'next/head';

import { Footer } from 'shared/components/Footer';
import { Header } from 'navigation/components/Header';
import { BridgeProvider } from 'bridge/providers/BridgeProvider';
import { Bridge } from 'bridge/components/Bridge';

const BridgePage = () => {
  return (
    <>
      <Head>
        <title>METALCORE | BRIDGE</title>
      </Head>
      <Header />
      <BridgeProvider>
        <Bridge />
      </BridgeProvider>
      <Footer />
    </>
  );
};

export default BridgePage;
