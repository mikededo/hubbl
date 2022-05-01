import { ReactElement } from 'react';

import { BaseLayout, GeneralPages } from '../../components';

const Dashboard = (): JSX.Element => <div>Dashboard</div>;

export default Dashboard;

Dashboard.getLayout = (page: ReactElement) => (
  <GeneralPages>
    <BaseLayout header="Gym name" selected="dashboard">
      {page}
    </BaseLayout>
  </GeneralPages>
);
