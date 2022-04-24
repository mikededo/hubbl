import { useFormContext } from 'react-hook-form';

import Input from '../../../Input';
import { PersonFormFields } from '../../types';

const PersonLastName = (): JSX.Element => {
  const {
    register,
    formState: { errors }
  } = useFormContext<PersonFormFields>();

  return (
    <Input
      label="Last name"
      title="person-last-name"
      placeholder="Doe"
      type="text"
      registerResult={register('lastName', { required: true })}
      error={!!errors.lastName}
      fullWidth
    />
  );
};

export default PersonLastName;
