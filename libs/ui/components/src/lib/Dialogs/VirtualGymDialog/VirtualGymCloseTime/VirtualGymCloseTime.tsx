import { isTimeBefore } from '@hubbl/utils';
import { useFormContext } from 'react-hook-form';

import TimeInput from '../../../TimeInput';
import { VirtualGymFormFields } from '../../types';

const VirtualGymCloseTime = (): JSX.Element => {
  const { register, getValues } = useFormContext<VirtualGymFormFields>();

  return (
    <TimeInput
      label="Close time"
      title="virtual-gym-close-time"
      placeholder="23:00"
      type="text"
      registerResult={register('closeTime', {
        required: true,
        validate: (value) => isTimeBefore(value, getValues('openTime'))
      })}
      fullWidth
    />
  );
};

export default VirtualGymCloseTime;
