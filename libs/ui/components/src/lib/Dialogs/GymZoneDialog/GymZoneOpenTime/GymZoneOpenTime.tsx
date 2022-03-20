import { isTimeBefore } from '@hubbl/utils';
import { useFormContext } from 'react-hook-form';

import TimeInput from '../../../TimeInput';
import { GymZoneFormFields } from '../../types';

const GymZoneOpenTime = (): JSX.Element => {
  const {
    getValues,
    register,
    formState: { errors }
  } = useFormContext<GymZoneFormFields>();

  return (
    <TimeInput
      label="Open time"
      title="gym-zone-open-time"
      placeholder="09:00"
      type="text"
      registerResult={register('openTime', {
        required: true,
        validate: (value) => !isTimeBefore(value, getValues('openTime'))
      })}
      error={!!errors.openTime}
      fullWidth
    />
  );
};

export default GymZoneOpenTime;
