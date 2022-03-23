import { useState } from 'react';

import { useAppContext, useLoadingContext } from '@hubbl/data-access/contexts';
import { VirtualGymDTO } from '@hubbl/shared/models/dto';
import { EmptyHandler } from '@hubbl/shared/types';
import {
  DashboardVirtualGyms as VirtualGymsGrid,
  VirtualGymDialog,
  VirtualGymFormFields
} from '@hubbl/ui/components';

import { useDashboard } from './hooks';

const DashboardVirtualGyms = () => {
  const {
    token,
    user,
    API: { fetcher, poster }
  } = useAppContext();
  const { onPopLoading, onPushLoading } = useLoadingContext();

  const { data, mutate } = useDashboard({
    run: !!token.parsed,
    gymId: user?.gym?.id,
    fetcher
  });

  const [openDialog, setOpenDialog] = useState(false);

  const handleOnAddClick: EmptyHandler = () => {
    setOpenDialog(true);
  };

  const handleOnCloseDialog: EmptyHandler = () => {
    setOpenDialog(false);
  };

  const handleOnSubmitVirtualGym = async (formData: VirtualGymFormFields) => {
    setOpenDialog(false);
    onPushLoading();

    // The data should include the gym
    const created = await poster<VirtualGymDTO>('/virtual-gyms', {
      ...formData,
      gym: user.gym.id
    });

    // Mutate the state once the virtual gym has been created
    await mutate({ ...data, virtualGyms: [created, ...data.virtualGyms] });

    onPopLoading();
  };

  return (
    <>
      {data && (
        <VirtualGymsGrid
          items={data.virtualGyms}
          onAddVirtualGym={handleOnAddClick}
        />
      )}

      <VirtualGymDialog
        open={openDialog}
        title="Create virtual gym"
        onClose={handleOnCloseDialog}
        onSubmit={handleOnSubmitVirtualGym}
      />
    </>
  );
};

export default DashboardVirtualGyms;
