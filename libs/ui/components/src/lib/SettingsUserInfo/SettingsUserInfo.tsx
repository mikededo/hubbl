import React, { useEffect } from 'react';

import { FormProvider, useForm } from 'react-hook-form';

import { Gender as GenderEnum, SingleHandler } from '@hubbl/shared/types';
import { Save } from '@mui/icons-material';
import { Stack, Typography } from '@mui/material';
import { styled } from '@mui/system';

import ContentCard from '../ContentCard';
import LoadingButton from '../LoadingButton';
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

const Content = styled(ContentCard)(({ theme }) => ({
  padding: theme.spacing(3),
  display: 'flex',
  alignItems: 'flex-start',
  flexDirection: 'column',
  gap: theme.spacing(3)
}));

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
   * Whether the input is loading or not
   *
   * @default false
   */
  loading?: boolean;

  /**
   * Callback to run on when the form has been submitted. Returns
   * the values of the form.
   *
   * @default undefined
   */
  onSubmit?: SingleHandler<RequiredUserInfoFields>;
};

const SettingsUserInfo = React.memo<SettingsUserInfoProps>(
  ({ defaultValues, loading = false, onSubmit }) => {
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
      <Content as="form" onSubmit={methods.handleSubmit(handleOnSubmit)}>
        <Typography variant="h6">Basic information</Typography>

        <FormProvider {...methods}>
          <Stack gap={2} width="100%">
            <Stack gap={3} direction="row">
              <FirstName />
              <LastName />
            </Stack>

            <Stack gap={3} direction="row" width="100%">
              <Email />
              <EmailConfirmation />
            </Stack>

            <Stack gap={3} direction="row" width="100%">
              <Phone />
              <Gender />
            </Stack>
          </Stack>
        </FormProvider>

        <SaveButton
          label="Save"
          loading={loading}
          type="submit"
          startIcon={<Save />}
        />
      </Content>
    );
  },
  (prev, next) =>
    JSON.stringify(prev.defaultValues) === JSON.stringify(next.defaultValues) &&
    prev.loading === next.loading
);

export default SettingsUserInfo;
