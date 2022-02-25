import React from 'react';

import { useForm } from 'react-hook-form';

import { Input } from '@hubbl/ui/components';
import { ChevronLeft, Login } from '@mui/icons-material';
import { Button, Stack, styled } from '@mui/material';
import { EmptyHandler, SingleHandler } from '@hubbl/shared/types';

export type StepTwoFields = {
  name: string;
  email: string;
  phone: string;
};

type StepTwoProps = {
  initialFormState: StepTwoFields;
  onBack: EmptyHandler;
  onBlur: SingleHandler<StepTwoFields>;
  onSubmit: SingleHandler<StepTwoFields>;
};

const BackButton = styled(Button)(({ theme }) => ({
  color: theme.palette.text.primary,
  width: 'fit-content',
  margin: 'auto',
  paddingRight: theme.spacing(2),
  paddingLeft: theme.spacing(1.5)
}));

const StepTwo = ({
  initialFormState,
  onBack,
  onBlur,
  onSubmit
}: StepTwoProps): JSX.Element => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    getValues
  } = useForm<StepTwoFields>({
    defaultValues: initialFormState,
    shouldFocusError: false,
    shouldUnregister: false
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack direction="column" gap={{ xs: 2, sm: 4 }}>
        <Input
          label="Gym name"
          placeholder="Fantagym"
          registerResult={register('name', {
            required: true,
            onBlur: () => onBlur(getValues())
          })}
          type="text"
          error={!!errors.name}
          fullWidth
        />

        <Stack direction="row" gap={3}>
          <Input
            label="Gym email"
            placeholder="gym.name@info.com"
            registerResult={register('email', {
              required: true,
              onBlur: () => onBlur(getValues())
            })}
            type="email"
            error={!!errors.email}
            fullWidth
          />

          <Input
            label="Gym phone"
            placeholder="000 000 000"
            type="tel"
            registerResult={register('phone', {
              required: true,
              onBlur: () => onBlur(getValues())
            })}
            error={!!errors.phone}
            fullWidth
          />
        </Stack>

        <Stack direction="column" gap={1.5}>
          <Button startIcon={<Login />} type="submit">
            Sign up
          </Button>

          <BackButton
            startIcon={<ChevronLeft />}
            color="secondary"
            variant="text"
            onClick={onBack}
          >
            Go back
          </BackButton>
        </Stack>
      </Stack>
    </form>
  );
};

export default StepTwo;
