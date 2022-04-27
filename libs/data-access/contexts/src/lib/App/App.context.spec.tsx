import * as jwt from 'jsonwebtoken';
import { act } from 'react-dom/test-utils';

import * as Api from '@hubbl/data-access/api';
import { GymApi, TokenApi, UserApi } from '@hubbl/data-access/api';
import { fireEvent, render, screen } from '@testing-library/react';

import { LoadingContext, useLoadingContext } from '../Loading';
import { ToastContext } from '../Toast';
import { AppProvider, useAppContext } from './App.context';

jest.mock('@hubbl/data-access/api');
jest.mock('../Loading', () => {
  const actual = jest.requireActual('../Loading');

  return { ...actual, useLoadingContext: jest.fn() };
});
jest.mock('jsonwebtoken');

const onOwnerApiSuccess = async (method: 'signup' | 'login') => {
  const methodSpy = jest.spyOn(UserApi, method).mockResolvedValue({
    owner: { email: 'test@email.com' }
  } as any);

  const Component = () => {
    const { user, API } = useAppContext();

    return (
      <>
        {user && <p>{user?.email}</p>}
        <button
          onClick={() => {
            API[method]('owner', {} as any);
          }}
        >
          fetch
        </button>
      </>
    );
  };

  await act(async () => {
    render(
      <AppProvider>
        <Component />
      </AppProvider>
    );
  });
  await act(async () => {
    fireEvent.click(screen.getByText('fetch'));
  });

  expect(methodSpy).toHaveBeenCalled();
  expect(screen.getByText('test@email.com')).toBeDefined();
};

const onClientApiSuccess = async (method: 'signup') => {
  const methodSpy = jest.spyOn(UserApi, method).mockResolvedValue({
    client: { email: 'test@email.com' }
  } as any);

  const Component = () => {
    const { user, API } = useAppContext();

    return (
      <>
        {user && <p>{user?.email}</p>}
        <button
          onClick={() => {
            API[method]('client', {} as any);
          }}
        >
          fetch
        </button>
      </>
    );
  };

  await act(async () => {
    render(
      <AppProvider>
        <Component />
      </AppProvider>
    );
  });
  await act(async () => {
    fireEvent.click(screen.getByText('fetch'));
  });

  expect(methodSpy).toHaveBeenCalled();
  expect(screen.getByText('test@email.com')).toBeDefined();
};

const onApiError = async (method: 'signup' | 'login') => {
  const methodSpy = jest.spyOn(UserApi, method).mockRejectedValue({});

  const Component = () => {
    const { API } = useAppContext();

    return (
      <button
        onClick={() => {
          API[method]('owner', {} as any);
        }}
      >
        fetch
      </button>
    );
  };

  await act(async () => {
    render(
      <LoadingContext>
        <ToastContext>
          <AppProvider>
            <Component />
          </AppProvider>
        </ToastContext>
      </LoadingContext>
    );
  });
  await act(async () => {
    fireEvent.click(screen.getByText('fetch'));
  });

  expect(methodSpy).toHaveBeenCalled();
  expect(screen.getByText('An error occurred. Try again.')).toBeInTheDocument();
};

describe('<AppProvider />', () => {
  const pop = jest.fn();
  const push = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (useLoadingContext as jest.Mock).mockReturnValue({
      onPushLoading: push,
      onPopLoading: pop
    } as any);
  });

  it('should initialise on mount', async () => {
    const decodeSpy = jest.spyOn(jwt, 'decode');
    const validateSpy = jest.spyOn(TokenApi, 'validate').mockResolvedValue({
      token: 'Token',
      user: { id: 1 }
    });
    const fetcherSpy = jest.spyOn(Api, 'fetcher').mockResolvedValue([] as any);

    await act(async () => {
      render(
        <AppProvider>
          <div />
        </AppProvider>
      );
    });

    expect(validateSpy).toHaveBeenCalled();
    expect(fetcherSpy).toHaveBeenCalledTimes(1);
    // Should be an authorized call
    expect(fetcherSpy).toHaveBeenCalledWith('/calendars/today', {
      headers: { Authorization: 'Bearer Token' },
      withCredentials: true
    });
    expect(decodeSpy).toHaveBeenCalledTimes(1);
    expect(decodeSpy).toHaveBeenCalledWith('Token');
  });

  it('should call onError if fetching today events fails', async () => {
    const decodeSpy = jest.spyOn(jwt, 'decode');
    const validateSpy = jest.spyOn(TokenApi, 'validate').mockResolvedValue({
      token: 'Token',
      user: { id: 1 }
    });
    const fetcherSpy = jest
      .spyOn(Api, 'fetcher')
      .mockRejectedValue('Error message');

    await act(async () => {
      render(
        <ToastContext>
          <AppProvider>
            <div />
          </AppProvider>
        </ToastContext>
      );
    });

    expect(validateSpy).toHaveBeenCalled();
    expect(fetcherSpy).toHaveBeenCalledTimes(1);
    expect(decodeSpy).toHaveBeenCalledTimes(1);
    expect(decodeSpy).toHaveBeenCalledWith('Token');
    expect(await screen.findByText('Error message')).toBeInTheDocument();
  });

  it('should set state token to null', async () => {
    const validateSpy = jest.spyOn(TokenApi, 'validate').mockRejectedValue({});

    const Component = () => {
      const { token } = useAppContext();

      return <div>{`${token?.value}`}</div>;
    };

    await act(async () => {
      render(
        <AppProvider>
          <Component />
        </AppProvider>
      );
    });

    expect(validateSpy).toHaveBeenCalled();
    expect(screen.getByText('null')).toBeInTheDocument();
  });

  describe('signup', () => {
    it('[owner] should keep the user in the state on signup', async () => {
      await onOwnerApiSuccess('signup');
    });

    it('[client] should keep the user in the state on signup', async () => {
      await onClientApiSuccess('signup');
    });

    it('should appear a snackbar on an error', async () => {
      await onApiError('signup');
    });
  });

  describe('login', () => {
    it('should keep the user in the state on login', async () => {
      await onOwnerApiSuccess('login');
    });

    it('should appear a snackbar on an error', async () => {
      await onApiError('login');
    });
  });

  describe('logout', () => {
    it('should logout the user', async () => {
      jest.spyOn(jwt, 'decode');
      jest.spyOn(TokenApi, 'validate').mockResolvedValueOnce({
        token: 'Token',
        user: { id: 1, email: 'user@email.com' }
      });
      jest.spyOn(Api, 'fetcher').mockResolvedValueOnce([] as any);
      jest.spyOn(UserApi, 'logout').mockResolvedValueOnce({} as never);

      const Component = () => {
        const { user, API } = useAppContext();

        return (
          <>
            {user && <p>{user?.email}</p>}
            <button
              onClick={() => {
                API.logout();
              }}
            >
              logout
            </button>
          </>
        );
      };

      await act(async () => {
        render(
          <AppProvider>
            <Component />
          </AppProvider>
        );
      });

      expect(screen.getByText('user@email.com')).toBeDefined();

      await act(async () => {
        fireEvent.click(screen.getByText('logout'));
      });

      expect(screen.queryByText('user@email.com')).not.toBeInTheDocument();
    });
  });

  describe('fetcher', () => {
    it('should be defined', async () => {
      const fetcherSpy = jest
        .spyOn(Api, 'fetcher')
        .mockResolvedValue({} as any);

      const Component = () => {
        const { API } = useAppContext();

        return <button onClick={() => API.fetcher('/url')}>fetch</button>;
      };

      await act(async () => {
        render(
          <ToastContext>
            <AppProvider>
              <Component />
            </AppProvider>
          </ToastContext>
        );
      });
      await act(async () => {
        fireEvent.click(screen.getByText('fetch'));
      });

      expect(push).toHaveBeenCalledTimes(1);
      expect(pop).toHaveBeenCalledTimes(1);
      expect(fetcherSpy).toHaveBeenCalledTimes(1);
      expect(fetcherSpy).toHaveBeenCalledWith('/url', {
        // Use null as token is not defined
        headers: { Authorization: 'Bearer null' },
        withCredentials: true
      });
    });

    it('should throw the error', async () => {
      const fetcherSpy = jest
        .spyOn(Api, 'fetcher')
        .mockRejectedValue('Error thrown');

      const Component = () => {
        const { API } = useAppContext();

        const handleOnClick = async () => {
          try {
            await API.fetcher('/url');
          } catch (e) {
            expect(e).toBeDefined();
          }
        };

        return <button onClick={handleOnClick}>fetch</button>;
      };

      await act(async () => {
        render(
          <ToastContext>
            <AppProvider>
              <Component />
            </AppProvider>
          </ToastContext>
        );
      });
      await act(async () => {
        fireEvent.click(screen.getByText('fetch'));
      });

      expect(push).toHaveBeenCalledTimes(1);
      expect(pop).toHaveBeenCalledTimes(1);
      expect(fetcherSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('poster', () => {
    const posterSpy = jest.spyOn(Api, 'poster').mockResolvedValue({} as any);

    it('should be defined', async () => {
      const Component = () => {
        const { API } = useAppContext();

        return (
          <button onClick={() => API.poster('/url', { id: 1 })}>post</button>
        );
      };

      await act(async () => {
        render(
          <ToastContext>
            <AppProvider>
              <Component />
            </AppProvider>
          </ToastContext>
        );
      });
      await act(async () => {
        fireEvent.click(screen.getByText('post'));
      });

      expect(push).toHaveBeenCalledTimes(1);
      expect(pop).toHaveBeenCalledTimes(1);
      expect(posterSpy).toHaveBeenCalledTimes(1);
      expect(posterSpy).toHaveBeenCalledWith(
        '/url',
        { id: 1 },
        {
          // Use null as token is not defined
          headers: { Authorization: 'Bearer null' },
          withCredentials: true
        }
      );
    });

    it('should throw the error', async () => {
      const posterSpy = jest
        .spyOn(Api, 'poster')
        .mockRejectedValue('Error thrown');

      const Component = () => {
        const { API } = useAppContext();

        const handleOnClick = async () => {
          try {
            await API.poster('/url', {});
          } catch (e) {
            expect(e).toBeDefined();
          }
        };

        return <button onClick={handleOnClick}>fetch</button>;
      };

      await act(async () => {
        render(
          <ToastContext>
            <AppProvider>
              <Component />
            </AppProvider>
          </ToastContext>
        );
      });
      await act(async () => {
        fireEvent.click(screen.getByText('fetch'));
      });

      expect(push).toHaveBeenCalledTimes(1);
      expect(pop).toHaveBeenCalledTimes(1);
      expect(posterSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('putter', () => {
    const putterSpy = jest.spyOn(Api, 'putter').mockResolvedValue({} as any);

    it('should be defined', async () => {
      const Component = () => {
        const { API } = useAppContext();

        return (
          <button onClick={() => API.putter('/url', { id: 1 })}>post</button>
        );
      };

      await act(async () => {
        render(
          <ToastContext>
            <AppProvider>
              <Component />
            </AppProvider>
          </ToastContext>
        );
      });
      await act(async () => {
        fireEvent.click(screen.getByText('post'));
      });

      expect(push).toHaveBeenCalledTimes(1);
      expect(pop).toHaveBeenCalledTimes(1);
      expect(putterSpy).toHaveBeenCalledTimes(1);
      expect(putterSpy).toHaveBeenCalledWith(
        '/url',
        { id: 1 },
        {
          // Use null as token is not defined
          headers: { Authorization: 'Bearer null' },
          withCredentials: true
        }
      );
    });

    it('should throw the error', async () => {
      const putterSpy = jest
        .spyOn(Api, 'putter')
        .mockRejectedValue('Error thrown');

      const Component = () => {
        const { API } = useAppContext();

        const handleOnClick = async () => {
          try {
            await API.putter('/url', {});
          } catch (e) {
            expect(e).toBeDefined();
          }
        };

        return <button onClick={handleOnClick}>fetch</button>;
      };

      await act(async () => {
        render(
          <ToastContext>
            <AppProvider>
              <Component />
            </AppProvider>
          </ToastContext>
        );
      });
      await act(async () => {
        fireEvent.click(screen.getByText('fetch'));
      });

      expect(push).toHaveBeenCalledTimes(1);
      expect(pop).toHaveBeenCalledTimes(1);
      expect(putterSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('user', () => {
    describe('updater', () => {
      beforeEach(() => {
        jest.clearAllMocks();

        jest.spyOn(Api, 'fetcher').mockResolvedValue({} as any);
      });

      const updaterSuccess = async (by: 'owner' | 'worker' | 'client') => {
        jest.spyOn(jwt, 'decode').mockReturnValue({ user: by });
        jest.spyOn(TokenApi, 'validate').mockResolvedValue({
          token: 'token',
          user: { id: 1, firstName: 'Name' }
        });
        const updateSpy = jest.spyOn(UserApi[by], 'update').mockResolvedValue();

        const Component = () => {
          const {
            API: { user }
          } = useAppContext();

          return (
            <button
              onClick={() => {
                user.update({ email: 'user@email.com', password: 'password' });
              }}
            >
              fetch
            </button>
          );
        };

        await act(async () => {
          render(
            <ToastContext>
              <AppProvider>
                <Component />
              </AppProvider>
            </ToastContext>
          );
        });
        await act(async () => {
          fireEvent.click(screen.getByText('fetch'));
        });

        expect(updateSpy).toHaveBeenCalledTimes(1);
        expect(updateSpy).toHaveBeenCalledWith(
          {
            id: 1,
            firstName: 'Name',
            email: 'user@email.com',
            password: 'password'
          },
          { headers: { Authorization: 'Bearer token' }, withCredentials: true }
        );
      };

      it('should update an owner', async () => {
        await updaterSuccess('owner');
      });

      it('should update an worker', async () => {
        await updaterSuccess('worker');
      });

      it('should update an client', async () => {
        await updaterSuccess('client');
      });

      it('should call onError on failing', async () => {
        jest.spyOn(jwt, 'decode').mockReturnValue({ user: 'owner' });
        jest.spyOn(TokenApi, 'validate').mockResolvedValue({
          token: 'token',
          user: { id: 1, firstName: 'Name' }
        });
        const updateSpy = jest
          .spyOn(UserApi.owner, 'update')
          .mockRejectedValue('Error message');

        const Component = () => {
          const {
            API: { user }
          } = useAppContext();

          return (
            <button
              onClick={() => {
                user.update({});
              }}
            >
              fetch
            </button>
          );
        };

        await act(async () => {
          render(
            <ToastContext>
              <AppProvider>
                <Component />
              </AppProvider>
            </ToastContext>
          );
        });
        await act(async () => {
          fireEvent.click(screen.getByText('fetch'));
        });

        expect(updateSpy).toHaveBeenCalledTimes(1);
        expect(await screen.findByText('Error message')).toBeInTheDocument();
      });

      it('should not call update if user or token not sets', async () => {
        jest.spyOn(TokenApi, 'validate').mockRejectedValue({});
        const updateSpy = jest.spyOn(UserApi.owner, 'update');

        const Component = () => {
          const {
            API: { user }
          } = useAppContext();

          return (
            <button
              onClick={() => {
                user.update({});
              }}
            >
              fetch
            </button>
          );
        };

        await act(async () => {
          render(
            <ToastContext>
              <AppProvider>
                <Component />
              </AppProvider>
            </ToastContext>
          );
        });
        await act(async () => {
          fireEvent.click(screen.getByText('fetch'));
        });

        expect(updateSpy).not.toHaveBeenCalled();
      });
    });
  });

  describe('gym', () => {
    describe('update', () => {
      beforeEach(() => {
        jest.clearAllMocks();

        jest.spyOn(Api, 'fetcher').mockResolvedValue({} as any);
      });

      it('should update a gym', async () => {
        jest.spyOn(jwt, 'decode').mockReturnValue({ user: 'owner' });
        jest.spyOn(TokenApi, 'validate').mockResolvedValue({
          token: 'token',
          user: {
            id: 1,
            firstName: 'Name',
            gym: { id: 1, name: 'GymName', email: 'gym@info.com' }
          }
        });
        const updateSpy = jest.spyOn(GymApi, 'update').mockResolvedValue();

        const Component = () => {
          const {
            API: { gym }
          } = useAppContext();

          return (
            <button
              onClick={() => {
                gym.update({
                  name: 'UpdatedName',
                  email: 'update@gym.com'
                });
              }}
            >
              fetch
            </button>
          );
        };

        await act(async () => {
          render(
            <ToastContext>
              <AppProvider>
                <Component />
              </AppProvider>
            </ToastContext>
          );
        });
        await act(async () => {
          fireEvent.click(screen.getByText('fetch'));
        });

        expect(updateSpy).toHaveBeenCalledTimes(1);
        expect(updateSpy).toHaveBeenCalledWith(
          { id: 1, name: 'UpdatedName', email: 'update@gym.com' },
          { headers: { Authorization: 'Bearer token' }, withCredentials: true }
        );
      });

      it('should call onError on failing', async () => {
        jest.spyOn(jwt, 'decode').mockReturnValue({ user: 'owner' });
        jest.spyOn(TokenApi, 'validate').mockResolvedValue({
          token: 'token',
          user: {
            id: 1,
            firstName: 'Name',
            gym: { id: 1, name: 'GymName', email: 'gym@info.com' }
          }
        });
        const updateSpy = jest
          .spyOn(GymApi, 'update')
          .mockRejectedValue('Error message');

        const Component = () => {
          const {
            API: { gym }
          } = useAppContext();

          return (
            <button
              onClick={() => {
                gym.update({});
              }}
            >
              fetch
            </button>
          );
        };

        await act(async () => {
          render(
            <ToastContext>
              <AppProvider>
                <Component />
              </AppProvider>
            </ToastContext>
          );
        });
        await act(async () => {
          fireEvent.click(screen.getByText('fetch'));
        });

        expect(updateSpy).toHaveBeenCalledTimes(1);
        expect(screen.getByText('Error message')).toBeInTheDocument();
      });

      it('should not call update if user or token not sets', async () => {
        jest.spyOn(TokenApi, 'validate').mockRejectedValue({});
        const updateSpy = jest.spyOn(GymApi, 'update');

        const Component = () => {
          const {
            API: { gym }
          } = useAppContext();

          return (
            <button
              onClick={() => {
                gym.update({});
              }}
            >
              fetch
            </button>
          );
        };

        await act(async () => {
          render(
            <ToastContext>
              <AppProvider>
                <Component />
              </AppProvider>
            </ToastContext>
          );
        });
        await act(async () => {
          fireEvent.click(screen.getByText('fetch'));
        });

        expect(updateSpy).not.toHaveBeenCalled();
      });
    });
  });
});
