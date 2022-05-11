import { SideNav } from '@hubbl/ui/components';

const entries = [
  {
    name: 'GENERAL',
    hidden: true,
    entries: {
      dashboard: { label: 'Dashboard', href: '/dashboard' },
      virtualGyms: { label: 'Virtual gyms', href: '/virtual-gyms' }
    }
  },
  {
    name: 'SETTINGS',
    entries: { settings: { label: 'Settings', href: '/settings' } }
  }
];

type ClientSideNavOptions = 'dashboard' | 'virtualGyms' | 'settings';

export type ClientSideNavProps = {
  /**
   * Header of the client side navigation
   */
  header: string;

  /**
   * Selected value of the navigation bar
   */
  selected: ClientSideNavOptions;
};
const ClientSideNav = ({ header, selected }: ClientSideNavProps) => (
  <SideNav entries={entries} header={header} selected={selected} />
);

export default ClientSideNav;
