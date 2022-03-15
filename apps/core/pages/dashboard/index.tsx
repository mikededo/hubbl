import { ReactElement, useState } from 'react';

import useSWR from 'swr';

import { DashboardResponse } from '@hubbl/data-access/api';
import { useAppContext } from '@hubbl/data-access/contexts';
import {
  DashboardVirtualGyms,
  PageHeader,
  VirtualGymDialog
} from '@hubbl/ui/components';

import { BaseLayout, GeneralPages } from '../../components';
import { EmptyHandler } from '@hubbl/shared/types';

const Dashboard = () => {
  const {
    token,
    user,
    API: { fetcher }
  } = useAppContext();

  const [openDialog, setOpenDialog] = useState(false);

  const { data } = useSWR<DashboardResponse>(
    // Wait for the user to be defined, before making the call
    token.parsed ? () => `/dashboards/${user.gym.id}` : null,
    fetcher
  );

  const handleOnAddClick: EmptyHandler = () => {
    setOpenDialog(true);
  };

  const handleOnCloseDialog: EmptyHandler = () => {
    setOpenDialog(false);
  };

  return (
    <>
      <PageHeader
        title={`Welcome ${user?.firstName} ${user?.lastName}!`}
        breadcrumbs={[{ href: '/', label: 'Dashboard' }]}
      />

      {data && (
        <DashboardVirtualGyms
          items={data.virtualGyms}
          onAddVirtualGym={handleOnAddClick}
        />
      )}

      <VirtualGymDialog
        open={openDialog}
        title="Create virtual gym"
        onClose={handleOnCloseDialog}
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
