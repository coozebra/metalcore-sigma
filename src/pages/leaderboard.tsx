import Head from 'next/head';
import Bugsnag from '@bugsnag/js';

import { Footer } from 'shared/components/Footer';
import { Header } from 'navigation/components/Header';
import { Leaderboard } from 'leaderboard/components/Leaderboard';
import { IRanking } from 'leaderboard/types/Leaderboard';
import { starsServerRequest } from 'server/utils/starsServerRequest';

const LeaderboardPage = ({ initialData }: { initialData: IRanking[] }) => {
  return (
    <>
      <Head>
        <title>METALCORE | LEADERBOARD</title>
      </Head>
      <Header />
      <Leaderboard initialData={initialData} />
      <Footer />
    </>
  );
};

export const getServerSideProps = async ({ req }) => {
  const options = {
    url: '/leaderboard',
    params: { offset: 0, limit: 50 },
  };

  try {
    const data = await starsServerRequest(req, options);

    return { props: { initialData: data.data } };
  } catch (error: any) {
    Bugsnag.notify(error, event => {
      event.severity = 'error';
      event.context = 'login.getServerSideProps';
      event.addMetadata('custom', options);
    });

    return { props: { initialData: null } };
  }
};

export default LeaderboardPage;
