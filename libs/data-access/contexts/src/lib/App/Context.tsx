import { useEffect, useState } from 'react';

import { AxiosRequestConfig } from 'axios';
import { decode } from 'jsonwebtoken';

import {
  fetcher as ApiFetcher,
  GymApi,
  TokenApi,
  UserApi
} from '@hubbl/data-access/api';
import { ClientDTO, OwnerDTO, WorkerDTO } from '@hubbl/shared/models/dto';
import { Gym } from '@hubbl/shared/models/entities';
import { ParsedToken } from '@hubbl/shared/types';

import { useToastContext } from '../Toast';
import {
  AppContextValue,
  GymUpdatableFields,
  LogInType,
  SignUpType,
  UserType,
  UserUpdatableFields
} from './types';

const useAppContextValue = (): AppContextValue => {
  const { onError } = useToastContext();

  // User token to be sent on each request
  const [token, setToken] = useState<string | null>(null);

  // Parsed value of the revieved token
  const [parsedToken, setParsedToken] = useState<ParsedToken | null>(null);

  // Current active user
  const [user, setUser] = useState<UserType | null>(null);

  // Loading state of the application on user/gym calls
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
   * Updates the current gym information
   */
  const gymUpdater = async (data: GymUpdatableFields): Promise<void> => {
    if (!parsedToken || !user) {
      return;
    }

    setLoading(true);

    const prevUser = { ...user };
    try {
      setUser({ ...user, gym: { ...user.gym, ...data } });
      await GymApi.update({ ...user.gym, ...data }, getAuthorizationConfig());
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
    token: { value: token, parsed: parsedToken },
    user,
    API: {
      loading,
      signup,
      login,
      fetcher,
      user: { update: userUpdater },
      gym: { update: gymUpdater }
    }
  };
};

export { useAppContextValue };
