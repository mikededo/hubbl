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
  const today = new Date();
  today.setDate(today.getDate() - 1);

  res.clearCookie('__hubbl-refresh__', {
    sameSite: 'none',
    secure: true,
    httpOnly: true,
    path: '/',
    expires: today
  });

  return controller.ok(res);
};
