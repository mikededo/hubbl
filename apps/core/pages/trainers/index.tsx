import { ReactElement, useState } from 'react';

import useSWR from 'swr';

import { useAppContext, useToastContext } from '@hubbl/data-access/contexts';
import { TrainerDTO } from '@hubbl/shared/models/dto';
import { EmptyHandler, SingleHandler } from '@hubbl/shared/types';
import {
  PageHeader,
  ParsedTrainerFormFields,
  TrainerFormFields,
  Table,
  TrainerDialog
} from '@hubbl/ui/components';

import { BaseLayout, Pages, PersonnelPages } from '../../components';

/**
 * Parses the given trainer to the default values of the form
 */
const trainerToDefaultValues = (
  trainer: TrainerDTO<number>
): Partial<TrainerFormFields> => ({
  ...trainer,
  tags: trainer.tags.map(({ id }) => id)
});

type PosterResponse = { trainer: TrainerDTO<number> };

type TrainerDialogState = {
  /**
   * Whether the modal is opened or not
   */
  status: 'create' | 'edit' | undefined;

  /**
   * Trainer selected if editing
   */
  trainer?: TrainerDTO<number>;
};

const InitialTrainerDialogState: TrainerDialogState = {
  status: null,
  trainer: null
};

const Trainers = () => {
  const {
    token,
    user,
    API: { fetcher, poster, putter }
  } = useAppContext();
  const { onSuccess, onError } = useToastContext();

  const [trainerDialog, setTrainerDialog] = useState<TrainerDialogState>(
    InitialTrainerDialogState
  );

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

  const handleOnOpenTrainerDialog: EmptyHandler = () => {
    setTrainerDialog({ status: 'create', trainer: null });
  };

  const handleOnTrainerClick: SingleHandler<TrainerDTO<number>> = (trainer) => {
    setTrainerDialog({ status: 'edit', trainer });
  };

  const handleOnCloseTrainerDialog: EmptyHandler = () => {
    setTrainerDialog(InitialTrainerDialogState);
  };

  const handleOnSumbitTrainerDialog: SingleHandler<
    ParsedTrainerFormFields
  > = async (formData) => {
    setTrainerDialog(InitialTrainerDialogState);

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

  const handleOnUpdateTrainer: SingleHandler<ParsedTrainerFormFields> = async (
    formData
  ) => {
    const { id } = trainerDialog.trainer;
    setTrainerDialog(InitialTrainerDialogState);

    try {
      // Find element to update
      const updated = {
        ...data.find(({ id: trainerId }) => id === trainerId),
        ...formData,
        id,
        tags: formData.tags.map((tag) => ({ ...tag, gym: user.gym.id })),
        gym: user.gym.id
      };

      await putter<TrainerDTO<number>>('/persons/trainer', updated);

      await mutate(
        data.map((trainer) =>
          trainer.id === id ? updated : trainer
        ) as TrainerDTO<number>[],
        false
      );

      onSuccess('Trainer updated successfully!');
    } catch (e) {
      onError(`${e.response.data.message}`);
    }
  };

  return (
    <>
      <PageHeader
        title="Trainers"
        breadcrumbs={[{ label: 'Trainers', href: '/trainers' }]}
      />

      <Table
        addItemTitle="add-trainer"
        header={<Pages.Trainers.TableHeader />}
        firstPage={!page || !data}
        lastPage={!data?.length || 15 - data?.length !== 0}
        onNextPage={handleOnNextPage}
        onPrevPage={handleOnPrevPage}
        onAddItem={handleOnOpenTrainerDialog}
      >
        {data?.map((trainer) => (
          <Pages.Trainers.TableRow
            key={trainer.id}
            trainer={trainer}
            onClick={handleOnTrainerClick}
          />
        ))}
      </Table>

      <TrainerDialog
        title={`${
          trainerDialog.status === 'create' ? 'Create' : 'Edit'
        } a trainer`}
        open={!!trainerDialog.status}
        defaultValues={
          trainerDialog.trainer
            ? trainerToDefaultValues(trainerDialog.trainer)
            : undefined
        }
        onClose={handleOnCloseTrainerDialog}
        onSubmit={
          trainerDialog.status === 'create'
            ? handleOnSumbitTrainerDialog
            : handleOnUpdateTrainer
        }
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
