import { ReactElement } from 'react';

import { useRouter } from 'next/router';
import useSWR from 'swr';

import { useAppContext } from '@hubbl/data-access/contexts';
import { GymZoneDTO, VirtualGymDTO } from '@hubbl/shared/models/dto';
import { PageHeader, TodayEventsList } from '@hubbl/ui/components';

import { BaseLayout, GeneralPages } from '../../../../../components';

const GymZone = (): JSX.Element => {
  const router = useRouter();

  const {
    token,
    todayEvents,
    API: { fetcher }
  } = useAppContext();

  const virtualGymHref = `/virtual-gyms/${router.query.virtualGymId}`;
  const gymZoneHref = `${virtualGymHref}/gym-zones/${router.query.gymZoneId}`;

  const virtualGym = useSWR<VirtualGymDTO>(
    token.parsed && router.query.virtualGymId ? `${virtualGymHref}` : null,
    fetcher,
    { revalidateOnFocus: false }
  );

  const gymZone = useSWR<GymZoneDTO>(
    token.parsed && router.query.gymZoneId ? `${gymZoneHref}` : null,
    fetcher,
    { revalidateOnFocus: false }
  );

  // Use else if so router is only called once
  if (virtualGym.error) {
    router.push('/404');
  } else if (gymZone.error) {
    router.push('/404');
  }

  return (
    <>
      <PageHeader
        title={`Gym zone - ${gymZone.data?.name}`}
        breadcrumbs={[
          { href: '/virtual-gyms', label: 'Virtual gyms' },
          { href: virtualGymHref, label: virtualGym.data?.name },
          { href: gymZoneHref, label: gymZone.data?.name }
        ]}
      />

      <TodayEventsList events={todayEvents} />
    </>
  );
};

GymZone.getLayout = (page: ReactElement) => (
  <GeneralPages>
    <BaseLayout header="Gym name" selected="virtualGyms">
      {page}
    </BaseLayout>
  </GeneralPages>
);

export default GymZone;
