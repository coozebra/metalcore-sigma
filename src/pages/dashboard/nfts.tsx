import Head from 'next/head';
import getConfig from 'next/config';

import { Footer } from 'shared/components/Footer';
import { Header } from 'navigation/components/Header';
import { STORAGE } from 'shared/enums/storage';
import { getUserRedirect } from 'dashboard/utils/getUserRedirect';
import { nemesisServerRequest } from 'server/utils/nemesisServerRequest';
import { NFTs } from 'dashboard/components/NFTs/NFTs';
import { parseNemesisNFTs } from 'shared/utils/NFT';

const DashboardNFTs = ({ data }) => {
  return (
    <>
      <Head>
        <title>METALCORE | NFT GALLERY</title>
      </Head>
      <Header />
      <NFTs data={data} />
      <Footer />
    </>
  );
};

export const getServerSideProps = async ({ req }) => {
  const userRedirect = await getUserRedirect({ req, isDev: true });

  if (userRedirect) return userRedirect;

  const { serverRuntimeConfig } = getConfig();

  try {
    const response = await nemesisServerRequest(req, {
      url: `/users/assets/${serverRuntimeConfig.METALCORE_GAME_ID}`,
    });

    return {
      props: { data: parseNemesisNFTs(response?.data?.data) || [] },
    };
  } catch (error: any) {
    return { props: { error: error?.message || 'There was an error. Please try again.' } };
  }
};

export default DashboardNFTs;
