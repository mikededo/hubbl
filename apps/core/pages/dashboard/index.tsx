import { ReactElement } from 'react';

import { useAppContext } from '@hubbl/data-access/contexts';
import { PageHeader } from '@hubbl/ui/components';

import { BaseLayout, GeneralPages, Pages } from '../../components';
import { Stack } from '@mui/material';

const Dashboard = () => {
  const { user } = useAppContext();

  return (
    <>
      <PageHeader
        title={`Welcome ${user?.firstName} ${user?.lastName}!`}
        breadcrumbs={[{ href: '/', label: 'Dashboard' }]}
      />

      <Pages.Dashboard.DashboardVirtualGyms />

      <Pages.Dashboard.DashboardGymZones />

      <Stack direction="row" gap={4}>
        <Pages.Dashboard.DashboardTrainers />

        <Pages.Dashboard.DashboardEventTemplates />

        <Pages.Dashboard.DashboardTrainers />
      </Stack>
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
