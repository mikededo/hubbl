import { PageHeader } from '@hubbl/ui/components';
import { ReactElement } from 'react';
import { BaseLayout, PersonnelPages } from '../../components';

const Workers = (): JSX.Element => (
  <>
    <PageHeader
      title="Workers"
      breadcrumbs={[{ label: 'Workers', href: '/' }]}
    />
  </>
);

export default Workers;

Workers.getLayout = (page: ReactElement) => (
  <PersonnelPages>
    <BaseLayout header="Workers" selected="workers">
      {page}
    </BaseLayout>
  </PersonnelPages>
);
