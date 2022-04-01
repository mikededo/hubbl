import { createTheme, ThemeProvider } from '@mui/material';
import { render } from '@testing-library/react';

import GymZone from './index';

jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '',
      query: { virtualGymId: 1, gymZoneId: 2 },
      asPath: '',
      push: jest.fn(),
      events: { on: jest.fn(), off: jest.fn() },
      beforePopState: jest.fn(() => null),
      prefetch: jest.fn(() => null)
    };
  }
}));

const renderPage = () =>
  render(
    <ThemeProvider theme={createTheme()}>
      <GymZone />
    </ThemeProvider>
  );

describe('Id', () => {
  it('should render successfully', () => {
    const { baseElement } = renderPage();

    expect(baseElement).toBeTruthy();
  });

  it('should have the getLayout prop defined', () => {
    expect(GymZone.getLayout).toBeDefined();

    const { container } = render(
      <ThemeProvider theme={createTheme()}>
        {GymZone.getLayout(<div />)}
      </ThemeProvider>
    );
    expect(container).toBeInTheDocument();
  });
});
