import * as jwt from 'jsonwebtoken';

import { TokenApi, GymApi, UserApi } from '@hubbl/data-access/api';
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

const renderPage = () =>
  render(
    <AppProvider>
      <ThemeProvider theme={createTheme()}>
        <ToastContext>
          <Settings />
        </ToastContext>
      </ThemeProvider>
    </AppProvider>
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
    let container: HTMLElement;
    await act(async () => {
      container = renderPage().container;
    });

    expect(container).toBeInTheDocument();
  });

  describe('User info', () => {
    const setUp = async (): Promise<jest.SpyInstance<Promise<void>, any>> => {
      jest.spyOn(jwt, 'decode').mockReturnValue({ user: 'owner' });
      jest.spyOn(TokenApi, 'validate').mockResolvedValue(validateRes);
      const callSpy = jest.spyOn(UserApi.owner, 'update').mockResolvedValue();

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
      jest.spyOn(jwt, 'decode').mockReturnValue({ user: 'owner' });
      jest.spyOn(TokenApi, 'validate').mockResolvedValue(validateRes);
      const callSpy = jest.spyOn(UserApi.owner, 'update').mockResolvedValue();

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

  describe('Gym info', () => {
    const setUp = async (
      user: 'owner' | 'worker' = 'owner'
    ): Promise<jest.SpyInstance<Promise<void>, any>> => {
      jest.spyOn(jwt, 'decode').mockReturnValue({ user });
      jest.spyOn(TokenApi, 'validate').mockResolvedValue(validateRes);
      const callSpy = jest.spyOn(GymApi, 'update').mockResolvedValue();

      await act(async () => {
        renderPage();
      });

      return callSpy;
    };

    it('updates the gym info', async () => {
      const callSpy = await setUp();

      await act(async () => {
        fireEvent.input(screen.getByPlaceholderText("Your gym's name"), {
          target: { name: 'name', value: 'GymName' }
        });
        fireEvent.input(screen.getByPlaceholderText('gym.name@info.com'), {
          target: { name: 'email', value: 'gym.name@domain.com' }
        });
        fireEvent.input(screen.getByTitle('gym-phone'), {
          target: { name: 'phone', value: '111 222 333' }
        });
      });
      await act(async () => {
        fireEvent.submit(screen.getByTitle('gym-info-submit'));
      });

      expect(callSpy).toHaveBeenCalledTimes(1);
    });

    it('should not show the gym info section as a worker', async () => {
      await setUp('worker');

      expect(
        screen.queryByPlaceholderText("Your gym's name")
      ).not.toBeInTheDocument();
      expect(
        screen.queryByPlaceholderText('gym.name@info.com')
      ).not.toBeInTheDocument();
      expect(screen.queryByTitle('gym-phone')).not.toBeInTheDocument();
      expect(screen.queryByTitle('gym-info-submit')).not.toBeInTheDocument();
    });
  });
});
