import { DashboardResponse } from '@hubbl/data-access/api';
import { useAppContext } from '@hubbl/data-access/contexts';
import { DashboardVirtualGyms, PageHeader } from '@hubbl/ui/components';
import { ReactElement } from 'react';
import useSWR from 'swr';

import { BaseLayout, GeneralPages } from '../../components';

const Dashboard = (): JSX.Element => {
  const {
    token,
    user,
    API: { fetcher }
  } = useAppContext();
  const { data } = useSWR<DashboardResponse>(
    token?.parsed ? `/dashboards/${user?.gym.id}` : null,
    fetcher,
    { revalidateOnFocus: false }
  );

  return (
    <>
      <PageHeader
        title="Dashboard"
        breadcrumbs={[{ href: '/', label: 'Dashboard' }]}
      />

      <DashboardVirtualGyms items={data?.virtualGyms ?? []} />
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
