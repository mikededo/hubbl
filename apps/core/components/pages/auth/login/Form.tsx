import { SingleHandler } from '@hubbl/shared/types';
import { Input, LoadingButton } from '@hubbl/ui/components';
import { Login } from '@mui/icons-material';
import { Stack } from '@mui/material';
import { useForm } from 'react-hook-form';

export type SignInFields = {
  email: string;
  password: string;
};

type SignInFormProps = {
  onSubmit: SingleHandler<SignInFields>;
};

const Form = ({ onSubmit }: SignInFormProps): JSX.Element => {
  const {
    register,
    formState: { errors },
    handleSubmit
  } = useForm<SignInFields>({
    shouldFocusError: false
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack direction="column" gap={{ xs: 2, sm: 4 }}>
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
