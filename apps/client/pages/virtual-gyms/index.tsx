import { ReactElement } from 'react';

import useSWR from 'swr';

import { useAppContext, useToastContext } from '@hubbl/data-access/contexts';
import { VirtualGymDTO } from '@hubbl/shared/models/dto';
import { PageHeader, VirtualGymList } from '@hubbl/ui/components';

import { BaseLayout, GeneralPages } from '../../components';

const VirtualGyms = () => {
  const { onError } = useToastContext();
  const {
    token,
    API: { fetcher }
  } = useAppContext();
  const { data, error } = useSWR<VirtualGymDTO[]>(
    token.parsed ? '/virtual-gyms' : null,
    fetcher,
    { revalidateOnFocus: false }
  );

  if (error) {
    onError(error);
  }

  return (
    <>
      <PageHeader
        title="Virtual gyms"
        breadcrumbs={[{ href: '/', label: 'Virtual Gyms' }]}
      />

      {data && <VirtualGymList virtualGyms={data} />}
    </>
  );
};

export default VirtualGyms;

VirtualGyms.getLayout = (page: ReactElement) => (
  <GeneralPages>
    <BaseLayout header="Gym name" selected="virtualGyms" expanded>
      {page}
    </BaseLayout>
  </GeneralPages>
);
