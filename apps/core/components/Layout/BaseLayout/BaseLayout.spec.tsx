import { createTheme, ThemeProvider } from '@mui/material';
import { act, fireEvent, render, screen } from '@testing-library/react';

import BaseLayout from './BaseLayout';

describe('<BaseLayout />', () => {
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

    expect(screen.getByRole('menubar')).toHaveStyle('padding-top: 0px')
  });
});
