import { Controller } from 'react-hook-form';

import { Stack, Typography } from '@mui/material';

import DatePicker from '../../../DatePicker';

const CalendarEventDate = (): JSX.Element => (
  <Stack direction="column" spacing={1} width="100%">
    <Typography variant="h6" component="label">
      Date
    </Typography>

    <Controller
      name="date"
      defaultValue={new Date()}
      render={({ field: { name, onChange, value } }) => (
        <DatePicker
          name={name}
          title="calendar-event-date"
          value={value}
          onChangeDate={onChange}
        />
      )}
    />
  </Stack>
);

export default CalendarEventDate;
