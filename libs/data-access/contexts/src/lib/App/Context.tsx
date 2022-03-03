import { useEffect, useState } from 'react';

import { AxiosResponse } from 'axios';
import { PartialDeep } from 'type-fest';

import {
  fetcher as ApiFetcher,
  TokenApi,
  UserApi
} from '@hubbl/data-access/api';
import { OwnerDTO } from '@hubbl/shared/models/dto';
import { Gym } from '@hubbl/shared/models/entities';

import { useToastContext } from '../Toast';

type UserType = OwnerDTO<Gym>;

type SignUpType = {
  (type: 'owner', data: PartialDeep<OwnerDTO<Gym>>): void;
};

type LogInType = {
  (type: 'owner' | 'worker', data: { email: string; password: string }): void;
};

type FetcherType = { (url: string): Promise<AxiosResponse> };

export type UserContextValue = {
  token: string | null;
  user: UserType | null;
  API: {
    loading: boolean;
    signup: SignUpType;
    login: LogInType;
    fetcher: FetcherType;
  };
};

const useAppContextValue = (): UserContextValue => {
  const { onError } = useToastContext();

  const [token, setToken] = useState<string | null>(null);
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
      onError('An error ocurred. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetcher = async (url: string) =>
    ApiFetcher(url, {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true
    });

  /**
   * Load the context on start, in order to check if the user has already signed
   * in
   */
  useEffect(() => {
    (async () => {
      // Check if there was a valid token on the browser
      try {
        const { token, user } = await TokenApi.validate();
        setToken(token);
        setUser(user);
      } catch (e) {
        // Token is not valid
        setUser(null);
        setToken(null);
      }
    })();
  }, []);

  return { token, user, API: { loading, signup, login, fetcher } };
};

export { useAppContextValue };
