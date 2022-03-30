import { SideNav } from '@hubbl/ui/components';

const entries = [
  {
    name: 'GENERAL',
    hidden: true,
    entries: {
      dashboard: { label: 'Dashboard', href: '/dashboard' },
      virtualGyms: { label: 'Virtual gyms', href: '/virtual-gyms' },
      events: { label: 'Events', href: '/events' }
    }
  },
  {
    name: 'PERSONAL',
    entries: {
      trainers: { label: 'Trainers', href: '#' },
      workers: { label: 'Workers', href: '#' },
      clients: { label: 'Clients', href: '#' }
    }
  },
  {
    name: 'SETTINGS',
    entries: { settings: { label: 'Settings', href: '/settings' } }
  }
];

type CoreSideNavOptions =
  | 'dashboard'
  | 'virtualGyms'
  | 'events'
  | 'trainers'
  | 'workers'
  | 'clients'
  | 'settings';

export type CoreSideNavProps = {
  /**
   * Header of the core side navigation
   */
  header: string;

  /**
   * Selected value of the navigation bar
   */
  selected: CoreSideNavOptions;
};
const CoreSideNav = ({ header, selected }: CoreSideNavProps) => (
  <SideNav entries={entries} header={header} selected={selected} />
);

export default CoreSideNav;
