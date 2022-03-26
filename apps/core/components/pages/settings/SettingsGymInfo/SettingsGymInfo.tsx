import { useForm } from 'react-hook-form';

import { Input, LoadingButton, SettingsCard } from '@hubbl/ui/components';
import { Save } from '@mui/icons-material';
import { Grid, Stack, Typography } from '@mui/material';

import ColorPicker from './ColorPicker';
import { RequiredGymInfoFields } from './types';
import { useEffect } from 'react';
import { AppPalette, SingleHandler } from '@hubbl/shared/types';

type SettingsGymInfoProps = {
  /**
   * Initial fields of the form
   *
   * @default undefined
   */
  defaultValues?: RequiredGymInfoFields;

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
  onSubmit?: SingleHandler<RequiredGymInfoFields>;
};

const SettingsGymInfo = ({
  defaultValues,
  loading,
  onSubmit
}: SettingsGymInfoProps) => {
  const { control, handleSubmit, register, reset } =
    useForm<RequiredGymInfoFields>({
      defaultValues: { color: AppPalette.BLUE, ...defaultValues },
      shouldFocusError: false,
      shouldUnregister: false
    });

  const handleOnSubmit = (data: RequiredGymInfoFields) => {
    onSubmit?.(data);
  };

  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues);
    }
  }, [defaultValues, reset]);

  return (
    <SettingsCard as="section">
      <Stack
        direction="column"
        gap={3}
        width="100%"
        component="form"
        onSubmit={handleSubmit(handleOnSubmit)}
      >
        <Typography variant="h6">Gym information</Typography>

        <Stack gap={2}>
          <Grid spacing={{ xs: 2, sm: 2, md: 3 }} container>
            <Grid xs={12} sm={12} md={6} lg={4} item>
              <Input
                label="Gym name"
                labelVariant="body1"
                inputProps={{ title: 'gym-name' }}
                type="text"
                placeholder="Your gym's name"
                disabled={loading}
                registerResult={register('name', { required: true })}
                fullWidth
              />
            </Grid>

            <Grid xs={12} sm={12} md={6} lg={4} item>
              <Input
                label="Gym email"
                labelVariant="body1"
                inputProps={{ title: 'gym-email' }}
                type="email"
                placeholder="gym.name@info.com"
                disabled={loading}
                registerResult={register('email', { required: true })}
                fullWidth
              />
            </Grid>

            <Grid xs={12} sm={12} md={6} lg={4} item>
              <Input
                label="Gym phone"
                labelVariant="body1"
                inputProps={{ title: 'gym-phone' }}
                type="tel"
                placeholder="000 000 000"
                disabled={loading}
                registerResult={register('phone')}
                fullWidth
              />
            </Grid>
          </Grid>

          <Stack gap={2}>
            <Typography>Gym color</Typography>
            <ColorPicker control={control} />
          </Stack>
        </Stack>

        <LoadingButton
          label="Save"
          loading={loading}
          title="gym-info-submit"
          type="submit"
          startIcon={<Save />}
          sx={{ alignSelf: 'flex-end' }}
        />
      </Stack>
    </SettingsCard>
  );
};

export default SettingsGymInfo;
