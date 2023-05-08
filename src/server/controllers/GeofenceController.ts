import express, { Response, NextFunction } from 'express';
import geoip from 'geoip-lite';
import Bugsnag from '@bugsnag/js';

import { BLACKLIST_COUNTRIES } from '../enums/countries';

export class GeofenceController {
  router: express.Router;

  constructor() {
    this.router = express.Router().get('/', this.index);
  }

  index = async (request, response: Response, next: NextFunction): Promise<void> => {
    try {
      const geo = geoip.lookup(request?.clientIp);

      response.status(200).send({ granted: !BLACKLIST_COUNTRIES.includes(geo?.country), geo });
    } catch (error: any) {
      Bugsnag.notify(error, event => {
        event.severity = 'error';
        event.context = 'BotController.index';
        event.addMetadata('custom', { clientIp: request?.clientIp });
      });

      next(error);
    }
  };
}
