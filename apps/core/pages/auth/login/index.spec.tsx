import { act } from 'react-dom/test-utils';

import { UserProvider, useUserContext } from '@hubbl/data-access/contexts';
import { fireEvent, render, screen } from '@testing-library/react';

import LogIn from './index';

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

describe('LogIn', () => {
  it('should render', () => {
    (useUserContext as any).mockReturnValue({ user: {}, API: {} });

    const utils = render(
      <UserProvider>
        <LogIn />
      </UserProvider>
    );

    expect(utils.container).toBeInTheDocument();
  });

  it('should fill the form as an owner', async () => {
    const loginSpy = jest.fn();
    (useUserContext as any).mockReturnValue({
      user: undefined,
      API: { login: loginSpy }
    });

    render(
      <UserProvider>
        <LogIn />
      </UserProvider>
    );

    // Fill form
    await act(async () => {
      fireEvent.input(screen.getByPlaceholderText('john.doe@domain.com'), {
        target: { name: 'email', value: 'test@email.com' }
      });
      fireEvent.input(screen.getByPlaceholderText('At least 8 characters!'), {
        target: { name: 'password', value: 'eightCharsPwd' }
      });
    });
    await act(async () => {
      fireEvent.submit(screen.getByTitle('submit'));
    });

    expect(loginSpy).toHaveBeenCalledTimes(1);
    expect(loginSpy).toHaveBeenCalledWith('owner', {
      email: 'test@email.com',
      password: 'eightCharsPwd'
    });
  });

  it('should fill the form as a worker', async () => {
    const loginSpy = jest.fn();
    (useUserContext as any).mockReturnValue({
      user: undefined,
      API: { login: loginSpy }
    });

    render(
      <UserProvider>
        <LogIn />
      </UserProvider>
    );

    // Fill form
    await act(async () => {
      fireEvent.input(screen.getByPlaceholderText('john.doe@domain.com'), {
        target: { name: 'email', value: 'test@email.com' }
      });
      fireEvent.input(screen.getByPlaceholderText('At least 8 characters!'), {
        target: { name: 'password', value: 'eightCharsPwd' }
      });
      fireEvent.click(screen.getByRole('switch'));
    });
    await act(async () => {
      fireEvent.submit(screen.getByTitle('submit'));
    });

    expect(loginSpy).toHaveBeenCalledTimes(1);
    expect(loginSpy).toHaveBeenCalledWith('worker', {
      email: 'test@email.com',
      password: 'eightCharsPwd'
    });
  });
});
