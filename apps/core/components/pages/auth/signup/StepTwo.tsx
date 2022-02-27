import React from 'react';

import { useForm } from 'react-hook-form';

import { Input } from '@hubbl/ui/components';
import { ChevronLeft, Login } from '@mui/icons-material';
import {
  Button,
  CircularProgress,
  Stack,
  styled,
  Typography
} from '@mui/material';
import { EmptyHandler, SingleHandler } from '@hubbl/shared/types';
import { AnimatePresence } from 'framer-motion';

export type StepTwoFields = {
  name: string;
  email: string;
  phone: string;
};

type StepTwoProps = {
  disabled: boolean;
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

const SignUpButton = styled(Button)(({ theme }) => ({
  height: theme.spacing(5)
}));

const StepTwo = ({
  disabled,
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
          disabled={disabled}
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
            disabled={disabled}
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
            disabled={disabled}
            fullWidth
          />
        </Stack>

        <Stack direction="column" gap={1.5}>
          <SignUpButton
            startIcon={disabled ? null : <Login />}
            type="submit"
            title="submit"
            disabled={disabled}
          >
            <AnimatePresence>
              {disabled ? (
                <CircularProgress size="1.5rem" thickness={4} />
              ) : (
                <Typography variant="button">Sign up</Typography>
              )}
            </AnimatePresence>
          </SignUpButton>

          <BackButton
            disabled={disabled}
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
