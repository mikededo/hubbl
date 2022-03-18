import { isTimeBefore } from '@hubbl/utils';
import { useFormContext } from 'react-hook-form';

import TimeInput from '../../../TimeInput';
import { GymZoneFormFields } from '../../types';

const GymZoneCloseTime = (): JSX.Element => {
  const {
    register,
    getValues,
    formState: { errors }
  } = useFormContext<GymZoneFormFields>();

  return (
    <TimeInput
      label="Close time"
      title="gym-zone-close-time"
      placeholder="23:00"
      type="text"
      registerResult={register('closeTime', {
        required: true,
        validate: (value) => isTimeBefore(value, getValues('openTime'))
      })}
      error={!!errors.closeTime}
      fullWidth
    />
  );
};

export default GymZoneCloseTime;
