import { ReactElement, useEffect, useMemo, useState } from 'react';

import { useRouter } from 'next/router';
import useSWR from 'swr';

import {
  useAppContext,
  useLoadingContext,
  useToastContext
} from '@hubbl/data-access/contexts';
import { GymZoneDTO, VirtualGymDTO } from '@hubbl/shared/models/dto';
import {
  GymZoneDialog,
  GymZoneFormFields,
  GymZoneGrid,
  PageHeader
} from '@hubbl/ui/components';

import { BaseLayout, GeneralPages } from '../../../components';
import { EmptyHandler, SingleHandler } from '@hubbl/shared/types';

type GymZoneDialogState = {
  /**
   * Whether the gym to be created is of class type or not
   */
  isClassType: boolean;

  /**
   * Default selected virtual gym, which equals to the router
   * id
   */
  virtualGym: number;
};

const VirtualGym = () => {
  const router = useRouter();
  const { loading, onPopLoading, onPushLoading } = useLoadingContext();
  const { onError, onSuccess } = useToastContext();
  const {
    user,
    token,
    API: { fetcher, poster }
  } = useAppContext();
  const { data, error, mutate } = useSWR<VirtualGymDTO>(
    token.parsed ? `/virtual-gyms/${router.query.id}` : null,
    fetcher
  );

  // Gym zone dialog
  const [gymZoneDialog, setGymZoneDialog] = useState<GymZoneDialogState>(null);

  const classGymZones = useMemo(() => {
    if (!data) {
      return [];
    }

    return data.gymZones.filter(({ isClassType }) => isClassType);
  }, [data]);

  const nonClassGymZones = useMemo(() => {
    if (!data) {
      return [];
    }

    return data.gymZones.filter(({ isClassType }) => !isClassType);
  }, [data]);

  /* Handlers */

  const handleOnAddGymZone: SingleHandler<boolean, EmptyHandler> =
    (classType) => () => {
      setGymZoneDialog({
        isClassType: classType,
        virtualGym: +router.query.id
      });
    };

  const handleOnCloseDialog: EmptyHandler = () => {
    setGymZoneDialog(null);
  };

  const handleOnSubmitGymZone: SingleHandler<GymZoneFormFields> = async (
    formData
  ) => {
    setGymZoneDialog(null);
    onPushLoading();

    try {
      // The data should include the gym
      const created = await poster<GymZoneDTO>(
        `/virtual-gyms/${formData.virtualGym}/gym-zones`,
        { ...formData, gym: user.gym.id }
      );

      // Mutate the state once the virtual gym has been created
      await mutate(
        { ...data, gymZones: [...data.gymZones, created] } as VirtualGymDTO,
        false
      );

      onSuccess('Gym zone created!');
    } catch (e) {
      onError(`${e}`);
    }

    onPopLoading();
  };

  if (error) {
    onError(`${error}`);
  }

  useEffect(() => {
    if (!data && !loading) {
      onPushLoading();
    } else if (data && loading) {
      onPopLoading();
    }
  }, [data, loading, onPopLoading, onPushLoading]);

  return (
    <>
      <PageHeader
        title="Virtual gym"
        breadcrumbs={[
          { href: '/virtual-gyms', label: 'Virtual gyms' },
          { href: '/virtual-gyms/id', label: 'Virtual gym name' }
        ]}
      />

      <GymZoneGrid
        addButtonTitle="add-class-gym-zone"
        header="Class gym zones"
        href={`/virtual-gyms/${router.query.id}/gym-zones`}
        gymZones={classGymZones}
        onAddGymZone={handleOnAddGymZone(true)}
      />

      <GymZoneGrid
        addButtonTitle="add-non-class-gym-zone"
        header="Non-class gym zones"
        gymZones={nonClassGymZones}
        onAddGymZone={handleOnAddGymZone(false)}
      />

      <GymZoneDialog
        open={!!gymZoneDialog}
        title="Create gym zone"
        defaultValues={gymZoneDialog ?? {}}
        onClose={handleOnCloseDialog}
        onSubmit={handleOnSubmitGymZone}
      />
    </>
  );
};

VirtualGym.getLayout = (page: ReactElement) => (
  <GeneralPages>
    <BaseLayout header="Gym name" selected="virtualGyms">
      {page}
    </BaseLayout>
  </GeneralPages>
);

export default VirtualGym;
