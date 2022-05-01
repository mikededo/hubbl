import { PageHeader } from '@hubbl/ui/components';
import { ReactElement } from 'react';

import { BaseLayout, PersonnelPages } from '../../components';

const Clients = (): JSX.Element => (
  <>
    <PageHeader
      title="Clients"
      breadcrumbs={[{ label: 'Clients', href: '/clients' }]}
    />
  </>
);

export default Clients;

Clients.getLayout = (page: ReactElement) => (
  <PersonnelPages>
    <BaseLayout header="Clients" selected="clients">
      {page}
    </BaseLayout>
  </PersonnelPages>
);
