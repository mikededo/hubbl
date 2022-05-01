import { ReactElement } from 'react';

import {
  PageHeader,
  RequiredUserInfoFields,
  SettingsLogout,
  SettingsUserInfo,
  SettingsUserPassword,
  UserPasswordFields
} from '@hubbl/ui/components';
import { useAppContext } from '@hubbl/data-access/contexts';

import { BaseLayout, SettingsPages } from '../../components';
import { useRouter } from 'next/router';

const Settings = (): JSX.Element => {
  const router = useRouter();
  const { user, API } = useAppContext();

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

  const handleOnUpdateUser = async (
    data: RequiredUserInfoFields | UserPasswordFields
  ) => {
    API.user.update(data);
  };

  const handleOnLogOut = async () => {
    API.logout();
    router.push('/auth/login');
  };

  return (
    <>
      <PageHeader
        title="Settings"
        breadcrumbs={[{ href: '/', label: 'Settings' }]}
      />

      <SettingsLogout
        header={`${user?.firstName} ${user?.lastName}`}
        subtitle="Gym client"
        onLogOut={handleOnLogOut}
      />

      <SettingsUserInfo
        defaultValues={mapUserToValues()}
        onSubmit={handleOnUpdateUser}
      />

      <SettingsUserPassword onSubmit={handleOnUpdateUser} />
    </>
  );
};

export default Settings;

Settings.getLayout = (page: ReactElement) => (
  <SettingsPages>
    <BaseLayout header="Settings" selected="settings">
      {page}
    </BaseLayout>
  </SettingsPages>
);
