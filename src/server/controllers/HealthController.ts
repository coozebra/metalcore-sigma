import express, { Request, Response } from 'express';

export class HealthController {
  router: express.Router;

  constructor() {
    this.router = express.Router().get('/', this.index);
  }

  index = async (request: Request, response: Response): Promise<void> => {
    response.status(200).send({
      uptime: process.uptime(),
      message: 'Ok',
      date: new Date(),
    });
  };
}
