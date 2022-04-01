import { createTheme, ThemeProvider } from '@mui/material';
import { render } from '@testing-library/react';

import HeaderNavWrapper from './HeaderNavWrapper';

describe('<HeaderNav />', () => {
  it('should render properly', () => {
    const { container } = render(
      <ThemeProvider theme={createTheme()}>
        <HeaderNavWrapper hidden>Header</HeaderNavWrapper>
      </ThemeProvider>
    );

    expect(container).toBeInTheDocument();
  });

  it('should render with the top at 0px', () => {
    const { container } = render(
      <ThemeProvider theme={createTheme()}>
        <HeaderNavWrapper>Header</HeaderNavWrapper>
      </ThemeProvider>
    );

    expect(container).toBeInTheDocument();
    expect(container.firstChild).toHaveStyle('top: 0px');
  });
});
