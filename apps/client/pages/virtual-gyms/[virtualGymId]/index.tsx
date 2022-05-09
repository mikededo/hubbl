import { ReactElement } from 'react';

import { useRouter } from 'next/router';

import { PageHeader } from '@hubbl/ui/components';

import { BaseLayout, GeneralPages } from '../../../components';

const VirtualGym = () => {
  const router = useRouter();

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
