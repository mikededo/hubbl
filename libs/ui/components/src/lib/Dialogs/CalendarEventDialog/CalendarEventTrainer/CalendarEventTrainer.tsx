import { useEffect, useState } from 'react';

import { useFormContext } from 'react-hook-form';

import { TrainerDTO } from '@hubbl/shared/models/dto';

import SelectInput, { SelectItem } from '../../../SelectInput';
import { CalendarEventFormFields } from '../../types';

export type CalendarEventTrainerProps = {
  /**
   * Trainer options of the select input
   */
  trainers?: TrainerDTO<number>[];
};

const CalendarEventTrainer = ({
  trainers
}: CalendarEventTrainerProps): JSX.Element => {
  const { control, getValues, setValue } =
    useFormContext<CalendarEventFormFields>();

  // Keep the state
  const [options, setOptions] = useState<TrainerDTO<number>[]>([]);

  const mapTrainers = (): SelectItem[] =>
    (trainers?.length ? trainers : options).map((t) => ({
      key: t.id,
      value: t.id,
      label: `${t.firstName} ${t.lastName}`
    }));

  useEffect(() => {
    if (trainers?.length) {
      setOptions(trainers);
      setValue(
        'trainer',
        getValues('trainer') ? getValues('trainer') : trainers[0].id
      );
    }
  }, [trainers, getValues, setValue]);

  return (
    <SelectInput
      control={control}
      formName="trainer"
      label="Trainer"
      placeholder="Select a trainer"
      inputProps={{ title: 'calendar-event-trainer' }}
      options={mapTrainers()}
      disabled={!trainers}
      required
    />
  );
};

export default CalendarEventTrainer;
