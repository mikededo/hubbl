import { isTimeBefore } from '@hubbl/utils';
import { useFormContext } from 'react-hook-form';

import TimeInput from '../../../TimeInput';
import { VirtualGymFormFields } from '../../types';

const VirtualGymOpenTime = (): JSX.Element => {
  const {
    getValues,
    register,
    formState: { errors }
  } = useFormContext<VirtualGymFormFields>();

  return (
    <TimeInput
      label="Open time"
      title="virtual-gym-open-time"
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

export default VirtualGymOpenTime;
