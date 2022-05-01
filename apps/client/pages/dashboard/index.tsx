import { DashboardResponse } from '@hubbl/data-access/api';
import { useAppContext, useToastContext } from '@hubbl/data-access/contexts';
import {
  DashboardGymZones,
  DashboardVirtualGyms,
  PageHeader
} from '@hubbl/ui/components';
import { ReactElement } from 'react';
import useSWR from 'swr';

import { BaseLayout, GeneralPages } from '../../components';

const Dashboard = (): JSX.Element => {
  const {
    token,
    user,
    API: { fetcher }
  } = useAppContext();
  const { onError } = useToastContext();
  const { data, error } = useSWR<DashboardResponse>(
    token?.parsed ? `/dashboards/${user?.gym.id}` : null,
    fetcher,
    { revalidateOnFocus: false }
  );

  if (error) {
    onError(error);
  }

  return (
    <>
      <PageHeader
        title="Dashboard"
        breadcrumbs={[{ href: '/', label: 'Dashboard' }]}
      />

      <DashboardVirtualGyms items={data?.virtualGyms ?? []} />

      <DashboardGymZones items={data?.gymZones ?? []} />
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
