import { ReactElement } from 'react';

import useSWR from 'swr';

import { DashboardResponse } from '@hubbl/data-access/api';
import { useAppContext } from '@hubbl/data-access/contexts';
import { DashboardVirtualGyms, PageHeader } from '@hubbl/ui/components';

import { BaseLayout, GeneralPages } from '../../components';

const Dashboard = () => {
  const {
    token,
    user,
    API: { fetcher }
  } = useAppContext();

  const { data } = useSWR<DashboardResponse>(
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

      {data && <DashboardVirtualGyms items={data.virtualGyms} />}
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
