import { useFormContext } from 'react-hook-form';

import TimeInput from '../../../TimeInput';
import { VirtualGymFormFields } from '../../types';

const VirtualGymCloseTime = (): JSX.Element => {
  const { register } = useFormContext<VirtualGymFormFields>();

  return (
    <TimeInput
      label="Close time"
      title="virtual-gym-close-time"
      placeholder="09:00"
      type="text"
      registerResult={register('closeTime', { required: true })}
      fullWidth
    />
  );
};

export default VirtualGymCloseTime;
