import { EventDTO, EventTemplateDTO } from '@hubbl/shared/models/dto';
import { CallToAction, Masks } from '@mui/icons-material';
import { Stack, Tooltip, Typography } from '@mui/material';

export type DashboardCommonEventProps = {
  /**
   * `Event` to display to the screen
   */
  event: EventDTO | EventTemplateDTO;
};

const DashboardCommonEvent = ({
  event
}: DashboardCommonEventProps): JSX.Element => (
  <Stack direction="row" justifyContent="space-between" alignItems="start">
    <Typography variant="h6">{event.name}</Typography>

    <Stack gap={1} direction="row" alignItems="center">
      <Tooltip title={`Facial mask${event.maskRequired ? '' : 'not'} required`}>
        <Masks
          sx={{ fontSize: '1.75rem' }}
          color={event.maskRequired ? 'success' : undefined}
          titleAccess={
            event.maskRequired ? 'mask-required' : 'mask-not-required'
          }
        />
      </Tooltip>

      <Tooltip
        title={`Covid passport${event.covidPassport ? '' : 'not'} required`}
      >
        <CallToAction
          color={event.covidPassport ? 'success' : undefined}
          titleAccess={
            event.covidPassport ? 'passport-required' : 'passport-not-required'
          }
        />
      </Tooltip>
    </Stack>
  </Stack>
);

export default DashboardCommonEvent;
