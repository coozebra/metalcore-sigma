import express, { Request, Response } from 'express';
import getConfig from 'next/config';

export class VersionController {
  router: express.Router;

  constructor() {
    this.router = express.Router().get('/', this.index);
  }

  index = async (request: Request, response: Response): Promise<void> => {
    const { publicRuntimeConfig } = getConfig();

    response.status(200).send({
      version: publicRuntimeConfig.APP_VERSION,
    });
  };
}
