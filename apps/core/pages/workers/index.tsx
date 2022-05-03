import { ReactElement, useState } from 'react';

import useSWR from 'swr';

import { useAppContext, useToastContext } from '@hubbl/data-access/contexts';
import { WorkerDTO } from '@hubbl/shared/models/dto';
import { PageHeader, Table } from '@hubbl/ui/components';

import { BaseLayout, Pages, PersonnelPages } from '../../components';
import { SingleHandler } from '@hubbl/shared/types';

const { WorkerPermissionsViewer } = Pages.Workers;

const Workers = (): JSX.Element => {
  const {
    token,
    API: { fetcher }
  } = useAppContext();
  const { onError } = useToastContext();

  const [page, setPage] = useState(0);
  const [selectedWorker, setSelectedWorker] = useState<WorkerDTO<number>>(null);

  const { data, error } = useSWR<WorkerDTO<number>[]>(
    token.parsed ? `/persons/workers?skip=${page * 15}` : null,
    fetcher,
    { revalidateOnFocus: false }
  );

  if (error) {
    onError(error);
  }

  const handleOnNextPage = () => {
    setPage((prev) => prev + 1);
  };

  const handleOnPrevPage = () => {
    setPage((prev) => Math.max(prev - 1, 0));
  };

  const handleOnSelectWorker: SingleHandler<WorkerDTO<number>> = (worker) => {
    setSelectedWorker((prev) => {
      if (!prev) {
        return worker;
      }

      return prev.id === worker.id ? prev : worker;
    });
  };

  const handleOnUnselectWorker = () => {
    setSelectedWorker(null);
  };

  return (
    <>
      <PageHeader
        title="Workers"
        breadcrumbs={[{ label: 'Workers', href: '/' }]}
      />

      <Table
        addItemTitle="add-worker"
        header={<Pages.Workers.TableHeader />}
        firstPage={!page || !data}
        lastPage={!data?.length || 15 - data?.length !== 0}
        onNextPage={handleOnNextPage}
        onPrevPage={handleOnPrevPage}
      >
        {data?.map((worker) => (
          <Pages.Workers.TableRow
            key={worker.id}
            worker={worker}
            onClick={handleOnSelectWorker}
          />
        ))}
      </Table>

      <WorkerPermissionsViewer
        worker={selectedWorker}
        onUnselectClick={handleOnUnselectWorker}
      />
    </>
  );
};

export default Workers;

Workers.getLayout = (page: ReactElement) => (
  <PersonnelPages>
    <BaseLayout header="Workers" selected="workers">
      {page}
    </BaseLayout>
  </PersonnelPages>
);
