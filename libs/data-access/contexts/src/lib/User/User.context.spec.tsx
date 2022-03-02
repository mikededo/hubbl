import { act } from 'react-dom/test-utils';

import { TokenApi, UserApi } from '@hubbl/data-access/api';
import { fireEvent, render, screen } from '@testing-library/react';

import { ToastContext } from '../Toast';
import { UserProvider, useUserContext } from './User.context';

jest.mock('@hubbl/data-access/api');

const onApiSuccess = async (method: 'signup' | 'login') => {
  const methodSpy = jest.spyOn(UserApi, method).mockResolvedValue({
    email: 'test@email.com'
  } as any);

  const Component = () => {
    const { user, API } = useUserContext();

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
      <UserProvider>
        <Component />
      </UserProvider>
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
    const { API } = useUserContext();

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
      <ToastContext>
        <UserProvider>
          <Component />
        </UserProvider>
      </ToastContext>
    );
  });
  await act(async () => {
    fireEvent.click(screen.getByText('fetch'));
  });

  expect(methodSpy).toHaveBeenCalled();
  expect(screen.getByText('An error ocurred. Try again.')).toBeInTheDocument();
};

describe('<UserProvider />', () => {
  it('should call validate on mount', async () => {
    const validateSpy = jest.spyOn(TokenApi, 'validate').mockImplementation();

    await act(async () => {
      render(
        <UserProvider>
          <div />
        </UserProvider>
      );
    });

    expect(validateSpy).toHaveBeenCalled();
  });

  it('should set state token to null', async () => {
    const validateSpy = jest.spyOn(TokenApi, 'validate').mockRejectedValue({});

    const Component = () => {
      const { token } = useUserContext();

      return <div>{`${token}`}</div>;
    };

    await act(async () => {
      render(
        <UserProvider>
          <Component />
        </UserProvider>
      );
    });

    expect(validateSpy).toHaveBeenCalled();
    expect(screen.getByText('null')).toBeInTheDocument();
  });

  describe('signup', () => {
    it('should keep the user in the state on signup', async () => {
      await onApiSuccess('signup');
    });

    it('should appear a snackbar on an error', async () => {
      await onApiError('signup');
    });
  });

  describe('login', () => {
    it('should keep the user in the state on login', async () => {
      await onApiSuccess('login');
    });

    it('should appear a snackbar on an error', async () => {
      await onApiError('login');
    });
  });
});
