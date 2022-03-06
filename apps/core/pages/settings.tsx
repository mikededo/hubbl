import { RequiredUserInfoFields } from '@hubbl/ui/components';

import { useAppContext } from '@hubbl/data-access/contexts';
import {
  ContentCard,
  PageHeader,
  RequiredUserInfoFields,
  SettingsLogout,
  SettingsUserInfo,
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

const Settings = () => {
  const { user, API } = useAppContext();

  const handleOnSaveInfo = (data: RequiredUserInfoFields) => {
    console.log(data)
    API.user.update(data);
  };

  const mapUserToValues = (): RequiredUserInfoFields => {
    if (!user) {
      return undefined;
    }

    return {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      gender: user.gender
    };
  };

  return (
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
            breadcrumbs={[{ href: '/', label: 'Settings' }]}
          />

          <SettingsLogout header="User full name" subtitle="Gym owner" />

          <SettingsUserInfo
            defaultValues={mapUserToValues()}
            onSubmit={handleOnSaveInfo}
          />
          {/* TODO: TEst all the form components */}

          <ContentCard sx={{ minHeight: '206px' }} />
          <ContentCard sx={{ minHeight: '281px' }} />
        </Stack>
      </Box>
    </Stack>
  );
};

export default Settings;
