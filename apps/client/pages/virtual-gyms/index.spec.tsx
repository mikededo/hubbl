import { createTheme, ThemeProvider } from '@mui/material';
import { render } from '@testing-library/react';

import VirtualGyms from './index';

describe('Virtual gyms page', () => {
  it('should have the getLayout prop defined', () => {
    expect(VirtualGyms.getLayout).toBeDefined();

    const { container } = render(
      <ThemeProvider theme={createTheme()}>
        {VirtualGyms.getLayout(<div />)}
      </ThemeProvider>
    );
    expect(container).toBeInTheDocument();
  });

  it('should render properly', async () => {
    const container = render(<VirtualGyms />);

    expect(container).toBeDefined();
  });
});
