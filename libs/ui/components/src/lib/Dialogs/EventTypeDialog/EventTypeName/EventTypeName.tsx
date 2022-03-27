import { useFormContext } from 'react-hook-form';

import Input from '../../../Input';
import { EventTypeFormFields } from '../../types';

const EventTypeName = (): JSX.Element => {
  const {
    register,
    formState: { errors }
  } = useFormContext<EventTypeFormFields>();

  return (
    <Input
      label="Event type name"
      title="event-type-name"
      placeholder="New name"
      type="text"
      registerResult={register('name', { required: true })}
      error={!!errors.name}
      fullWidth
    />
  );
};

export default EventTypeName;
