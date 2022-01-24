import { NextFunction, Request, Response } from 'express';
import { decode } from 'jsonwebtoken';

const auth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.headers.authorization) {
    return res
      .status(401)
      .send({ message: 'Unauthorized. Token should be provided.' });
  }

  const tokenValues = req.headers.authorization.split(' ');
  if (tokenValues[0] !== 'Bearer') {
    return res
      .status(401)
      .send({ message: 'Unauthorized. Invalid token type.' });
  }
  const token = decode(tokenValues[1]) as any;

  // Check token expiration time
  if (token.exp * 1000 < Date.now()) {
    return res.status(401).send({ message: 'Unauthorized. Token expired.' });
  }

  // Set request locals
  res.locals = { token };

  next();
};

export default auth;
