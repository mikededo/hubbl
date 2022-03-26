import { createTheme, ThemeProvider } from '@mui/material';
import { render } from '@testing-library/react';

import SideNavWrapper from './SideNavWrapper';

describe('<SideNavWrapper />', () => {
  it('should render properly', () => {
    const { container } = render(
      <ThemeProvider theme={createTheme()}>
        <SideNavWrapper hidden toggled>SideNav</SideNavWrapper>
      </ThemeProvider>
    );

    expect(container).toBeInTheDocument();
  });

  it('should render with the margin-left at 0px', () => {
    const { container } = render(
      <ThemeProvider theme={createTheme()}>
        <SideNavWrapper>Header</SideNavWrapper>
      </ThemeProvider>
    );

    expect(container).toBeInTheDocument();
    expect(container.firstChild).toHaveStyle('margin-left: 0px');
  });

  it('should render with the padding-top at 0px', () => {
    const { container } = render(
      <ThemeProvider theme={createTheme()}>
        <SideNavWrapper>Header</SideNavWrapper>
      </ThemeProvider>
    );

    expect(container).toBeInTheDocument();
    expect(container.firstChild).toHaveStyle('padding-top: 0px');
  });
});
