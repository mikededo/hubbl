import { useForm } from 'react-hook-form';

import { EmptyHandler, SingleHandler } from '@hubbl/shared/types';
import {
  Save,
  VisibilityOffOutlined,
  VisibilityOutlined
} from '@mui/icons-material';
import {
  IconButton,
  InputAdornment,
  Stack,
  styled,
  Typography
} from '@mui/material';

import Input from '../../Input';
import LoadingButton from '../../LoadingButton';
import { SettingsCard } from '../Common';
import React, { useState } from 'react';

export type UserPasswordFields = { password: string };

const UpdateButton = styled(LoadingButton)({ alignSelf: 'flex-end' });

type UserPasswordFormFields = {
  /**
   * Value of the password to change
   */
  password: string;

  /**
   * Additional field to compare if the password written is correct
   */
  passwordConfirmation: string;
};

type SettingsUserPasswordProps = {
  /**
   * Whether the application is loading or not
   *
   * @default false
   */
  loading?: boolean;

  /**
   * Callback to run on when the form has been submitted. Returns
   * the values of the form
   *
   * @default undefined
   */
  onSubmit?: SingleHandler<UserPasswordFields>;
};

type EndAdornmentProps = {
  /**
   * Aria-label to attach to the icon button
   */
  label: string;

  /**
   * Whether the input is visible or not, which will toggle the icon
   * being displayed
   */
  visible: boolean;

  /**
   * Handler called when the icon button is clicked
   */
  onClick: EmptyHandler;
};

const EndAdornment = ({
  label,
  visible,
  onClick
}: EndAdornmentProps): JSX.Element => (
  <InputAdornment position="end">
    <IconButton aria-label={label} onClick={onClick}>
      {visible ? <VisibilityOutlined /> : <VisibilityOffOutlined />}
    </IconButton>
  </InputAdornment>
);

const SettingsUserPassword = ({
  loading = false,
  onSubmit
}: SettingsUserPasswordProps): JSX.Element => {
  const {
    getValues,
    formState: { errors },
    handleSubmit,
    register
  } = useForm<UserPasswordFormFields>({
    shouldFocusError: false,
    shouldUnregister: false
  });

  const [firstVisible, setFirstVisible] = useState(false);
  const [secondVisible, setSecondVisible] = useState(false);

  /**
   * Calls onSubmit, if any, only with the required fields
   */
  const handleOnSubmit = (data: UserPasswordFormFields) => {
    const { passwordConfirmation, ...required } = data;

    onSubmit?.(required);
  };

  /**
   * Curried function that toggles the boolean value of the
   * state that has been given
   */
  const handleOnToggleVisibility =
    (updater: React.Dispatch<React.SetStateAction<boolean>>) => () => {
      updater((prev) => !prev);
    };

  return (
    <SettingsCard as="form" onSubmit={handleSubmit(handleOnSubmit)}>
      <Typography variant="h6">Change password</Typography>

      <Stack
        gap={{ xs: 2, sm: 2, md: 3 }}
        direction={{ xs: 'column', sm: 'column', md: 'row' }}
        width="100%"
      >
        <Input
          label="Password"
          labelVariant="body1"
          type={firstVisible ? 'text' : 'password'}
          placeholder="At least 8 characters!"
          registerResult={register('password', {
            required: true,
            minLength: 8
          })}
          error={!!errors.password}
          disabled={loading}
          endAdornment={
            <EndAdornment
              label="password visibility"
              visible={firstVisible}
              onClick={handleOnToggleVisibility(setFirstVisible)}
            />
          }
        />

        <Input
          label="Password confirmation"
          labelVariant="body1"
          type={secondVisible ? 'text' : 'password'}
          placeholder="Repeat the password"
          registerResult={register('passwordConfirmation', {
            required: true,
            minLength: 8,
            validate: (value) => value === getValues('password')
          })}
          error={!!errors.passwordConfirmation}
          disabled={loading}
          endAdornment={
            <EndAdornment
              label="confirmation password visibility"
              visible={secondVisible}
              onClick={handleOnToggleVisibility(setSecondVisible)}
            />
          }
        />
      </Stack>

      <UpdateButton
        label="Update password"
        loading={loading}
        type="submit"
        startIcon={<Save />}
      />
    </SettingsCard>
  );
};

export default SettingsUserPassword;
