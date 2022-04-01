import { createTheme, ThemeProvider, useMediaQuery } from '@mui/material';
import { act, fireEvent, render, screen } from '@testing-library/react';

import BaseLayout from './BaseLayout';

jest.mock('@mui/material', () => {
  const actual = jest.requireActual('@mui/material');

  return {
    ...actual,
    useMediaQuery: jest.fn()
  };
});

describe('<BaseLayout />', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (useMediaQuery as jest.Mock).mockImplementation(() => false);
  });

  it('should render properly', () => {
    const { container } = render(
      <ThemeProvider theme={createTheme()}>
        <BaseLayout header="Test header" selected="dashboard">
          <div>Child</div>
        </BaseLayout>
      </ThemeProvider>
    );

    expect(container).toBeInTheDocument();
  });

  it('should toggle the navigation bar', async () => {
    render(
      <ThemeProvider theme={createTheme()}>
        <BaseLayout header="Test header" selected="dashboard">
          <div>Child</div>
        </BaseLayout>
      </ThemeProvider>
    );

    await act(async () => {
      fireEvent.click(screen.getByRole('button'));
    });

    expect(screen.getByRole('menubar')).toHaveStyle('padding-top: 0px');
  });

  it('should render the topBar', async () => {
    (useMediaQuery as jest.Mock).mockClear().mockImplementation(() => true);

    render(
      <ThemeProvider theme={createTheme()}>
        <BaseLayout header="Test header" selected="dashboard">
          <div>Child</div>
        </BaseLayout>
      </ThemeProvider>
    );
  });
});
