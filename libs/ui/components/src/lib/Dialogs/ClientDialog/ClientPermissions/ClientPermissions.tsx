import { Controller } from 'react-hook-form';

import { Checkbox, FormControlLabel, Stack, Typography } from '@mui/material';

import { ClientFormFields } from '../../types';

const ClientPermissions = (): JSX.Element => (
  <Stack gap={1.5}>
    <Typography variant="h6">Properties</Typography>

    <Stack direction="row" alignItems="center" justifyContent="space-between">
      <FormControlLabel
        control={
          <Controller<ClientFormFields>
            name="covidPassport"
            defaultValue={true}
            render={({ field: { name, value, onChange } }) => (
              <Checkbox
                name={name}
                title="client-covid-passport"
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

export default ClientPermissions;
