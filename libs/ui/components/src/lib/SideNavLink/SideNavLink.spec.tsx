import { ThemeProvider } from '@emotion/react';
import { createTheme } from '@mui/material';
import { render } from '@testing-library/react';

import SideNavLink from './SideNavLink';

describe('<SideNavLink />', () => {
  it('should render successfully a <p /> if selected', () => {
    const utils = render(
      <ThemeProvider theme={createTheme()}>
        <SideNavLink label="Label" href="/" selected />
      </ThemeProvider>
    );

    expect(utils.container).toBeInTheDocument();

    const element = utils.getByText('Label');
    expect(element).toBeInTheDocument();
    expect(element.tagName.toLowerCase()).toBe('p');
  });

  it('should render successfully a <a /> if not selected', () => {
    const utils = render(
      <ThemeProvider theme={createTheme()}>
        <SideNavLink label="Label" href="/" />
      </ThemeProvider>
    );

    expect(utils.container).toBeInTheDocument();

    const element = utils.getByText('Label');
    expect(element).toBeInTheDocument();
    expect(element.tagName.toLowerCase()).toBe('a');
    expect(element).toHaveAttribute('href', '/');
  });
});
