import * as jwt from 'jsonwebtoken';

import { ParsedToken } from '@hubbl/shared/types';

import { axios } from '../Base';
import { AxiosResponse } from 'axios';

export const validate = async () => {
  const response: AxiosResponse = await axios.post('/tokens/validate');

  return jwt.decode(response.data) as ParsedToken;
};
