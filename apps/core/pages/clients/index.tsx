import { ReactElement, useState } from 'react';

import useSWR from 'swr';

import { useAppContext, useToastContext } from '@hubbl/data-access/contexts';
import { ClientDTO } from '@hubbl/shared/models/dto';
import { EmptyHandler, SingleHandler } from '@hubbl/shared/types';
import {
  ClientDialog,
  ClientFormFields,
  PageHeader,
  Table
} from '@hubbl/ui/components';

import { BaseLayout, Pages, PersonnelPages } from '../../components';

type PosterResponse = { client: ClientDTO<number> };

type ClientDialogState = {
  /**
   * Whether the modal is opened or not
   */
  status: 'create' | 'edit' | undefined;

  /**
   * Client selected if editing
   */
  client?: ClientDTO<number>;
};

const InitialClientDialogState: ClientDialogState = {
  status: null,
  client: null
};

const Clients = (): JSX.Element => {
  const {
    token,
    user,
    API: { fetcher, poster, putter }
  } = useAppContext();
  const { onSuccess, onError } = useToastContext();

  const [page, setPage] = useState(0);

  const [clientDialog, setClientDialog] = useState<ClientDialogState>(
    InitialClientDialogState
  );

  const { data, mutate } = useSWR<ClientDTO<number>[]>(
    token.parsed ? `/persons/clients?skip=${page * 15}` : null,
    fetcher,
    { revalidateOnFocus: false }
  );

  const handleOnNextPage = () => {
    setPage((prev) => prev + 1);
  };

  const handleOnPrevPage = () => {
    setPage((prev) => Math.max(prev - 1, 0));
  };

  const handleOnOpenClientDialog: EmptyHandler = () => {
    setClientDialog({ status: 'create', client: null });
  };

  const handleOnClientClick: SingleHandler<ClientDTO<number>> = (client) => {
    setClientDialog({ status: 'edit', client });
  };

  const handleOnCloseClientDialog: EmptyHandler = () => {
    setClientDialog(InitialClientDialogState);
  };

  const handleOnSumbitClientDialog: SingleHandler<ClientFormFields> = async (
    formData
  ) => {
    setClientDialog(InitialClientDialogState);

    try {
      const { client: created } = await poster<PosterResponse>(
        '/persons/client',
        { ...formData, password: user.gym.code, gym: user.gym.id }
      );

      // Update the mutate table only if the table is not filled already
      if (data.length !== 15) {
        await mutate([...data, created], false);
      }

      onSuccess('Client created!');
    } catch (e) {
      onError(`${e}`);
    }
  };

  const handleOnUpdateClient: SingleHandler<ClientFormFields> = async (
    formData
  ) => {
    const { id } = clientDialog.client;
    setClientDialog(InitialClientDialogState);

    try {
      // Find element to update
      const updated = {
        ...data.find(({ id: clientId }) => id === clientId),
        ...formData,
        id,
        gym: user.gym.id
      };

      await putter<ClientDTO<number>>('/persons/client', updated);

      await mutate(
        data.map((client) =>
          client.id === id ? updated : client
        ) as ClientDTO<number>[],
        false
      );

      onSuccess('Client updated successfully!');
    } catch (e) {
      onError(`${e.response.data.message}`);
    }
  };

  return (
    <>
      <PageHeader
        title="Clients"
        breadcrumbs={[{ label: 'Clients', href: '/clients' }]}
      />

      <Table
        addItemTitle="add-client"
        header={<Pages.Clients.TableHeader />}
        firstPage={!page || !data}
        lastPage={!data?.length || 15 - data?.length !== 0}
        onNextPage={handleOnNextPage}
        onPrevPage={handleOnPrevPage}
        onAddItem={handleOnOpenClientDialog}
      >
        {data?.map((client) => (
          <Pages.Clients.TableRow
            key={client.id}
            client={client}
            onClick={handleOnClientClick}
          />
        ))}
      </Table>

      <ClientDialog
        code={user?.gym.code}
        title={`${
          clientDialog.status === 'create' ? 'Create' : 'Edit'
        } a client`}
        open={!!clientDialog.status}
        defaultValues={clientDialog.client ? clientDialog.client : undefined}
        onClose={handleOnCloseClientDialog}
        onSubmit={
          clientDialog.status === 'create'
            ? handleOnSumbitClientDialog
            : handleOnUpdateClient
        }
      />
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
