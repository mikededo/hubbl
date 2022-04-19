import { PageHeader } from '@hubbl/ui/components';
import { ReactElement } from 'react';

import { BaseLayout, PersonnelPages } from '../../components';

const Trainers = () => (
  <>
    <PageHeader
      title="Trainers"
      breadcrumbs={[{ label: 'Trainers', href: '/trainers' }]}
    />
  </>
);

export default Trainers;

Trainers.getLayout = (page: ReactElement) => (
  <PersonnelPages>
    <BaseLayout header="Trainers" selected="trainers">
      {page}
    </BaseLayout>
  </PersonnelPages>
);
