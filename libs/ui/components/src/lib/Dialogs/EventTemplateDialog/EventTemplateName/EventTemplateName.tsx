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
      label="Event template name"
      title="event-template-name"
      placeholder="New name"
      type="text"
      registerResult={register('name', { required: true })}
      error={!!errors.name}
      fullWidth
    />
  );
};

export default EventTemplateName;
