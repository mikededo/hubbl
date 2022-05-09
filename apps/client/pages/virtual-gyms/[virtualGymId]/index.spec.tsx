import { createTheme, ThemeProvider } from '@mui/material';
import { render } from '@testing-library/react';

import VirtualGym from './index';

describe('Virtual gym page', () => {
  it('should have the getLayout prop defined', () => {
    expect(VirtualGym.getLayout).toBeDefined();

    const { container } = render(
      <ThemeProvider theme={createTheme()}>
        {VirtualGym.getLayout(<div />)}
      </ThemeProvider>
    );
    expect(container).toBeInTheDocument();
  });

  it('should render properly', async () => {
    const container = render(<VirtualGym />);

    expect(container).toBeDefined();
  });
});
