import React from 'react';

import {
  ThemeProvider,
  AppProvider,
  useAppContext
} from '@hubbl/data-access/contexts';
import { act, fireEvent, render, screen } from '@testing-library/react';

import SignUp from './index';

jest.mock('next/router', () => ({
  useRouter() {
    return {
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
  }
}));

jest.mock('@hubbl/data-access/contexts', () => {
  const actual = jest.requireActual('@hubbl/data-access/contexts');

  return { ...actual, useAppContext: jest.fn() };
});
jest.mock('@hubbl/data-access/api', () => {
  const actual = jest.requireActual('@hubbl/data-access/api');

  return {
    ...actual,
    TokenApi: { validate: jest.fn(() => Promise.reject(null)) }
  };
});

describe('<SignUp />', () => {
  it('should render', () => {
    (useAppContext as any).mockReturnValue({ user: {}, API: {} });

    const utils = render(
      <AppProvider>
        <SignUp />
      </AppProvider>
    );

    expect(utils.container).toBeInTheDocument();
  });

  it('should fill the form', async () => {
    const signupSpy = jest.fn();
    (useAppContext as any).mockReturnValue({
      user: undefined,
      API: { signup: signupSpy }
    });

    render(
      <ThemeProvider>
        <AppProvider>
          <SignUp />
        </AppProvider>
      </ThemeProvider>
    );

    // First form
    await act(async () => {
      fireEvent.input(screen.getByPlaceholderText('John'), {
        target: { name: 'firstName', value: 'TestFirstName' }
      });
      fireEvent.input(screen.getByPlaceholderText('Doe'), {
        target: { name: 'lastName', value: 'TestLastName' }
      });
      fireEvent.input(screen.getByPlaceholderText('john.doe@domain.com'), {
        target: { name: 'email', value: 'test@email.com' }
      });
      fireEvent.input(screen.getByPlaceholderText('At least 8 characters!'), {
        target: { name: 'password', value: 'eightCharsPwd' }
      });
      fireEvent.input(
        screen.getByPlaceholderText('Your gym should provide you this code!'),
        { target: { name: 'code', value: 'AABBCCDD00' } }
      );
    });
    await act(async () => {
      fireEvent.submit(screen.getByText('Register'));
    });

    expect(signupSpy).toHaveBeenCalledTimes(1);
    expect(signupSpy).toHaveBeenCalledWith(
      'client',
      {
        firstName: 'TestFirstName',
        lastName: 'TestLastName',
        email: 'test@email.com',
        password: 'eightCharsPwd'
      },
      { code: 'AABBCCDD00' }
    );
  });
});
