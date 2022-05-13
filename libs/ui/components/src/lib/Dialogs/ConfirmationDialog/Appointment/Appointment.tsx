import {
  CalendarAppointmentDTO,
  EventAppointmentDTO
} from '@hubbl/shared/models/dto';
import { Stack, styled, Typography } from '@mui/material';

import Base, { BaseProps } from '../../Base';
import DialogSection from '../../DialogSection';

const ConfirmationDialogSection = styled(DialogSection)(({ theme }) => ({
  paddingBottom: theme.spacing(4)
}));

const parseDate = ({
  year,
  month,
  day
}: {
  year: number;
  month: number;
  day: number;
}): string =>
  `${`${day}`.padStart(2, '0')}/${`${month}`.padStart(2, '0')}/${year}`;

export type CalendarAppointmentProps = {
  /**
   * Appointment to display the information of
   */
  appointment?: CalendarAppointmentDTO | EventAppointmentDTO;
} & Omit<BaseProps, 'title'>;

const CalendarAppointment = ({
  appointment,
  ...props
}: CalendarAppointmentProps): JSX.Element => (
  <Base title="Appointment confirmation" {...props}>
    <ConfirmationDialogSection>
      <Stack direction="column" gap={2}>
        <Typography variant="subtitle1">
          Here you have the data of the appointment you have just created! Enjoy
          your workout!{' '}
          <span role="img" aria-label="fire-emoji">
            🔥
          </span>
        </Typography>

        <Stack direction="row" gap={2}>
          <Stack direction="column" width="100%" gap={1}>
            <Typography variant="h6">Appointment number</Typography>
            <Typography>{appointment?.id}</Typography>
          </Stack>

          {appointment && (appointment as CalendarAppointmentDTO)?.date && (
            <Stack direction="column" width="100%" gap={1}>
              <Typography variant="h6">Date</Typography>

              <Typography>
                {parseDate((appointment as CalendarAppointmentDTO).date)}
              </Typography>
            </Stack>
          )}
        </Stack>

        <Stack direction="row" gap={2}>
          <Stack direction="column" width="100%" gap={1}>
            <Typography variant="h6">Start time</Typography>
            <Typography>{appointment?.startTime}</Typography>
          </Stack>

          <Stack direction="column" width="100%" gap={1}>
            <Typography variant="h6">End time</Typography>
            <Typography>{appointment?.endTime}</Typography>
          </Stack>
        </Stack>
      </Stack>
    </ConfirmationDialogSection>
  </Base>
);

export default CalendarAppointment;
