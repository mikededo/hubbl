import * as jwt from 'jsonwebtoken';
import { useRouter } from 'next/router';

import { TokenApi, UserApi } from '@hubbl/data-access/api';
import { AppProvider, ToastContext } from '@hubbl/data-access/contexts';
import { AppPalette, Gender } from '@hubbl/shared/types';
import { createTheme, ThemeProvider } from '@mui/material';
import { act, fireEvent, render, screen } from '@testing-library/react';

import Settings from './index';

jest.mock('@hubbl/data-access/api');
jest.mock('jsonwebtoken', () => {
  const actual = jest.requireActual('jsonwebtoken');

  return { ...actual, decode: jest.fn() };
});
jest.mock('@mui/material', () => {
  const actual = jest.requireActual('@mui/material');

  return {
    ...actual,
    useMediaQuery: jest.fn(() => false)
  };
});
jest.mock('next/router', () => {
  const result = {
    route: '/',
    pathname: '',
    query: '',
    asPath: '',
    push: jest.fn(),
    events: {
      on: jest.fn(),
      off: jest.fn()
    },
    beforePopState: jest.fn(() => null),
    prefetch: jest.fn(() => null)
  };

  return {
    useRouter() {
      return result;
    }
  };
});

const renderPage = () =>
  render(
    <ToastContext>
      <AppProvider>
        <ThemeProvider theme={createTheme()}>
          <Settings />
        </ThemeProvider>
      </AppProvider>
    </ToastContext>
  );

describe('Settings page', () => {
  const validateRes = {
    token: 'some-token',
    user: {
      id: 1,
      firstName: 'Test',
      lastName: 'User',
      email: 'test@user.com',
      phone: '000 000 000',
      gender: Gender.OTHER,
      gym: {
        id: 1,
        name: 'Gym',
        email: 'test@gym.info',
        phone: '000 000 000',
        color: AppPalette.BLUE
      }
    }
  };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should have the getLayout prop defined', () => {
    expect(Settings.getLayout).toBeDefined();

    const { container } = render(
      <ThemeProvider theme={createTheme()}>
        {Settings.getLayout(<div />)}
      </ThemeProvider>
    );
    expect(container).toBeInTheDocument();
  });

  it('should render properly', async () => {
    await act(async () => {
      renderPage()
    });

    expect(screen.getByText('Gym client')).toBeInTheDocument();
  });

  describe('logout', () => {
    it('should logout the user', async () => {
      jest.spyOn(jwt, 'decode').mockReturnValue({ user: 'client' });
      jest.spyOn(TokenApi, 'validate').mockResolvedValue(validateRes);
      const callSpy = jest.spyOn(UserApi, 'logout').mockResolvedValue();

      await act(async () => {
        renderPage();
      });
      await act(async () => {
        fireEvent.click(screen.getByText('Log out'));
      });

      expect(callSpy).toHaveBeenCalledTimes(1);
      expect(useRouter().push).toHaveBeenCalledTimes(1);
      expect(useRouter().push).toHaveBeenCalledWith('/auth/login');
    });
  });

  describe('User info', () => {
    const setUp = async (): Promise<jest.SpyInstance<Promise<void>, any>> => {
      jest.spyOn(jwt, 'decode').mockReturnValue({ user: 'client' });
      jest.spyOn(TokenApi, 'validate').mockResolvedValue(validateRes);
      const callSpy = jest.spyOn(UserApi.client, 'update').mockResolvedValue();

      await act(async () => {
        renderPage();
      });

      return callSpy;
    };

    it('updates the user basic information', async () => {
      const callSpy = await setUp();

      await act(async () => {
        fireEvent.input(screen.getByPlaceholderText('John'), {
          target: { name: 'firstName', value: 'FirstName' }
        });
        fireEvent.input(screen.getByPlaceholderText('Doe'), {
          target: { name: 'lastName', value: 'LastName' }
        });
        fireEvent.input(screen.getByTitle('user-email'), {
          target: { name: 'email', value: 'email@domain.com' }
        });
        fireEvent.input(screen.getByTitle('confirmation-user-email'), {
          target: { name: 'emailConfirmation', value: 'email@domain.com' }
        });
        fireEvent.input(screen.getByTitle('user-phone'), {
          target: { name: 'phone', value: '000 000 000' }
        });
        fireEvent.mouseDown(screen.getByRole('button', { name: 'Other' }));
      });
      await act(async () => {
        fireEvent.click(screen.getByRole('option', { name: 'Man' }));
      });
      await act(async () => {
        fireEvent.submit(screen.getByTitle('user-info-submit'));
      });

      expect(callSpy).toHaveBeenCalledTimes(1);
    });

    it('should not update the user info if emails do not match', async () => {
      const callSpy = await setUp();

      await act(async () => {
        fireEvent.input(screen.getByTitle('user-email'), {
          target: { name: 'email', value: 'email@domain.com' }
        });
        fireEvent.input(screen.getByTitle('confirmation-user-email'), {
          target: { name: 'emailConfirmation', value: 'another@domain.com' }
        });
      });
      await act(async () => {
        fireEvent.submit(screen.getByTitle('user-info-submit'));
      });

      expect(callSpy).not.toHaveBeenCalled();
    });
  });

  describe('User password', () => {
    const setUp = async (): Promise<jest.SpyInstance<Promise<void>, any>> => {
      jest.spyOn(jwt, 'decode').mockReturnValue({ user: 'client' });
      jest.spyOn(TokenApi, 'validate').mockResolvedValue(validateRes);
      const callSpy = jest.spyOn(UserApi.client, 'update').mockResolvedValue();

      await act(async () => {
        renderPage();
      });

      return callSpy;
    };

    it('updates the user password', async () => {
      const callSpy = await setUp();

      await act(async () => {
        fireEvent.input(screen.getByPlaceholderText('At least 8 characters!'), {
          target: { name: 'password', value: 'eightCharsPwd' }
        });
        fireEvent.input(screen.getByPlaceholderText('Repeat the password'), {
          target: { name: 'passwordConfirmation', value: 'eightCharsPwd' }
        });
      });
      await act(async () => {
        fireEvent.submit(screen.getByTitle('user-password-submit'));
      });

      expect(callSpy).toHaveBeenCalledTimes(1);
    });

    it('should not update the user password if they do not match', async () => {
      const callSpy = await setUp();

      await act(async () => {
        fireEvent.input(screen.getByPlaceholderText('At least 8 characters!'), {
          target: { name: 'password', value: 'eightCharsPwd' }
        });
        fireEvent.input(screen.getByPlaceholderText('Repeat the password'), {
          target: { name: 'passwordConfirmation', value: 'anotherPassword' }
        });
      });
      await act(async () => {
        fireEvent.submit(screen.getByTitle('user-password-submit'));
      });

      expect(callSpy).not.toHaveBeenCalled();
    });
  });
});
