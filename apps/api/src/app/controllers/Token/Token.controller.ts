import { Request, Response } from 'express';
import { sign, verify } from 'jsonwebtoken';

import BaseController from '../Base';
import { ParsedToken } from '../helpers';

class ITokenValidateCookie extends BaseController {
  protected async run(req: Request, res: Response): Promise<Response> {
    // Get the cookie
    const cookie = req.cookies['__hubbl-refresh__'];

    if (!cookie) {
      return this.clientError(res, 'Invalid refresh token.');
    }

    try {
      // Parse the token
      const token = verify(cookie, process.env.NX_JWT_TOKEN) as any;

      // Create a new token
      const newToken = sign(
        { id: token.id, email: token.email, user: token.user } as ParsedToken,
        process.env.NX_JWT_TOKEN
      );
      return this.ok(res, { token: newToken });
    } catch (e) {
      return this.forbidden(res, e);
    }
  }
}

const validateCookieInstance = new ITokenValidateCookie();

export const TokenValidateCookie = validateCookieInstance;

class ITokenRefresh extends BaseController {
  protected async run(req: Request, res: Response): Promise<Response> {
    const oldToken = req.body.token;
    if (!oldToken) {
      return this.clientError(res, 'Old token not provided.');
    }

    try {
      // Parse the token
      const token = verify(oldToken, process.env.NX_JWT_TOKEN);

      const newToken = sign(
        { id: token.id, email: token.email, user: token.user },
        process.env.NX_JWT_TOKEN
      );
      return this.ok(res, { token: newToken });
    } catch (e) {
      return this.forbidden(res, 'Old token is expired.');
    }
  }
}

const tokenRefreshInstance = new ITokenRefresh();

export const TokenRefresh = tokenRefreshInstance;
