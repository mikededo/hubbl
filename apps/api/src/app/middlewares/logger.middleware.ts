import { NextFunction, Request, Response } from 'express';
import * as log from 'npmlog';

export const preRequest = (req: Request, _: Response, next: NextFunction) => {
  log.info('Request', `[${req.method} ${req.originalUrl}]`);

  next();
};

export const postRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.on('finish', () => {
    log.info('Request', `[${req.method} ${req.originalUrl}] -> ${res.statusCode}`);
  });

  next();
};
