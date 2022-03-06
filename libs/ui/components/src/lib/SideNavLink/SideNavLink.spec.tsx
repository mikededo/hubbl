import { ThemeProvider, createTheme, useMediaQuery } from '@mui/material';
import { render } from '@testing-library/react';

import SideNavLink from './SideNavLink';

jest.mock('@mui/material', () => {
  const actual = jest.requireActual('@mui/material');

  return {
    ...actual,
    useMediaQuery: jest.fn(() => false)
  };
});

describe('<SideNavLink />', () => {
  const smallScreenTest = (selected: boolean) => {
    (useMediaQuery as jest.Mock).mockClear().mockReturnValue(true);

    const utils = render(
      <ThemeProvider theme={createTheme()}>
        <SideNavLink label="Label" href="/" selected={selected} />
      </ThemeProvider>
    );

    expect(utils.container).toBeInTheDocument();

    const element = utils.getByText('L');
    expect(element).toBeInTheDocument();
  };

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

  it('should render only the first letter as selected links on small screens', () => {
    smallScreenTest(true);
  });

  it('should render only the first letter as selected links on small screens', () => {
    smallScreenTest(false);
  });
});
