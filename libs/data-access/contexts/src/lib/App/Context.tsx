import { useEffect, useState } from 'react';
import { decode } from 'jsonwebtoken';

import {
  fetcher as ApiFetcher,
  TokenApi,
  UserApi
} from '@hubbl/data-access/api';

import { useToastContext } from '../Toast';
import {
  LogInType,
  SignUpType,
  AppContextValue,
  UserType,
  UserUpdatableFields
} from './types';
import { ParsedToken } from '@hubbl/shared/types';
import { ClientDTO, OwnerDTO, WorkerDTO } from '@hubbl/shared/models/dto';
import { Gym } from '@hubbl/shared/models/entities';
import { AxiosRequestConfig } from 'axios';

const useAppContextValue = (): AppContextValue => {
  const { onError } = useToastContext();

  const [token, setToken] = useState<string | null>(null);
  const [parsedToken, setParsedToken] = useState<ParsedToken | null>(null);
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(false);

  const getAuthorizationConfig = (): AxiosRequestConfig => ({
    headers: { Authorization: `Bearer ${token}` },
    withCredentials: true
  });

  const signup: SignUpType = async (type, data) => {
    setLoading(true);

    try {
      const { owner, token } = await UserApi.signup(type, data);
      setUser(owner);
      setToken(token);
      setParsedToken(decode(token) as ParsedToken);
    } catch (e) {
      onError('An error ocurred. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const login: LogInType = async (type, data) => {
    setLoading(true);

    try {
      const result = await UserApi.login(type, data);
      setUser(result[type]);
      setToken(token);
      setParsedToken(decode(result.token) as ParsedToken);
    } catch (e) {
      // Check different errors
      onError('An error ocurred. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetcher = async (url: string) =>
    ApiFetcher(url, getAuthorizationConfig());

  /** Updaters **/
  /**
   * Updates the current user information
   */
  const userUpdater = async (data: UserUpdatableFields): Promise<void> => {
    if (!parsedToken || !user) {
      return;
    }

    setLoading(true);

    const prevUser = { ...user };
    try {
      switch (parsedToken.user) {
        case 'owner':
          setUser({ ...user, ...data } as OwnerDTO<Gym>);
          await UserApi.owner.update(
            { ...user, ...data } as OwnerDTO<Gym>,
            getAuthorizationConfig()
          );
          break;
        case 'worker':
          setUser({ ...user, ...data } as WorkerDTO<Gym>);
          await UserApi.worker.update(
            { ...user, ...data } as WorkerDTO<Gym>,
            getAuthorizationConfig()
          );
          break;
        case 'client':
          setUser({ ...user, ...data } as ClientDTO<Gym>);
          await UserApi.client.update(
            { ...user, ...data } as ClientDTO<Gym>,
            getAuthorizationConfig()
          );
          break;
      }
    } catch (e) {
      setUser(prevUser);
      onError(`${e}`);
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
        const { token, user } = await TokenApi.validate();
        setUser(user);
        setToken(token);
        setParsedToken(decode(token) as ParsedToken);
      } catch (e) {
        // Token is not valid
        setUser(null);
        setToken(null);
        setParsedToken(null);
      }
    })();
  }, []);

  return {
    token,
    user,
    API: {
      loading,
      signup,
      login,
      fetcher,
      user: { update: userUpdater }
    }
  };
};

export { useAppContextValue };
