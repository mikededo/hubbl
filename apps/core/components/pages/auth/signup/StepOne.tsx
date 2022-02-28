import React from 'react';

import { useForm } from 'react-hook-form';

import { Input } from '@hubbl/ui/components';
import { Button, Stack } from '@mui/material';
import { SingleHandler } from '@hubbl/shared/types';

export type StepOneFields = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

type StepOneProps = {
  initialFormState: StepOneFields;
  onSubmit: SingleHandler<StepOneFields>;
};

const StepOne = ({ initialFormState, onSubmit }: StepOneProps): JSX.Element => {
  const {
    register,
    formState: { errors },
    handleSubmit
  } = useForm<StepOneFields>({
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

        <Button type="submit">Continue</Button>
      </Stack>
    </form>
  );
};

export default StepOne;
