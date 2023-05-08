import Head from 'next/head';
import getConfig from 'next/config';
import Bugsnag from '@bugsnag/js';

import { Footer } from 'shared/components/Footer';
import { Header } from 'navigation/components/Header';
import { STORAGE } from 'shared/enums/storage';
import { nemesisServerRequest } from 'server/utils/nemesisServerRequest';
import { Dashboard } from 'dashboard/components/Dashboard';
import { getUserRedirect } from 'dashboard/utils/getUserRedirect';

const DashboardPage = ({ accessKeys }) => {
  return (
    <>
      <Head>
        <title>METALCORE | DASHBOARD</title>
      </Head>
      <Header />
      <Dashboard accessKeys={accessKeys} />
      <Footer />
    </>
  );
};

export const getServerSideProps = async ({ req }) => {
  const userRedirect = await getUserRedirect({ req });

  if (userRedirect) return userRedirect;

  const { serverRuntimeConfig } = getConfig();

  const claimAccessKeysOptions = {
    url: '/users/access-keys',
    data: { data: { gameId: serverRuntimeConfig.METALCORE_GAME_ID } },
    method: 'PATCH',
  };

  // try claiming access key for user
  try {
    await nemesisServerRequest(req, claimAccessKeysOptions);
  } catch (error: any) {
    Bugsnag.notify(error, event => {
      event.severity = 'error';
      event.context = 'dashboard.getServerSideProps';
      event.addMetadata('custom', claimAccessKeysOptions);
    });
  }

  const accessKeysOptions = {
    url: `/users/access-keys/${serverRuntimeConfig.METALCORE_GAME_ID}`,
  };

  // fetch access keys for metal core
  try {
    const response = await nemesisServerRequest(req, accessKeysOptions);

    return {
      props: { accessKeys: response?.data?.data || [] },
    };
  } catch (error: any) {
    Bugsnag.notify(error, event => {
      event.severity = 'error';
      event.context = 'dashboard.getServerSideProps';
      event.addMetadata('custom', accessKeysOptions);
    });

    return { props: { error: error?.message || 'There was an error. Please try again.' } };
  }
};

export default DashboardPage;
