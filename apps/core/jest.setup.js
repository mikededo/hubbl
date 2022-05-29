import '@testing-library/jest-dom';
import '@testing-library/user-event';

/* Mock next/router globally */
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

// eslint-disable-next-line no-undef
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
