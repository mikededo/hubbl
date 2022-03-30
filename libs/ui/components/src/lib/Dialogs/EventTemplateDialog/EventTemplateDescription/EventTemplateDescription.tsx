import { useFormContext } from 'react-hook-form';

import Input from '../../../Input';
import { EventTemplateFormFields } from '../../types';

const EventTemplateName = (): JSX.Element => {
  const {
    register,
    formState: { errors }
  } = useFormContext<EventTemplateFormFields>();

  return (
    <Input
      label="Description"
      placeholder="New event template description"
      title="event-template-description"
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

export default EventTemplateName;
