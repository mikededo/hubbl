import { ReactElement } from 'react';

import { useAppContext } from '@hubbl/data-access/contexts';
import {
  PageHeader,
  RequiredUserInfoFields,
  SettingsLogout,
  SettingsUserInfo,
  SettingsUserPassword,
  UserPasswordFields
} from '@hubbl/ui/components';
import { Box, Stack, styled } from '@mui/material';

import {
  ContentContainer,
  CoreSideNav,
  Pages,
  SettingsPages
} from '../../components';

const { SettingsGymInfo } = Pages.Settings;

const SectionWrapper = styled(Box)(({ theme }) => ({
  overflow: 'auto',
  width: '100%',
  padding: theme.spacing(6, 4, 4)
}));

const SectionStack = styled(Stack)(({ theme }) => ({
  maxWidth: theme.spacing(140)
}));

const Settings = () => {
  const {
    token: { parsed },
    user,
    API
  } = useAppContext();

  const handleOnUpdateUser = (
    data: RequiredUserInfoFields | UserPasswordFields
  ) => {
    API.user.update(data);
  };

  const handleOnUpdateGym = (data: Pages.Settings.RequiredGymInfoFields) => {
    API.gym.update(data);
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

  /**
   * Since we can ensure that, if the prop `parsed` is `undefined`
   * there's no user, we do not have to return undefined as in
   * `mapUserToValues` if such user is `undefined`
   */
  const mapGymToValues = (): Pages.Settings.RequiredGymInfoFields => ({
    name: user.gym.name,
    email: user.gym.email,
    phone: user.gym.phone,
    color: user.gym.color
  });

  return (
    <ContentContainer>
      <CoreSideNav header="Gym name" selected="settings" />

      <SectionWrapper>
        <SectionStack direction="column" spacing={3}>
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

          {parsed?.user === 'owner' && (
            <SettingsGymInfo
              defaultValues={mapGymToValues()}
              onSubmit={handleOnUpdateGym}
            />
          )}
        </SectionStack>
      </SectionWrapper>
    </ContentContainer>
  );
};

export default Settings;

Settings.getLayout = (page: ReactElement) => (
  <SettingsPages>{page}</SettingsPages>
);
