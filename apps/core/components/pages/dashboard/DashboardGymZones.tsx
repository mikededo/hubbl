import { useState } from 'react';

import { useAppContext, useLoadingContext } from '@hubbl/data-access/contexts';
import { GymZoneDTO } from '@hubbl/shared/models/dto';
import { EmptyHandler } from '@hubbl/shared/types';
import {
  DashboardGymZones as GymZonesGrid,
  GymZoneDialog,
  GymZoneFormFields
} from '@hubbl/ui/components';

import { useDashboard } from './hooks';

const DashboardGymZones = () => {
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

  const handleOnSubmitGymZone = async (formData: GymZoneFormFields) => {
    setOpenDialog(false);
    onPushLoading();

    // The data should include the gym
    const created = await poster<GymZoneDTO>(`/virtual-gyms/${1}/gym-zones`, {
      ...formData,
      gym: user.gym.id
    });

    // Mutate the state once the virtual gym has been created
    await mutate({ ...data, gymZones: [created, ...data.gymZones] });

    onPopLoading();
  };

  return (
    <>
      {data && (
        <GymZonesGrid items={data.gymZones} onAddGymZone={handleOnAddClick} />
      )}

      <GymZoneDialog
        open={openDialog}
        title="Create gym zone"
        onClose={handleOnCloseDialog}
        onSubmit={handleOnSubmitGymZone}
      />
    </>
  );
};

export default DashboardGymZones;
