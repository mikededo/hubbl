import { useForm } from 'react-hook-form';

import { SingleHandler } from '@hubbl/shared/types';
import { Input, LoadingButton } from '@hubbl/ui/components';
import { Login } from '@mui/icons-material';
import { Stack } from '@mui/material';

import UserSwitch from './UserSwitch';

export type SignInFields = {
  email: string;
  password: string;
  owner: boolean;
};

const InitialFormState: SignInFields = {
  email: '',
  password: '',
  owner: true
};

type SignInFormProps = {
  onSubmit: SingleHandler<SignInFields>;
};

const Form = ({ onSubmit }: SignInFormProps): JSX.Element => {
  const {
    register,
    formState: { errors },
    getValues,
    handleSubmit,
    setValue,
    watch
  } = useForm<SignInFields>({
    defaultValues: InitialFormState,
    shouldFocusError: false
  });

  const handleOnClick = () => {
    setValue('owner', !getValues('owner'));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack direction="column" gap={{ xs: 2, sm: 4 }}>
        <UserSwitch owner={watch('owner')} onClick={handleOnClick} />

        <Input
          label="Email"
          placeholder="john.doe@domain.com"
          registerResult={register('email', { required: true })}
          type="email"
          error={!!errors.email}
          disabled={false}
          fullWidth
        />

        <Input
          label="Password"
          placeholder="At least 8 characters!"
          registerResult={register('password', {
            required: true,
            minLength: 8
          })}
          type="password"
          error={!!errors.password}
          disabled={false}
          fullWidth
        />

        <LoadingButton
          label="Log in"
          loading={false}
          startIcon={<Login />}
          type="submit"
          title="submit"
        />
      </Stack>
    </form>
  );
};

export default Form;
