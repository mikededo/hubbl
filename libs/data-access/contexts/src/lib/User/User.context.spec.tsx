import { act } from 'react-dom/test-utils';

import { TokenApi, UserApi } from '@hubbl/data-access/api';
import { fireEvent, render, screen } from '@testing-library/react';

import { ToastContext } from '../Toast';
import { UserProvider, useUserContext } from './User.context';

jest.mock('@hubbl/data-access/api');

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

  it('should keep the user in the state on signup', async () => {
    const signupSpy = jest.spyOn(UserApi, 'signup').mockResolvedValue({
      email: 'test@email.com'
    } as any);

    const Component = () => {
      const { user, API } = useUserContext();

      return (
        <>
          {user && <p>{user?.email}</p>}
          <button
            onClick={() => {
              API.signup('owner', {} as any);
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

    expect(signupSpy).toHaveBeenCalled();
    expect(screen.getByText('test@email.com')).toBeDefined();
  });

  it('should appear a snackbar on an error', async () => {
    const signupSpy = jest.spyOn(UserApi, 'signup').mockRejectedValue({});

    const Component = () => {
      const { API } = useUserContext();

      return (
        <button
          onClick={() => {
            API.signup('owner', {} as any);
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

    expect(signupSpy).toHaveBeenCalled();
    expect(
      screen.getByText('An error ocurred. Try again.')
    ).toBeInTheDocument();
  });
});
