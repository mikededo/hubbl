import { useState } from 'react';

import { useAppContext, useToastContext } from '@hubbl/data-access/contexts';
import { TrainerDTO } from '@hubbl/shared/models/dto';
import { EmptyHandler, SingleHandler } from '@hubbl/shared/types';
import {
  DashboardTrainers as TrainersGrid,
  ParsedTrainerFormFields,
  TrainerDialog
} from '@hubbl/ui/components';

import { useDashboard } from './hooks';

type PosterResult = { trainer: TrainerDTO<number> };

const DashboardTrainers = () => {
  const {
    token,
    user,
    API: { fetcher, poster }
  } = useAppContext();
  const { onError, onSuccess } = useToastContext();

  const { data, mutate } = useDashboard({
    run: !!token.parsed,
    gymId: user?.gym?.id,
    fetcher
  });

  const [openDialog, setOpenDialog] = useState(false);

  const handleOnAddClick: EmptyHandler = () => {
    setOpenDialog(true);
  };

  const handleOnCloseDialog: EmptyHandler = () => {
    setOpenDialog(false);
  };

  const HandleOnSubmitTrainer: SingleHandler<ParsedTrainerFormFields> = async (
    formData
  ) => {
    setOpenDialog(false);

    try {
      const { trainer } = await poster<PosterResult>('/persons/trainer', {
        ...formData,
        gym: user.gym.id
      });

      await mutate({ ...data, trainers: [trainer, ...data.trainers] }, false);

      onSuccess('Trainer created!');
    } catch (e) {
      onError(e);
    }
  };

  return (
    <>
      {data ? (
        <TrainersGrid items={data.trainers} onAddTrainer={handleOnAddClick} />
      ) : null}

      <TrainerDialog
        open={openDialog}
        title="Create a trainer"
        onClose={handleOnCloseDialog}
        onSubmit={HandleOnSubmitTrainer}
      />
    </>
  );
};

export default DashboardTrainers;
