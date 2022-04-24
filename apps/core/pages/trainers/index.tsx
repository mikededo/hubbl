import { ReactElement, useState } from 'react';

import useSWR from 'swr';

import { useAppContext, useToastContext } from '@hubbl/data-access/contexts';
import { TrainerDTO } from '@hubbl/shared/models/dto';
import { EmptyHandler, SingleHandler } from '@hubbl/shared/types';
import {
  PageHeader,
  ParsedTrainerFormFields,
  Table,
  TrainerDialog
} from '@hubbl/ui/components';

import { BaseLayout, Pages, PersonnelPages } from '../../components';

type PosterResponse = { trainer: TrainerDTO<number> };

const Trainers = () => {
  const {
    token,
    user,
    API: { fetcher, poster }
  } = useAppContext();
  const { onSuccess, onError } = useToastContext();

  const [page, setPage] = useState(0);

  const { data, mutate } = useSWR<TrainerDTO<number>[]>(
    token.parsed ? `/persons/trainers?skip=${page * 15}` : null,
    fetcher,
    { revalidateOnFocus: false }
  );

  const handleOnNextPage = () => {
    setPage((prev) => prev + 1);
  };

  const handleOnPrevPage = () => {
    setPage((prev) => Math.max(prev - 1, 0));
  };

  const [trainerDialog, setTrainerDialog] = useState(false);

  const handleOnOpenTrainerDialog: EmptyHandler = () => {
    setTrainerDialog(true);
  };

  const handleOnCloseTrainerDialog: EmptyHandler = () => {
    setTrainerDialog(false);
  };

  const handleOnSumbitTrainerDialog: SingleHandler<
    ParsedTrainerFormFields
  > = async (formData) => {
    setTrainerDialog(false);

    try {
      const { trainer: created } = await poster<PosterResponse>(
        '/persons/trainer',
        {
          ...formData,
          tags: formData.tags.map((tag) => ({ ...tag, gym: user.gym.id })),
          gym: user.gym.id
        }
      );

      // Update the mutate table only if the table is not filled already
      if (data.length !== 15) {
        await mutate([...data, created], false);
      }

      onSuccess('Trainer created!');
    } catch (e) {
      onError(`${e}`);
    }
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
        onAddItem={handleOnOpenTrainerDialog}
      >
        {data?.map((trainer) => (
          <Pages.Trainers.TableRow key={trainer.id} trainer={trainer} />
        ))}
      </Table>

      <TrainerDialog
        title="Create a trainer"
        open={trainerDialog}
        onClose={handleOnCloseTrainerDialog}
        onSubmit={handleOnSumbitTrainerDialog}
      />
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
