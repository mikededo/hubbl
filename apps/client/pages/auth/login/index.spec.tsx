import { AppProvider, useAppContext } from '@hubbl/data-access/contexts';
import { act, fireEvent, render, screen } from '@testing-library/react';

import LogIn from './index';
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
    const loginSpy = jest.fn();
    (useAppContext as any).mockReturnValue({
      user: undefined,
      API: { login: loginSpy }
    });

    render(
      <AppProvider>
        <LogIn />
      </AppProvider>
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
    expect(loginSpy).toHaveBeenCalledWith('client', {
      email: 'test@email.com',
      password: 'eightCharsPwd'
    });
  });
});
