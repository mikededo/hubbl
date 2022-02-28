import * as jwt from 'jsonwebtoken';

import { ParsedToken } from '@hubbl/shared/types';

import { UnauthApiInstance } from '../Base';
import { AxiosResponse } from 'axios';

export const validate = async () => {
  const response: AxiosResponse = await UnauthApiInstance('tokens').post(
    '/validate'
  );

  return jwt.decode(response.data) as ParsedToken;
};
