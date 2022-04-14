import { Controller } from 'react-hook-form';

import {
  Checkbox,
  FormControlLabel,
  Stack,
  styled,
  Typography
} from '@mui/material';

import { EventTemplateFormFields } from '../../types';

const PropertiesStack = styled(Stack)({ '> *': { flex: 1 } });

const EventTemplateProperties = (): JSX.Element => (
  <Stack gap={1.5}>
    <Typography variant="h6">Properties</Typography>

    <PropertiesStack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      spacing={1}
    >
      <FormControlLabel
        control={
          <Controller<EventTemplateFormFields>
            name="maskRequired"
            defaultValue={true}
            render={({ field: { name, value, onChange } }) => (
              <Checkbox
                name={name}
                title="event-template-mask-required"
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
          <Controller<EventTemplateFormFields>
            name="covidPassport"
            defaultValue={true}
            render={({ field: { name, value, onChange } }) => (
              <Checkbox
                name={name}
                title="event-template-covid-passport"
                checked={Boolean(value)}
                value={value}
                onChange={onChange}
              />
            )}
          />
        }
        label="Covid passport"
      />
    </PropertiesStack>
  </Stack>
);

export default EventTemplateProperties;
