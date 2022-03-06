import React, { useEffect } from 'react';

import { FormProvider, useForm } from 'react-hook-form';

import { Gender as GenderEnum, SingleHandler } from '@hubbl/shared/types';
import { Save } from '@mui/icons-material';
import { Stack, Typography } from '@mui/material';
import { styled } from '@mui/system';

import LoadingButton from '../../LoadingButton';
import { SettingsCard } from '../Common';
import {
  Email,
  EmailConfirmation,
  FirstName,
  Gender,
  LastName,
  Phone,
  RequiredUserInfoFields,
  SettingsUserInfoFields
} from './Form';

const SaveButton = styled(LoadingButton)({ alignSelf: 'flex-end' });

type SettingsUserInfoProps = {
  /**
   * Optional initial fields of the form. Otherwise, empty strings are
   * used
   *
   * @default undefined
   */
  defaultValues?: RequiredUserInfoFields;

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
  onSubmit?: SingleHandler<RequiredUserInfoFields>;
};

const SettingsUserInfo = ({
  defaultValues,
  loading = false,
  onSubmit
}: SettingsUserInfoProps) => {
  const methods = useForm<SettingsUserInfoFields>({
    defaultValues: { gender: GenderEnum.OTHER, ...defaultValues },
    shouldFocusError: false,
    shouldUnregister: false
  });

  /**
   * Calls onSubmit, if any, only with the required fields
   */
  const handleOnSubmit = (data: SettingsUserInfoFields) => {
    const { emailConfirmation, ...required } = data;
    onSubmit?.(required);
  };

  useEffect(() => {
    if (defaultValues) {
      methods.reset({
        ...defaultValues,
        emailConfirmation: defaultValues.email
      });
    }
  }, [defaultValues, methods]);

  return (
    <SettingsCard as="form" onSubmit={methods.handleSubmit(handleOnSubmit)}>
      <Typography variant="h6">Basic information</Typography>

      <FormProvider {...methods}>
        <Stack gap={2} width="100%">
          <Stack
            gap={{ xs: 2, sm: 2, md: 3 }}
            direction={{ xs: 'column', sm: 'column', md: 'row' }}
          >
            <FirstName disabled={loading} />
            <LastName disabled={loading} />
          </Stack>

          <Stack
            gap={{ xs: 2, sm: 2, md: 3 }}
            direction={{ xs: 'column', sm: 'column', md: 'row' }}
          >
            <Email disabled={loading} />
            <EmailConfirmation disabled={loading} />
          </Stack>

          <Stack
            gap={{ xs: 2, sm: 2, md: 3 }}
            direction={{ xs: 'column', sm: 'column', md: 'row' }}
          >
            <Phone disabled={loading} />
            <Gender disabled={loading} />
          </Stack>
        </Stack>
      </FormProvider>

      <SaveButton
        label="Save"
        loading={loading}
        type="submit"
        startIcon={<Save />}
      />
    </SettingsCard>
  );
};

export default SettingsUserInfo;
