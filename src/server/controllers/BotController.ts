import express, { Request, Response, NextFunction } from 'express';
import axios from 'axios';
import getConfig from 'next/config';
import Bugsnag from '@bugsnag/js';

export class BotController {
  router: express.Router;

  constructor() {
    this.router = express.Router().post('/', this.index);
  }

  index = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    const { serverRuntimeConfig } = getConfig();
    const options = {
      params: {
        secret: serverRuntimeConfig.RECAPTCHA_SECRET_KEY,
        response: request?.body?.token,
      },
    };

    try {
      const MIN_SCORE = 0.5;

      const res: any = await axios.post('https://www.google.com/recaptcha/api/siteverify?', null, options);

      response.status(200).send({ verified: res?.data?.score > MIN_SCORE });
    } catch (error: any) {
      Bugsnag.notify(error, event => {
        event.severity = 'error';
        event.context = 'BotController.index';
        event.addMetadata('custom', options);
      });

      next(error);
    }
  };
}
