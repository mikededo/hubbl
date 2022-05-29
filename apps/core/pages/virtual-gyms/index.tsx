import { ReactElement, useState } from 'react';

import useSWR from 'swr';

import { useAppContext, useToastContext } from '@hubbl/data-access/contexts';
import { GymZoneDTO, VirtualGymDTO } from '@hubbl/shared/models/dto';
import { EmptyHandler, SingleHandler } from '@hubbl/shared/types';
import {
  GymZoneDialog,
  GymZoneFormFields,
  PageHeader,
  VirtualGymDialog,
  VirtualGymFormFields,
  VirtualGymList
} from '@hubbl/ui/components';

import { BaseLayout, GeneralPages } from '../../components';

const VirtualGyms = () => {
  const { onError, onSuccess } = useToastContext();
  const {
    token,
    user,
    helpers: { hasAccess },
    API: { fetcher, poster }
  } = useAppContext();
  const { data, mutate } = useSWR<VirtualGymDTO[]>(
    token.parsed ? '/virtual-gyms' : null,
    fetcher,
    { revalidateOnFocus: false }
  );

  // Dialogs state
  const [gymZoneDialog, setGymZoneDialog] = useState<number>();
  const [virtualGymDialog, setVirtualGymDialog] = useState(false);

  // Gym zone dialog
  const handleOnOpenGymZoneDialog: SingleHandler<number> = (id) => {
    setGymZoneDialog(id);
  };

  const handleOnCloseGymZoneDialog: EmptyHandler = () => {
    setGymZoneDialog(null);
  };

  const handleOnSubmitGymZoneDialog: SingleHandler<GymZoneFormFields> = async (
    formData
  ) => {
    setGymZoneDialog(null);

    try {
      const created = await poster<GymZoneDTO>(
        `/virtual-gyms/${formData.virtualGym}/gym-zones`,
        { ...formData, gym: user.gym.id }
      );

      // Mutate the modified virtual gym
      await mutate(
        data.map((vg) => {
          if (vg.id !== formData.virtualGym) {
            return vg;
          }

          // Update the gym zones
          vg.gymZones.push(created);
          return vg;
        }, false)
      );

      onSuccess('Gym zone created!');
    } catch (e) {
      onError(`${e}`);
    }
  };

  // Virtual gym dialog
  const handleOnOpenVirtualGymDialog: EmptyHandler = () => {
    setVirtualGymDialog(true);
  };

  const handleOnCloseVirtualGymDialog: EmptyHandler = () => {
    setVirtualGymDialog(false);
  };

  const handleOnSubmitVirtualGymDialog: SingleHandler<
    VirtualGymFormFields
  > = async (formData) => {
    setVirtualGymDialog(false);

    try {
      const created = await poster<VirtualGymDTO>('/virtual-gyms', {
        ...formData,
        gym: user.gym.id
      });

      // Mutate the state
      await mutate([...data, created], false);
      onSuccess('Virtual gym created!');
    } catch (e) {
      onError(`${e}`);
    }
  };

  return (
    <>
      <PageHeader
        title="Virtual gyms"
        breadcrumbs={[{ href: '/', label: 'Virtual Gyms' }]}
      />

      {data && (
        <VirtualGymList
          virtualGyms={data}
          onAddGymZone={
            hasAccess('createGymZones') ? handleOnOpenGymZoneDialog : undefined
          }
          onAddVirtualGym={
            token?.parsed.user === 'owner'
              ? handleOnOpenVirtualGymDialog
              : undefined
          }
        />
      )}

      {hasAccess('createGymZones') && (
        <GymZoneDialog
          open={!!gymZoneDialog}
          title="Create gym zone"
          // Use '' so that the form does not throw a warning
          defaultValues={{ virtualGym: gymZoneDialog ?? '' }}
          onClose={handleOnCloseGymZoneDialog}
          onSubmit={handleOnSubmitGymZoneDialog}
        />
      )}

      {token?.parsed?.user === 'owner' && (
        <VirtualGymDialog
          open={virtualGymDialog}
          title="Create virtual gym"
          onClose={handleOnCloseVirtualGymDialog}
          onSubmit={handleOnSubmitVirtualGymDialog}
        />
      )}
    </>
  );
};

export default VirtualGyms;

VirtualGyms.getLayout = (page: ReactElement) => (
  <GeneralPages>
    <BaseLayout header="Gym name" selected="virtualGyms" expanded>
      {page}
    </BaseLayout>
  </GeneralPages>
);
