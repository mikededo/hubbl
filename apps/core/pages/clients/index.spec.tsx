import { createTheme, ThemeProvider } from '@mui/material';
import { render } from '@testing-library/react';

import Clients from './index';

describe('Clients page', () => {
  it('should have the getLayout prop defined', () => {
    expect(Clients.getLayout).toBeDefined();

    const { container } = render(
      <ThemeProvider theme={createTheme()}>
        {Clients.getLayout(<div />)}
      </ThemeProvider>
    );
    expect(container).toBeInTheDocument();
  });

  it('should render properly', async () => {
    const container = render(<Clients />);

    expect(container).toBeDefined();
  });
});
