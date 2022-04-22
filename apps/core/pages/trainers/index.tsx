import { ReactElement, useState } from 'react';

import useSWR from 'swr';

import { useAppContext } from '@hubbl/data-access/contexts';
import { TrainerDTO } from '@hubbl/shared/models/dto';
import { PageHeader, Table } from '@hubbl/ui/components';

import { BaseLayout, Pages, PersonnelPages } from '../../components';

const Trainers = () => {
  const {
    token,
    API: { fetcher }
  } = useAppContext();

  const [page, setPage] = useState(0);

  const { data } = useSWR<TrainerDTO<number>[]>(
    token.parsed ? `/persons/trainers?skip=${page * 15}` : null,
    fetcher
  );

  const handleOnNextPage = () => {
    setPage((prev) => prev + 1);
  };

  const handleOnPrevPage = () => {
    setPage((prev) => Math.max(prev - 1, 0));
  };

  return (
    <>
      <PageHeader
        title="Trainers"
        breadcrumbs={[{ label: 'Trainers', href: '/trainers' }]}
      />

      <Table
        header={<Pages.Trainers.TableHeader />}
        firstPage={!page || !data}
        lastPage={!data?.length || 15 - data?.length !== 0}
        onNextPage={handleOnNextPage}
        onPrevPage={handleOnPrevPage}
      >
        {data?.map((trainer) => (
          <Pages.Trainers.TableRow key={trainer.id} trainer={trainer} />
        ))}
      </Table>
    </>
  );
};

export default Trainers;

Trainers.getLayout = (page: ReactElement) => (
  <PersonnelPages>
    <BaseLayout header="Trainers" selected="trainers">
      {page}
    </BaseLayout>
  </PersonnelPages>
);
