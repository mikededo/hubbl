import { Request, Response } from 'express';
import { sign, verify } from 'jsonwebtoken';

import { ParsedToken } from '@hubbl/shared/types';

import BaseController from '../Base';
import { ClientService, OwnerService, WorkerService } from '../../services';
import { getRepository } from 'typeorm';

class ITokenValidateCookie extends BaseController {
  private ownerService: OwnerService = undefined;
  private workerService: WorkerService = undefined;
  private clientService: ClientService = undefined;

  protected async run(req: Request, res: Response): Promise<Response> {
    if (!this.ownerService) {
      this.ownerService = new OwnerService(getRepository);
    }

    if (!this.workerService) {
      this.workerService = new WorkerService(getRepository);
    }

    if (!this.clientService) {
      this.clientService = new ClientService(getRepository);
    }

    // Get the cookie
    const cookie = req.cookies['__hubbl-refresh__'];

    if (!cookie) {
      return this.clientError(res, 'Invalid refresh token.');
    }

    try {
      // Parse the token
      const token = verify(cookie, process.env.NX_JWT_TOKEN) as ParsedToken;

      try {
        // Find the user
        const user = await (token.user === 'owner'
          ? this.ownerService
          : token.user === 'worker'
          ? this.workerService
          : this.clientService
        ).findOne({ id: token.id });

        if (!user) {
          return this.forbidden(res, 'User not found.');
        }

        // Create a new token
        const newToken = sign(
          { id: token.id, email: token.email, user: token.user } as ParsedToken,
          process.env.NX_JWT_TOKEN
        );
        return this.ok(res, { token: newToken, user });
      } catch (e) {
        return this.onFail(res, e, 'update');
      }
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
      const token = verify(oldToken, process.env.NX_JWT_TOKEN) as any;

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
