import { ReactElement } from 'react';

import { PageHeader } from '@hubbl/ui/components';

import { BaseLayout, GeneralPages } from '../../components';

const VirtualGyms = () => (
  <>
    <PageHeader
      title="Virtual gyms"
      breadcrumbs={[{ href: '/', label: 'Virtual Gyms' }]}
    />
  </>
);

export default VirtualGyms;

VirtualGyms.getLayout = (page: ReactElement) => (
  <GeneralPages>
    <BaseLayout header="Gym name" selected="virtualGyms" expanded>
      {page}
    </BaseLayout>
  </GeneralPages>
);
