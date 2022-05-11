import { Request, Response } from 'express';
import { sign, verify } from 'jsonwebtoken';

import { ClientDTO, OwnerDTO, WorkerDTO } from '@hubbl/shared/models/dto';
import { ParsedToken } from '@hubbl/shared/types';

import { ClientService, OwnerService, WorkerService } from '../../services';
import BaseController from '../Base';

class ITokenValidateCookie extends BaseController {
  private ownerService: OwnerService = undefined;
  private workerService: WorkerService = undefined;
  private clientService: ClientService = undefined;

  protected async run(req: Request, res: Response): Promise<Response> {
    if (!this.ownerService) {
      this.ownerService = new OwnerService();
    }

    if (!this.workerService) {
      this.workerService = new WorkerService();
    }

    if (!this.clientService) {
      this.clientService = new ClientService();
    }

    // Get the cookie
    const cookie = req.cookies['__hubbl-refresh__'];

    if (!cookie) {
      return this.clientError(res, 'Invalid refresh token.');
    }

    try {
      // Parse the token
      const token = verify(cookie, process.env.NX_JWT_TOKEN) as ParsedToken;
      const origin = req.get('origin');
      const clientSite = /client\.hubbl\./.test(origin);
      const coreSite = /core\.hubbl\./.test(origin);

      if (coreSite && token.user !== 'owner' && token.user !== 'worker') {
        return this.forbidden(res, 'Invalid refresh token.');
      }

      if (clientSite && token.user !== 'client') {
        return this.forbidden(res, 'Invalid refresh token.');
      }

      try {
        // Find the user
        const user = await (token.user === 'owner'
          ? this.ownerService
          : token.user === 'worker'
          ? this.workerService
          : this.clientService
        ).findOneBy({ personId: token.id });

        if (!user) {
          return this.forbidden(res, 'User not found.');
        }

        // Create a new token
        const newToken = sign(
          { id: token.id, email: token.email, user: token.user } as ParsedToken,
          process.env.NX_JWT_TOKEN
        );
        return this.ok(res, {
          token: newToken,
          user: (
            (token.user === 'owner'
              ? OwnerDTO
              : token.user === 'worker'
              ? WorkerDTO
              : ClientDTO) as any
          ).fromClass(user)
        });
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
