import { EventDTO, TrainerDTO } from '@hubbl/shared/models/dto';
import { EmptyHandler } from '@hubbl/shared/types';
import { Save } from '@mui/icons-material';
import { Button, Divider, Stack, Typography } from '@mui/material';

import DifficultyStack from '../../DifficultyStack';
import Base, { BaseProps } from '../Base';
import DialogSection from '../DialogSection';

export type EventAppointmentDialogProps = {
  /**
   * Event to dislay the information of
   */
  event?: EventDTO;

  /**
   * Callback to run when the create button has been pressed
   */
  onSubmit?: EmptyHandler;
} & Omit<BaseProps, 'title'>;

const EventAppointmentDialog = ({
  event,
  onSubmit,
  ...props
}: EventAppointmentDialogProps): JSX.Element => (
  <Base title={event?.name ?? ''} {...props}>
    <DialogSection>
      <Stack width="100%" gap={2}>
        <Typography>
          Do you want to create an appointment for the event?
        </Typography>

        <Typography variant="subtitle1">{event?.description}</Typography>
      </Stack>
    </DialogSection>

    <Divider />

    <DialogSection>
      <Stack width="100%" gap={2}>
        <Stack direction="row" width="100%" gap={2}>
          <Stack direction="column" width="100%" gap={1}>
            <Typography variant="h6">Difficulty</Typography>
            <DifficultyStack difficulty={event?.difficulty ?? 1} />
          </Stack>

          <Stack direction="column" width="100%" gap={1}>
            <Typography variant="h6">Date</Typography>
            <Typography>
              {`${event?.date.day}`.padStart(2, '0')}/
              {`${event?.date.month}`.padStart(2, '0')}/{event?.date.year}
            </Typography>
          </Stack>

          <Stack direction="column" width="100%" gap={1}>
            <Typography variant="h6">Schedule</Typography>
            <Typography>
              {event?.startTime} - {event?.endTime}
            </Typography>
          </Stack>
        </Stack>

        <Stack direction="row" width="100%" gap={2}>
          <Stack direction="column" width="100%" gap={1}>
            <Typography variant="h6">Covid passport</Typography>
            <Typography>{event?.covidPassport ? 'Yes' : 'No'}</Typography>
          </Stack>

          <Stack direction="column" width="100%" gap={1}>
            <Typography variant="h6">Mask required</Typography>
            <Typography>{event?.maskRequired ? 'Yes' : 'No'}</Typography>
          </Stack>

          <Stack direction="column" width="100%" gap={1}>
            <Typography variant="h6">Trainer</Typography>
            <Typography>
              {(event?.trainer as TrainerDTO<number>)?.firstName}{' '}
              {(event?.trainer as TrainerDTO<number>)?.lastName}
            </Typography>
          </Stack>
        </Stack>
      </Stack>
    </DialogSection>

    <Divider />

    <DialogSection footer>
      <Stack direction="row" justifyContent="flex-end" gap={2}>
        <Button title="create" onClick={onSubmit} startIcon={<Save />}>
          Create
        </Button>
      </Stack>
    </DialogSection>
  </Base>
);

export default EventAppointmentDialog;
