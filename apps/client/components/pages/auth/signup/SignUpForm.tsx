import React from 'react';

import { useForm } from 'react-hook-form';

import { Input } from '@hubbl/ui/components';
import { Button, Stack } from '@mui/material';
import { SingleHandler } from '@hubbl/shared/types';

export type SignUpFormFields = {
  /**
   * First name of the client
   */
  firstName: string;

  /**
   * Last name of the client
   */
  lastName: string;

  /**
   * Email of the client
   */
  email: string;

  /**
   * Password of the client
   */
  password: string;

  /**
   * Gym code in which the user will be registered to
   */
  code: string;
};

type SignUpFormProps = {
  initialFormState: SignUpFormFields;
  onSubmit: SingleHandler<SignUpFormFields>;
};

const SignUpForm = ({
  initialFormState,
  onSubmit
}: SignUpFormProps): JSX.Element => {
  const {
    register,
    formState: { errors },
    handleSubmit
  } = useForm<SignUpFormFields>({
    defaultValues: initialFormState,
    shouldFocusError: false,
    shouldUnregister: false
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack direction="column" gap={{ xs: 2, sm: 4 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} gap={{ xs: 2, sm: 3 }}>
          <Input
            label="First name"
            placeholder="John"
            type="text"
            registerResult={register('firstName', { required: true })}
            error={!!errors.firstName}
          />

          <Input
            label="Last name"
            placeholder="Doe"
            type="text"
            registerResult={register('lastName', { required: true })}
            error={!!errors.lastName}
          />
        </Stack>

        <Input
          label="Email"
          placeholder="john.doe@domain.com"
          registerResult={register('email', { required: true })}
          type="email"
          error={!!errors.email}
          fullWidth
        />

        <Input
          label="Password"
          placeholder="At least 8 characters!"
          type="password"
          registerResult={register('password', {
            required: true,
            minLength: 8
          })}
          error={!!errors.password}
          fullWidth
        />

        <Input
          label="Gym code"
          placeholder="Your gym should provide you this code!"
          registerResult={register('code', { required: true })}
          type="text"
          error={!!errors.code}
          fullWidth
        />

        <Button type="submit">Register</Button>
      </Stack>
    </form>
  );
};

export default SignUpForm;
