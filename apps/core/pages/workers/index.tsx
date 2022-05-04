import { ReactElement, useState } from 'react';

import useSWR from 'swr';

import { useAppContext, useToastContext } from '@hubbl/data-access/contexts';
import { WorkerDTO } from '@hubbl/shared/models/dto';
import { EmptyHandler, SingleHandler } from '@hubbl/shared/types';
import {
  PageHeader,
  Table,
  WorkerDialog,
  WorkerFormFields
} from '@hubbl/ui/components';

import { BaseLayout, Pages, PersonnelPages } from '../../components';

type PosterResponse = { worker: WorkerDTO<number> };

type WorkerDialogState = {
  /**
   * Whether the modal is opened or not
   */
  status: 'create' | 'edit' | undefined;

  /**
   * Worker selected if editing
   */
  worker?: WorkerDTO<number>;
};

const InitialWorkerDialogState: WorkerDialogState = {
  status: null,
  worker: null
};

const { WorkerPermissionsViewer } = Pages.Workers;

const Workers = (): JSX.Element => {
  const {
    token,
    user,
    API: { fetcher, poster, putter }
  } = useAppContext();
  const { onSuccess, onError } = useToastContext();

  const [workerDialog, setWorkerDialog] = useState<WorkerDialogState>(
    InitialWorkerDialogState
  );

  const [page, setPage] = useState(0);
  const [selectedWorker, setSelectedWorker] = useState<WorkerDTO<number>>(null);

  const { data, mutate, error } = useSWR<WorkerDTO<number>[]>(
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

  const handleOnOpenWorkerDialog: EmptyHandler = () => {
    setWorkerDialog({ status: 'create', worker: null });
  };

  const handleOnCloseWorkerDialog: EmptyHandler = () => {
    setWorkerDialog(InitialWorkerDialogState);
  };

  const handleOnUnselectWorker = () => {
    setSelectedWorker(null);
  };

  const handleOnWorkerEdit: EmptyHandler = () => {
    setWorkerDialog({ status: 'edit', worker: selectedWorker });
  };

  const handleOnSubmitWorker: SingleHandler<WorkerFormFields> = async (
    formData
  ) => {
    setWorkerDialog(InitialWorkerDialogState);

    try {
      const { worker: created } = await poster<PosterResponse>(
        '/persons/worker',
        { ...formData, password: user.gym.code, gym: user.gym.id }
      );

      // Update the worker being visualised
      setSelectedWorker(created);

      // Update the mutate if the table is not full
      if (data.length !== 15) {
        await mutate([...data, created], false);
      }

      onSuccess('Worker created!');
    } catch (e) {
      onError(e);
    }
  };

  const handleOnUpdateWorker: SingleHandler<WorkerFormFields> = async (
    formData
  ) => {
    const { id } = workerDialog.worker;
    setWorkerDialog(InitialWorkerDialogState);

    try {
      // Find element to update
      const updated = {
        ...data.find(({ id: workerId }) => id === workerId),
        ...formData,
        id,
        gym: user.gym.id
      };

      await putter<WorkerDTO<number>>('/persons/worker', updated);

      // Update the worker being visualised
      setSelectedWorker(updated as WorkerDTO<number>);

      await mutate(
        data.map((worker) =>
          worker.id === id ? updated : worker
        ) as WorkerDTO<number>[],
        false
      );

      onSuccess('Worker updated successfully!');
    } catch (e) {
      onError(`${e.response.data.message}`);
    }
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
        onAddItem={handleOnOpenWorkerDialog}
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
        onEditClick={handleOnWorkerEdit}
        onUnselectClick={handleOnUnselectWorker}
      />

      <WorkerDialog
        title={`${
          workerDialog.status === 'create' ? 'Create' : 'Edit'
        } a worker`}
        open={!!workerDialog.status}
        defaultValues={workerDialog.worker ? workerDialog.worker : undefined}
        onClose={handleOnCloseWorkerDialog}
        onSubmit={
          workerDialog.status === 'create'
            ? handleOnSubmitWorker
            : handleOnUpdateWorker
        }
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
