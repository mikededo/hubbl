import { createTheme, ThemeProvider } from '@mui/material';
import { render, screen } from '@testing-library/react';

import Dashboard from './index';

describe('Dashboard page', () => {
  it('should have the getLayout prop defined', () => {
    expect(Dashboard.getLayout).toBeDefined();

    const { container } = render(
      <ThemeProvider theme={createTheme()}>
        {Dashboard.getLayout(<div />)}
      </ThemeProvider>
    );
    expect(container).toBeInTheDocument();
  });

  it('should render properly', async () => {
    render(<Dashboard />);

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });
});
