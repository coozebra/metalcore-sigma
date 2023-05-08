import Bugsnag from '@bugsnag/js';
import express, { Request, Response, NextFunction } from 'express';
import getConfig from 'next/config';

import { nemesisServerRequest } from '../utils/nemesisServerRequest';
import { parseNemesisNFTs } from '../../shared/utils/NFT';

export class UsersController {
  router: express.Router;

  constructor() {
    this.router = express
      .Router()
      .get('/', this.index)
      .get('/nfts', this.nfts)
      .post('/login', this.login)
      .post('/register', this.register)
      .get('/tranfer-signature', this.transferSignature)
      .post('/wallet', this.wallet);
  }

  index = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    const options = {
      url: '/users',
      params: request?.query,
    };

    try {
      const res: any = await nemesisServerRequest(request, options);

      response.status(200).send(res?.data);
    } catch (error: any) {
      Bugsnag.notify(error, event => {
        event.severity = 'error';
        event.context = 'UsersController.index';
        event.addMetadata('custom', options);
      });

      next(error);
    }
  };

  nfts = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
      const { serverRuntimeConfig } = getConfig();

      const res: any = await nemesisServerRequest(request, {
        url: `/users/assets/${serverRuntimeConfig.METALCORE_GAME_ID}`,
      });

      const data = parseNemesisNFTs(res.data.data);

      response.status(200).send(data);
    } catch (error: any) {
      next(error);
    }
  };

  transferSignature = async (
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { action, chainId, assetId } = request?.query;

      const res: any = await nemesisServerRequest(request, {
        url: `/users/assets/${action}`,
        data: {
          data: {
            chainId,
            assetId,
          },
        },
      });

      response.status(200).send(res.data.data);
    } catch (error: any) {
      next(error);
    }
  };

  login = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    const options = {
      url: '/users/login',
      data: request?.body,
      method: 'POST',
    };

    try {
      const res: any = await nemesisServerRequest(request, options);

      response.status(200).send(res?.data);
    } catch (error: any) {
      Bugsnag.notify(error, event => {
        event.severity = 'error';
        event.context = 'UsersController.login';
        event.addMetadata('custom', options);
      });

      next(error);
    }
  };

  register = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    const options = {
      url: '/users/register',
      data: request?.body,
      method: 'POST',
    };

    try {
      const res: any = await nemesisServerRequest(request, options);

      response.status(200).send(res?.data);
    } catch (error: any) {
      Bugsnag.notify(error, event => {
        event.severity = 'error';
        event.context = 'UsersController.register';
        event.addMetadata('custom', options);
      });

      next(error);
    }
  };

  wallet = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    const options = {
      url: '/users/wallet',
      data: request?.body,
      method: 'POST',
    };

    try {
      const res: any = await nemesisServerRequest(request, options);

      response.status(200).send(res?.data);
    } catch (error: any) {
      Bugsnag.notify(error, event => {
        event.severity = 'error';
        event.context = 'UsersController.wallet';
        event.addMetadata('custom', options);
      });

      next(error);
    }
  };
}
