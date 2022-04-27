import { Request, Response } from 'express';

import BaseController from '../Base';
import { logout } from './helpers';

class IPersonLogOutController extends BaseController {
  protected async run(_: Request, res: Response): Promise<Response> {
    return logout({
      controller: this,
      res
    });
  }
}

const updateInstance = new IPersonLogOutController();

export const PersonLogOutController = updateInstance;
