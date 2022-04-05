import { PageHeader } from '@hubbl/ui/components';
import { useRouter } from 'next/router';
import { ReactElement } from 'react';

import { BaseLayout, GeneralPages } from '../../../../../components';

const GymZone = () => {
  const router = useRouter();

  const virtualGymHref = `/virtual-gyms/${router.query.virtualGymId}`;
  const gymZoneHref = `${virtualGymHref}/gym-zones/${router.query.gymZoneId}`;

  return (
    <>
      <PageHeader
        title="Gym zone"
        breadcrumbs={[
          { href: '/virtual-gyms', label: 'Virtual gyms' },
          { href: virtualGymHref, label: 'Virtual gym name' },
          { href: gymZoneHref, label: 'Gym zone name' }
        ]}
      />
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
