import { useFormContext } from 'react-hook-form';

import { Stack, Typography } from '@mui/material';

import ColorPicker from '../../../ColorPicker';
import { EventTypeFormFields } from '../../types';

const EventTypeName = (): JSX.Element => {
  const { control } = useFormContext<EventTypeFormFields>();

  return (
    <Stack direction="column" spacing={1}>
      <Typography variant="h6">Event type color</Typography>

      <ColorPicker control={control} name="color" fullWidth />
    </Stack>
  );
};

export default EventTypeName;
