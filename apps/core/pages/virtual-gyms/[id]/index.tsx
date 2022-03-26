import { ReactElement, useEffect, useMemo } from 'react';

import { useRouter } from 'next/router';
import useSWR from 'swr';

import {
  useAppContext,
  useLoadingContext,
  useToastContext
} from '@hubbl/data-access/contexts';
import { VirtualGymDTO } from '@hubbl/shared/models/dto';
import { GymZoneGrid, PageHeader } from '@hubbl/ui/components';

import { BaseLayout, GeneralPages } from '../../../components';

const VirtualGym = () => {
  const router = useRouter();
  const { loading, onPopLoading, onPushLoading } = useLoadingContext();
  const { onError } = useToastContext();
  const {
    token,
    API: { fetcher }
  } = useAppContext();
  const { data, error } = useSWR<VirtualGymDTO>(
    token.parsed ? `/virtual-gyms/${router.query.id}` : null,
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

  useEffect(() => {
    if (!data && !loading) {
      onPushLoading();
    } else if (data && loading) {
      onPopLoading();
    }
  }, [data, loading, onPopLoading, onPushLoading]);

  if (error) {
    onError(`${error}`);
  }

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
        header="Class gym zones"
        href={`/virtual-gyms/${router.query.id}/gym-zones`}
        gymZones={classGymZones}
      />

      <GymZoneGrid header="Non-class gym zones" gymZones={nonClassGymZones} />
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
