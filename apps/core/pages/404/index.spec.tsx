import { createTheme, ThemeProvider } from '@mui/material';
import { render } from '@testing-library/react';

import Page404 from './index';

describe('404 page', () => {
  it('should render properly', () => {
    const utils = render(
      <ThemeProvider theme={createTheme()}>
        <Page404 />
      </ThemeProvider>
    );

    expect(utils.container).toBeInTheDocument();
    expect(utils.getByText('404')).toBeInTheDocument();
    expect(utils.getByText('Page not found')).toBeInTheDocument();
  });
});
