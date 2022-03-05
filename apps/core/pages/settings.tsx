import {
  ContentCard,
  PageHeader,
  SettingsLogout,
  SideNav
} from '@hubbl/ui/components';
import { Box, Stack } from '@mui/material';

const entries = [
  {
    name: 'GENERAL',
    hidden: true,
    entries: {
      dashboard: { label: 'Dashboard', href: '/dashboard' },
      virtualGyms: { label: 'Virtual gyms', href: '#' },
      events: { label: 'Events', href: '#' }
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

const Settings = () => (
  <Stack
    direction="row"
    justifyContent="stretch"
    gap={4}
    sx={{ height: '100vh', width: '100wh', overflow: 'hidden' }}
  >
    <SideNav entries={entries} header="Gym name" selected="settings" />

    <Box
      sx={{
        overflow: 'auto',
        width: '100%',
        height: '100%',
        padding: '48px 32px 32px'
      }}
    >
      <Stack
        direction="column"
        spacing={3}
        sx={{
          height: '100%',
          width: '100%',
          maxWidth: '1120px'
        }}
      >
        <PageHeader
          title="Settings"
          breadcrumbs={[
            { href: '/', label: 'Settings' },
            { href: '/', label: 'Settings' }
          ]}
        />

        <SettingsLogout header="User full name" subtitle="Gym owner" />

        <ContentCard sx={{ minHeight: '364px' }} />
        <ContentCard sx={{ minHeight: '206px' }} />
        <ContentCard sx={{ minHeight: '281px' }} />
      </Stack>
    </Box>
  </Stack>
);

export default Settings;
