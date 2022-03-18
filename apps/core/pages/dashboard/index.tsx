import { ReactElement } from 'react';

import useSWR from 'swr';

import { DashboardResponse } from '@hubbl/data-access/api';
import { useAppContext } from '@hubbl/data-access/contexts';
import { PageHeader } from '@hubbl/ui/components';

import { BaseLayout, GeneralPages, Pages } from '../../components';

const Dashboard = () => {
  const {
    token,
    user,
    API: { fetcher }
  } = useAppContext();

  useSWR<DashboardResponse>(
    // Wait for the user to be defined, before making the call
    token.parsed ? () => `/dashboards/${user.gym.id}` : null,
    fetcher
  );

  return (
    <>
      <PageHeader
        title={`Welcome ${user?.firstName} ${user?.lastName}!`}
        breadcrumbs={[{ href: '/', label: 'Dashboard' }]}
      />

      <Pages.Dashboard.DashboardVirtualGyms />
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
