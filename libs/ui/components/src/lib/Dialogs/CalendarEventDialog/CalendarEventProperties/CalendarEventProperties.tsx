import { Controller, UseFormWatch } from 'react-hook-form';

import {
  Checkbox,
  FormControlLabel,
  Stack,
  styled,
  Typography
} from '@mui/material';

import { CalendarEventFormFields } from '../../types';

const PropertiesStack = styled(Stack)({ '> *': { flex: 1 } });

type CalendarEventPropertiesProps = {
  /**
   * Watch function used to know if the template field
   * has been set or not
   */
  watch: UseFormWatch<CalendarEventFormFields>;
};

const CalendarEventProperties = ({
  watch
}: CalendarEventPropertiesProps): JSX.Element => (
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
          <Controller<CalendarEventFormFields>
            name="maskRequired"
            defaultValue={true}
            render={({ field: { name, value, onChange } }) => (
              <Checkbox
                name={name}
                title="calendar-event-mask-required"
                checked={Boolean(value)}
                value={value}
                disabled={!!watch('template')}
                onChange={onChange}
              />
            )}
          />
        }
        label="Mask required"
      />

      <FormControlLabel
        control={
          <Controller<CalendarEventFormFields>
            name="covidPassport"
            defaultValue={true}
            render={({ field: { name, value, onChange } }) => (
              <Checkbox
                name={name}
                title="calendar-event-covid-passport"
                checked={Boolean(value)}
                value={value}
                disabled={!!watch('template')}
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

export default CalendarEventProperties;
