import React from 'react';

import {
  ThemeProvider,
  UserProvider,
  useUserContext
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

  return { ...actual, useUserContext: jest.fn() };
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
    (useUserContext as any).mockReturnValue({ user: {}, API: {} });

    const utils = render(
      <UserProvider>
        <SignUp />
      </UserProvider>
    );

    expect(utils.container).toBeInTheDocument();
  });

  it('should fill the form', async () => {
    const signupSpy = jest.fn();
    (useUserContext as any).mockReturnValue({
      user: undefined,
      API: { signup: signupSpy }
    });

    render(
      <ThemeProvider>
        <UserProvider>
          <SignUp />
        </UserProvider>
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
    });
    await act(async () => {
      fireEvent.submit(screen.getByText('Continue'));
    });

    // Second form
    await act(async () => {
      fireEvent.input(screen.getByPlaceholderText('Fantagym'), {
        target: { name: 'name', value: 'GymName' }
      });
      fireEvent.input(screen.getByPlaceholderText('gym.name@info.com'), {
        target: { name: 'email', value: 'gym@name.com' }
      });

      const utils = screen.getByPlaceholderText('000 000 000');
      // Test the focus
      utils.focus();
      fireEvent.input(utils, { target: { name: 'phone', value: '111222333' } });
      utils.blur();
    });
    await act(async () => {
      fireEvent.submit(
        screen.getByText(
          (cnt, el) =>
            // Avoid coallision with header
            el.tagName.toLowerCase() !== 'h2' && cnt.startsWith('Sign up')
        )
      );
    });

    expect(signupSpy).toHaveBeenCalledTimes(1);
    expect(signupSpy).toHaveBeenCalledWith('owner', {
      firstName: 'TestFirstName',
      lastName: 'TestLastName',
      email: 'test@email.com',
      password: 'eightCharsPwd',
      gym: {
        name: 'GymName',
        email: 'gym@name.com',
        phone: '111222333'
      }
    });
  });

  it('should display the first form if go back is pressed', async () => {
    (useUserContext as any).mockReturnValue({ user: {}, API: {} });

    render(
      <ThemeProvider>
        <UserProvider>
          <SignUp />
        </UserProvider>
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
    });
    await act(async () => {
      fireEvent.submit(screen.getByText('Continue'));
    });

    // Press go back
    await act(async () => {
      fireEvent.click(screen.getByText('Go back'));
    });

    // Ensure first form is being shown with the written inputs
    expect(screen.getByPlaceholderText('John')).toHaveValue('TestFirstName');
    expect(screen.getByPlaceholderText('Doe')).toHaveValue('TestLastName');
    expect(screen.getByPlaceholderText('john.doe@domain.com')).toHaveValue(
      'test@email.com'
    );
    expect(screen.getByPlaceholderText('At least 8 characters!')).toHaveValue(
      'eightCharsPwd'
    );
  });
});
