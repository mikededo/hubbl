import { ReactElement } from 'react';

import { useAppContext } from '@hubbl/data-access/contexts';
import {
  PageHeader,
  RequiredUserInfoFields,
  SettingsLogout,
  SettingsUserInfo,
  SettingsUserPassword,
  SideNav,
  UserPasswordFields
} from '@hubbl/ui/components';
import { Box, Stack } from '@mui/material';

import { Pages, SettingsPages } from '../../components';

const { SettingsGymInfo } = Pages.Settings;

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

  const handleOnUpdateUser = (
    data: RequiredUserInfoFields | UserPasswordFields
  ) => {
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

  const mapGymToValues = (): Pages.Settings.RequiredGymInfoFields => {
    if (!user) {
      return undefined;
    }

    return {
      name: user.gym.name,
      email: user.gym.email,
      phone: user.gym.phone,
      color: user.gym.color
    };
  };

  return (
    <Stack
      direction="row"
      justifyContent="stretch"
      gap={4}
      sx={{ height: '100vh', width: '100vw', overflow: 'hidden' }}
    >
      <SideNav entries={entries} header="Gym name" selected="settings" />

      <Box
        sx={{
          overflow: 'auto',
          width: '100%',
          padding: '48px 32px 32px'
        }}
      >
        <Stack direction="column" spacing={3} sx={{ maxWidth: '1120px' }}>
          <PageHeader
            title="Settings"
            breadcrumbs={[{ href: '/', label: 'Settings' }]}
          />

          <SettingsLogout header="User full name" subtitle="Gym owner" />
          <SettingsUserInfo
            defaultValues={mapUserToValues()}
            onSubmit={handleOnUpdateUser}
          />
          <SettingsUserPassword onSubmit={handleOnUpdateUser} />

          <SettingsGymInfo
            defaultValues={mapGymToValues()}
            onSubmit={console.log}
          />
        </Stack>
      </Box>
    </Stack>
  );
};

export default Settings;

Settings.getLayout = (page: ReactElement) => (
  <SettingsPages>{page}</SettingsPages>
);
