import { AxiosResponse } from 'axios';
import { PartialDeep } from 'type-fest';

import { OwnerDTO } from '@hubbl/shared/models/dto';
import { Gym } from '@hubbl/shared/models/entities';

import { UnauthApiInstance } from '../Base';
import { Gender } from '@hubbl/shared/types';

type SignUpType = {
  (type: 'owner', data: PartialDeep<OwnerDTO<Gym>>): Promise<OwnerDTO<Gym>>;
};

export const signup: SignUpType = async (type, data) => {
  const response: AxiosResponse = await UnauthApiInstance('persons').post(
    `/register/${type}`,
    {
      ...data,
      // Set gender by default
      gender: Gender.OTHER
    }
  );

  return response.data;
};
