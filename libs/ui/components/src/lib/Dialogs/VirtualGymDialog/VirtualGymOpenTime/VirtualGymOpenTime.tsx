import { useFormContext } from 'react-hook-form';

import TimeInput from '../../../TimeInput';
import { VirtualGymFormFields } from '../../types';

const VirtualGymOpenTime = (): JSX.Element => {
  const { register } = useFormContext<VirtualGymFormFields>();

  return (
    <TimeInput
      label="Open time"
      title="virtual-gym-open-time"
      placeholder="09:00"
      type="text"
      registerResult={register('openTime', { required: true })}
      fullWidth
    />
  );
};

export default VirtualGymOpenTime;
