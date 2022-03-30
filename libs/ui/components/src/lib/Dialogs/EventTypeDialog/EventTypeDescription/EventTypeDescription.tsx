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
      label="Description"
      placeholder="New event type description"
      title="event-type-description"
      type="textarea"
      registerResult={register('description', {
        required: true,
        maxLength: 255
      })}
      rows={4}
      error={!!errors.description}
      multiline
      fullWidth
    />
  );
};

export default EventTypeName;
