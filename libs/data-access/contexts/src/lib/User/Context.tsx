import { useEffect, useState } from 'react';

import { PartialDeep } from 'type-fest';

import { TokenApi, UserApi } from '@hubbl/data-access/api';
import { OwnerDTO } from '@hubbl/shared/models/dto';
import { Gym } from '@hubbl/shared/models/entities';
import { ParsedToken } from '@hubbl/shared/types';
import { useToastContext } from '../Toast';

type UserType = OwnerDTO<Gym>;

type SignUpType = {
  (type: 'owner', data: PartialDeep<OwnerDTO<Gym>>): void;
};

type LogInType = {
  (type: 'owner', data: { email: string; password: string }): void;
};

export type UserContextValue = {
  token: ParsedToken | null;
  user: UserType | null;
  API: { loading: boolean; signup: SignUpType; login: LogInType };
};

const useUserContextValue = (): UserContextValue => {
  const { onError } = useToastContext();

  const [token, setToken] = useState<ParsedToken | null>(null);
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(false);

  const signup: SignUpType = async (type, data) => {
    setLoading(true);

    try {
      setUser(await UserApi.signup(type, data));
    } catch (e) {
      onError('An error ocurred. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const login: LogInType = async (type, data) => {
    setLoading(true);

    try {
      setUser(await UserApi.login(type, data));
    } catch (e) {
      // Check different errors
      onError('An error ocurred. Try again later.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Load the context on start, in order to check if the user has already signed
   * in
   */
  useEffect(() => {
    (async () => {
      // Check if there was a valid token on the browser
      try {
        setToken(await TokenApi.validate());
      } catch (e) {
        // Token is not valid
        setToken(null);
      }
    })();
  }, []);

  return { token, user, API: { loading, signup, login } };
};

export { useUserContextValue };
