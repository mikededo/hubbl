import { ReactElement, useState } from 'react';

import useSWR from 'swr';

import { useAppContext } from '@hubbl/data-access/contexts';
import { ClientDTO } from '@hubbl/shared/models/dto';
import { PageHeader, Table } from '@hubbl/ui/components';

import { BaseLayout, Pages, PersonnelPages } from '../../components';

const Clients = (): JSX.Element => {
  const {
    token,
    API: { fetcher }
  } = useAppContext();

  const [page, setPage] = useState(0);

  const handleOnNextPage = () => {
    setPage((prev) => prev + 1);
  };

  const handleOnPrevPage = () => {
    setPage((prev) => Math.max(prev - 1, 0));
  };

  const { data } = useSWR<ClientDTO<number>[]>(
    token.parsed ? `/persons/clients?skip=${page * 15}` : null,
    fetcher,
    { revalidateOnFocus: false }
  );

  return (
    <>
      <PageHeader
        title="Clients"
        breadcrumbs={[{ label: 'Clients', href: '/clients' }]}
      />

      <Table
        header={<Pages.Clients.TableHeader />}
        firstPage={!page || !data}
        lastPage={!data?.length || 15 - data?.length !== 0}
        onNextPage={handleOnNextPage}
        onPrevPage={handleOnPrevPage}
      >
        {data?.map((client) => (
          <Pages.Clients.TableRow key={client.id} client={client} />
        ))}
      </Table>
    </>
  );
};

export default Clients;

Clients.getLayout = (page: ReactElement) => (
  <PersonnelPages>
    <BaseLayout header="Clients" selected="clients">
      {page}
    </BaseLayout>
  </PersonnelPages>
);
