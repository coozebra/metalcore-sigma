import axios from 'axios';
import router from 'next/router';
import { ReactElement, useEffect } from 'react';
import Bugsnag from '@bugsnag/js';

export const GeofenceProvider = ({ children }: { children: ReactElement }) => {
  const verifyGeolocation = async () => {
    try {
      const response = await axios.get('/api/v1/geofence');

      if (!response?.data?.granted) {
        void router.push('/404');
      }
    } catch (error: any) {
      Bugsnag.notify(error, event => {
        event.severity = 'error';
        event.context = 'GeofenceProvider.verifyGeolocation';
      });
    }
  };

  useEffect(() => {
    void verifyGeolocation();
  }, []);

  return children;
};
