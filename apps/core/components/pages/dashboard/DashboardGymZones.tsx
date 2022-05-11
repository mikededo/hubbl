import { useState } from 'react';

import { useAppContext, useToastContext } from '@hubbl/data-access/contexts';
import { GymZoneDTO } from '@hubbl/shared/models/dto';
import { EmptyHandler, SingleHandler } from '@hubbl/shared/types';
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
    helpers: { hasAccess },
    API: { fetcher, poster }
  } = useAppContext();
  const { onSuccess, onError } = useToastContext();

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

  const handleOnSubmitGymZone: SingleHandler<GymZoneFormFields> = async (
    formData
  ) => {
    setOpenDialog(false);

    try {
      // The data should include the gym
      const created = await poster<GymZoneDTO>(
        `/virtual-gyms/${formData.virtualGym}/gym-zones`,
        { ...formData, gym: user.gym.id }
      );

      // Mutate the state once the virtual gym has been created
      await mutate({ ...data, gymZones: [created, ...data.gymZones] }, false);

      onSuccess('Gym zone created!');
    } catch (e) {
      onError(e);
    }
  };

  return (
    <>
      {data && (
        <GymZonesGrid
          items={data.gymZones}
          onAddGymZone={
            hasAccess('createGymZones') ? handleOnAddClick : undefined
          }
        />
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
