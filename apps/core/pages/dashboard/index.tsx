import { ReactElement } from 'react';

import useSWR from 'swr';

import { useAppContext } from '@hubbl/data-access/contexts';
import { PageHeader } from '@hubbl/ui/components';

import { BaseLayout, GeneralPages } from '../../components';

const Dashboard = () => {
  const {
    user,
    API: { fetcher }
  } = useAppContext();
  useSWR(
    // Wait for the user to be defined, before making the call
    user ? () => `/dashboards/${user.gym.id}` : null,
    fetcher
  );

  return (
    <>
      <PageHeader
        title={`Welcome ${user?.firstName} ${user?.lastName}!`}
        breadcrumbs={[{ href: '/', label: 'Dashboard' }]}
      />
    </>
  );
};

export default Dashboard;

Dashboard.getLayout = (page: ReactElement) => (
  <GeneralPages>
    <BaseLayout header="Gym name" selected="dashboard">
      {page}
    </BaseLayout>
  </GeneralPages>
);
