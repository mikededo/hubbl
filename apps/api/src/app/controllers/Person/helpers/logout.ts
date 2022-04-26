import { Response } from 'express';

import BaseController from '../../Base';

type LogoutProps = {
  controller: BaseController;
  res: Response;
};

export const logout = async ({
  controller,
  res
}: LogoutProps): Promise<any> => {
  res.clearCookie('__hubbl-refresh__', {
    sameSite: 'none',
    secure: true,
    httpOnly: true,
    path: '/'
  });

  return controller.ok(res);
};
