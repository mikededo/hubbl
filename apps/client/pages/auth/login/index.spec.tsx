import React from 'react';

import { AppProvider, useAppContext } from '@hubbl/data-access/contexts';
import { render } from '@testing-library/react';

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
});
