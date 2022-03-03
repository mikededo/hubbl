import { AxiosResponse } from 'axios';

import { axios } from '../Base';

export const validate = async () => {
  const response: AxiosResponse = await axios.post('/tokens/validate');

  return { user: response.data.user, token: response.data.token };
};
