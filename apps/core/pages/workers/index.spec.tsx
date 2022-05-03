import { createTheme, ThemeProvider } from '@mui/material';
import { render } from '@testing-library/react';

import Workers from './index';

describe('Workers page', () => {
  it('should have the getLayout prop defined', () => {
    expect(Workers.getLayout).toBeDefined();

    const { container } = render(
      <ThemeProvider theme={createTheme()}>
        {Workers.getLayout(<div />)}
      </ThemeProvider>
    );
    expect(container).toBeInTheDocument();
  });

  it('should render properly', async () => {
    const container = render(<Workers />);

    expect(container).toBeDefined();
  });
});
