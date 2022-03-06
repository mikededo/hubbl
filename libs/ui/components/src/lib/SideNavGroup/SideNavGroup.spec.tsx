import { createTheme, ThemeProvider } from '@mui/material';
import { render, RenderResult } from '@testing-library/react';

import { SideNavLinkItem } from '../SideNavLink';
import SideNavGroup from './SideNavGroup';

describe('<SideNavGroup />', () => {
  const entries: Record<string, SideNavLinkItem> = {
    first: { label: 'First', href: '/first' },
    second: { label: 'Second', href: '/second' },
    third: { label: 'Third', href: '/third' }
  };

  const checkLinks = (utils: RenderResult) => {
    // Get the elements
    const first = utils.getByText('First');
    expect(first).toBeInTheDocument();
    expect(first.tagName.toLowerCase()).toBe('a');
    const second = utils.getByText('Second');
    expect(second).toBeInTheDocument();
    expect(second.tagName.toLowerCase()).toBe('a');
    const third = utils.getByText('Third');
    expect(third).toBeInTheDocument();
    // Check the selected element
    expect(third.tagName.toLowerCase()).toBe('p');
  };

  it('should render successfully with a group', () => {
    const utils = render(
      <ThemeProvider theme={createTheme()}>
        <SideNavGroup entries={entries} name="Group" selected="third" />
      </ThemeProvider>
    );

    expect(utils).toBeTruthy();

    // Get the header
    const header = utils.getByText('Group');
    expect(header).toBeInTheDocument();
    expect(header.tagName.toLowerCase()).toBe('h6');

    checkLinks(utils);
  });

  it('should render successfully without a group', () => {
    const utils = render(
      <ThemeProvider theme={createTheme()}>
        <SideNavGroup entries={entries} name="Group" selected="third" hidden />
      </ThemeProvider>
    );

    expect(utils).toBeTruthy();

    // Get the header
    expect(utils.queryByText('Group')).not.toBeInTheDocument();

    checkLinks(utils);
  });
});
