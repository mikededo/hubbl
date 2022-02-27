import * as jwt from 'jsonwebtoken';

import { ParsedToken } from '@hubbl/shared/types';

import { UnauthApiInstance } from '../Base';
import { AxiosResponse } from 'axios';

const axios = UnauthApiInstance('tokens');

export const validate = async () => {
  const response: AxiosResponse = await axios.post('/validate');

  return jwt.decode(response.data) as ParsedToken;
};
