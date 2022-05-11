import { ReactElement, useMemo } from 'react';

import { useRouter } from 'next/router';
import useSWR from 'swr';

import { useAppContext, useToastContext } from '@hubbl/data-access/contexts';
import { VirtualGymDTO } from '@hubbl/shared/models/dto';
import { GymZoneGrid, PageHeader, TodayEventsList } from '@hubbl/ui/components';

import { BaseLayout, GeneralPages } from '../../../components';

const VirtualGym = () => {
  const router = useRouter();

  const { onError } = useToastContext();
  const {
    token,
    todayEvents,
    API: { fetcher }
  } = useAppContext();
  const { data, error } = useSWR<VirtualGymDTO>(
    token.parsed ? `/virtual-gyms/${router.query.virtualGymId}` : null,
    fetcher
  );

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

  if (error) {
    onError(error);
    router.push('/404');
  }

  return (
    <>
      <PageHeader
        title="Virtual gym"
        breadcrumbs={[
          { href: '/virtual-gyms', label: 'Virtual gyms' },
          {
            href: `/virtual-gyms/${router.query.virtualGymId}`,
            label: 'Virtual gym name'
          }
        ]}
      />

      <GymZoneGrid
        addButtonTitle="add-class-gym-zone"
        header="Class gym zones"
        href={`/virtual-gyms/${router.query.virtualGymId}/gym-zones`}
        gymZones={classGymZones}
      />

      <GymZoneGrid
        addButtonTitle="add-non-class-gym-zone"
        header="Non-class gym zones"
        gymZones={nonClassGymZones}
      />

      <TodayEventsList events={todayEvents} />
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
