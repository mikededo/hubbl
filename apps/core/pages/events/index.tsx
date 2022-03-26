import { ReactElement } from 'react';

import { PageHeader } from '@hubbl/ui/components';

import { BaseLayout, GeneralPages } from '../../components';

const VirtualGyms = () => (
  <>
    <PageHeader title="Events" breadcrumbs={[{ href: '/', label: 'Events' }]} />
  </>
);

export default VirtualGyms;

VirtualGyms.getLayout = (page: ReactElement) => (
  <GeneralPages>
    <BaseLayout header="Gym name" selected="events" expanded>
      {page}
    </BaseLayout>
  </GeneralPages>
);
