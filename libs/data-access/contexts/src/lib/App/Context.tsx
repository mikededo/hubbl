import { useCallback, useEffect, useState } from 'react';

import { AxiosRequestConfig } from 'axios';
import { decode } from 'jsonwebtoken';

import {
  ClientSignUpResponse,
  fetcher as ApiFetcher,
  GymApi,
  OwnerSignUpResponse,
  poster as ApiPoster,
  putter as ApiPutter,
  TokenApi,
  UserApi
} from '@hubbl/data-access/api';
import {
  ClientDTO,
  EventDTO,
  OwnerDTO,
  WorkerDTO
} from '@hubbl/shared/models/dto';
import { Gym } from '@hubbl/shared/models/entities';
import { EmptyHandler, ParsedToken } from '@hubbl/shared/types';

import { useToastContext } from '../Toast';
import {
  AppContextValue,
  GymUpdatableFields,
  LogInType,
  LogOutType,
  SignUpType,
  UserType,
  UserUpdatableFields
} from './types';

type AppContextProps = {
  onPopLoading: EmptyHandler;
  onPushLoading: EmptyHandler;
};

const useAppContextValue = ({
  onPopLoading,
  onPushLoading
}: AppContextProps): AppContextValue => {
  const { onError } = useToastContext();

  // User token to be sent on each request
  const [token, setToken] = useState<string | null>(null);

  // Parsed value of the revieved token
  const [parsedToken, setParsedToken] = useState<ParsedToken | null>(null);

  // Current active user
  const [user, setUser] = useState<UserType | null>(null);

  // List of today events
  const [todayEvents, setTodayEvents] = useState<EventDTO[]>([]);

  // Loading state of the application on user/gym calls
  const [loading, setLoading] = useState(false);

  const getAuthorizationConfig = useCallback(
    (): AxiosRequestConfig => ({
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true
    }),
    [token]
  );

  const signup: SignUpType = async (type, data, params) => {
    setLoading(true);

    try {
      let owner: OwnerDTO<Gym> | undefined = undefined;
      let client: ClientDTO<Gym> | undefined = undefined;
      let token: string;

      if (type === 'owner') {
        ({ owner, token } = (await UserApi.signup(
          type,
          data,
          params
        )) as OwnerSignUpResponse);
      } else {
        ({ client, token } = (await UserApi.signup(
          type,
          data,
          params
        )) as ClientSignUpResponse);
      }

      setUser((owner ?? client) as UserType);
      setToken(token);
      setParsedToken(decode(token) as ParsedToken);
    } catch (e) {
      onError('An error occurred. Try again.');
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
      onError('An error occurred. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const logout: LogOutType = async () => {
    setLoading(true);

    try {
      await UserApi.logout();
      setUser(null);
      setToken(null);
      setParsedToken(null);
    } catch (e) {
      onError('An error occurred. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetcher = useCallback(
    async (url: string) => {
      onPushLoading();

      return ApiFetcher(url, getAuthorizationConfig())
        .then((res) => {
          onPopLoading();

          return res.data as never;
        })
        .catch((e) => {
          onPopLoading();

          throw e;
        });
    },
    [getAuthorizationConfig, onPopLoading, onPushLoading]
  );

  const poster = async <T,>(url: string, data: unknown) => {
    onPushLoading();

    return ApiPoster<T>(url, data, getAuthorizationConfig())
      .then((res) => {
        onPopLoading();

        return res.data as never;
      })
      .catch((e) => {
        onPopLoading();

        throw e;
      });
  };

  const putter = async <T,>(url: string, data: unknown) => {
    onPushLoading();

    return ApiPutter<T>(url, data, getAuthorizationConfig())
      .then((res) => {
        onPopLoading();

        return res.data as never;
      })
      .catch((e) => {
        onPopLoading();

        throw e;
      });
  };

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
   * Helper that allows the application to update the list of
   * today events on demand
   */
  const validateTodayEvents = useCallback(async () => {
    try {
      setTodayEvents(await fetcher('/calendars/today'));
    } catch (e) {
      onError(`${e}`);
    }
  }, [fetcher, onError]);

  /**
   * Once the context has been loaded, fetch today's events.
   * Today's events are kept in the application context in order to
   * avoid fetching every time a page is accessed
   */
  useEffect(() => {
    if (!user || !token) {
      return;
    }

    validateTodayEvents();
  }, [user, token, validateTodayEvents]);

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
    todayEvents,
    API: {
      loading,
      signup,
      login,
      logout,
      fetcher,
      poster,
      putter,
      user: { update: userUpdater },
      gym: { update: gymUpdater },
      todayEvents: { revalidate: validateTodayEvents }
    }
  };
};

export { useAppContextValue };
