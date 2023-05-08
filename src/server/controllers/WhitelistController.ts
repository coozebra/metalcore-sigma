import express, { Request, Response, NextFunction } from 'express';
import Bugsnag from '@bugsnag/js';

import { starsServerRequest } from '../utils/starsServerRequest';

export class WhitelistController {
  router: express.Router;

  constructor() {
    this.router = express.Router().get('/', this.show);
  }

  show = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    const options = {
      url: '/whitelist',
      params: request?.query,
    };

    try {
      const res: any = await starsServerRequest(request, options);

      response.status(200).send(res?.data);
    } catch (error: any) {
      Bugsnag.notify(error, event => {
        event.severity = 'error';
        event.context = 'WhitelistController.show';
        event.addMetadata('custom', options);
      });

      next(error);
    }
  };
}
