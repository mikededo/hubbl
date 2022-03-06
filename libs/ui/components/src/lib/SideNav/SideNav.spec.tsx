import { createTheme, ThemeProvider, useMediaQuery } from '@mui/material';
import { render } from '@testing-library/react';

import { SideNavLinkItem } from '../SideNavLink';
import SideNav from './SideNav';

jest.mock('@mui/material', () => {
  const actual = jest.requireActual('@mui/material');

  return {
    ...actual,
    useMediaQuery: jest.fn(() => false)
  };
});

describe('<SideNav />', () => {
  const groupOne: Record<string, SideNavLinkItem> = {
    first: { label: 'First', href: '/first' },
    second: { label: 'Second', href: '/second' },
    third: { label: 'Third', href: '/third' }
  };
  const groupTwo: Record<string, SideNavLinkItem> = {
    fourth: { label: 'Fourth', href: '/fourth' },
    fifth: { label: 'Fifth', href: '/fifth' }
  };
  const groupThree: Record<string, SideNavLinkItem> = {
    sixth: { label: 'Sixth', href: '/sixth' }
  };

  it('should render the navigation bar', () => {
    const utils = render(
      <ThemeProvider theme={createTheme()}>
        <SideNav
          entries={[
            { name: 'One', entries: groupOne },
            { name: 'Two', entries: groupTwo },
            { name: 'Hidden', entries: groupThree, hidden: true }
          ]}
          header="SideNav"
          selected="sixth"
        />
      </ThemeProvider>
    );

    expect(utils.container).toBeInTheDocument();
    expect(utils.getByText('SideNav')).toBeInTheDocument();
    expect(utils.getByText('First')).toBeInTheDocument();
    expect(utils.getByText('Second')).toBeInTheDocument();
    expect(utils.getByText('Third')).toBeInTheDocument();
    expect(utils.getByText('Fourth')).toBeInTheDocument();
    expect(utils.getByText('Fifth')).toBeInTheDocument();
    expect(utils.getByText('Sixth')).toBeInTheDocument();
  });

  it('should render the first letter of the header on small screens', () => {
    (useMediaQuery as any as jest.Mock).mockReset().mockImplementation((cb) => {
      const mockTheme = { breakpoints: { down: jest.fn() } };
      cb(mockTheme);

      expect(mockTheme.breakpoints.down).toHaveBeenCalledTimes(1);
      expect(mockTheme.breakpoints.down).toHaveBeenCalledWith('md');

      return true;
    });

    const utils = render(
      <ThemeProvider theme={createTheme()}>
        <SideNav entries={[]} header="SideNav" selected="sixth" />
      </ThemeProvider>
    );

    expect(utils.container).toBeInTheDocument();
    expect(utils.getByText('S')).toBeInTheDocument();
  });
});
