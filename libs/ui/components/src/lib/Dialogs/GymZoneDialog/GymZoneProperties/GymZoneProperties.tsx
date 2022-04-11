import { Controller } from 'react-hook-form';

import { Checkbox, FormControlLabel, Stack, Typography } from '@mui/material';

import { GymZoneFormFields } from '../../types';

const GymZoneProperties = (): JSX.Element => (
  <Stack gap={1.5}>
    <Typography variant="h6">Properties</Typography>

    <Stack direction="row" alignItems="center" justifyContent="space-between">
      <FormControlLabel
        control={
          <Controller<GymZoneFormFields>
            name="isClassType"
            defaultValue={false}
            render={({ field: { name, value, onChange } }) => (
              <Checkbox
                name={name}
                title="gym-zone-class-type"
                checked={Boolean(value)}
                value={value}
                onChange={onChange}
              />
            )}
          />
        }
        label="Class zone"
      />

      <FormControlLabel
        control={
          <Controller<GymZoneFormFields>
            name="maskRequired"
            defaultValue={true}
            render={({ field: { name, value, onChange } }) => (
              <Checkbox
                name={name}
                title="gym-zone-mask-required"
                checked={Boolean(value)}
                value={value}
                onChange={onChange}
              />
            )}
          />
        }
        label="Mask required"
      />

      <FormControlLabel
        control={
          <Controller<GymZoneFormFields>
            name="covidPassport"
            defaultValue={true}
            render={({ field: { name, value, onChange } }) => (
              <Checkbox
                name={name}
                title="gym-zone-covid-passport"
                checked={Boolean(value)}
                value={value}
                onChange={onChange}
              />
            )}
          />
        }
        label="Covid passport"
      />
    </Stack>
  </Stack>
);

export default GymZoneProperties;
