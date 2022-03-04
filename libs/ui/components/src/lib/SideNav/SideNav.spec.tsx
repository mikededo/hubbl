import { render } from '@testing-library/react';
import { SideNavLinkItem } from '../SideNavLink';
import SideNav from './SideNav';

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
      <SideNav
        entries={[
          { name: 'One', entries: groupOne },
          { name: 'Two', entries: groupTwo },
          { name: 'Hidden', entries: groupThree, hidden: true }
        ]}
        header="SideNav"
        selected="sixth"
      />
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
});
