import { useFormContext } from 'react-hook-form';

import Input from '../../../Input';
import { PersonFormFields } from '../../types';

const PersonFirstName = (): JSX.Element => {
  const {
    register,
    formState: { errors }
  } = useFormContext<PersonFormFields>();

  return (
    <Input
      label="First name"
      title="person-first-name"
      placeholder="John"
      type="text"
      registerResult={register('firstName', { required: true })}
      error={!!errors.firstName}
      fullWidth
    />
  );
};

export default PersonFirstName;
