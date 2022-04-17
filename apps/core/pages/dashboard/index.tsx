import { ReactElement } from 'react';

import { useAppContext } from '@hubbl/data-access/contexts';
import { PageHeader, TodayEventsList } from '@hubbl/ui/components';

import { BaseLayout, GeneralPages, Pages } from '../../components';
import { Grid, styled } from '@mui/material';

const ResponsiveGrid = styled(Grid)(({ theme }) => ({
  justifyContent: 'flex-start',
  [theme.breakpoints.down('sm')]: {
    justifyContent: 'center'
  }
}));

const Dashboard = () => {
  const { user, todayEvents } = useAppContext();

  return (
    <>
      <PageHeader
        title={`Welcome ${user?.firstName} ${user?.lastName}!`}
        breadcrumbs={[{ href: '/', label: 'Dashboard' }]}
      />

      <Pages.Dashboard.DashboardVirtualGyms />

      <Pages.Dashboard.DashboardGymZones />

      <ResponsiveGrid gap={{ xs: 3, sm: 2, md: 3 }} container>
        <Grid item>
          <Pages.Dashboard.DashboardTrainers />
        </Grid>

        <Grid item>
          <Pages.Dashboard.DashboardEventTemplates />
        </Grid>

        <Grid item>
          <Pages.Dashboard.DashboardEvents />
        </Grid>
      </ResponsiveGrid>

      <TodayEventsList events={todayEvents} />
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
