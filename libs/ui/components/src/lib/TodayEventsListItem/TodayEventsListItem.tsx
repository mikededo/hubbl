import { EventDTO, EventTypeDTO } from '@hubbl/shared/models/dto';
import { AppPalette } from '@hubbl/shared/types';
import { notForwardOne } from '@hubbl/utils';
import { CallToAction, Masks } from '@mui/icons-material';
import { Stack, styled, Tooltip, Typography } from '@mui/material';

type ColorDecorationProps = {
  /**
   * Color of the decoration of the item
   */
  color: AppPalette;
};

const ColorDecoration = styled('div', {
  shouldForwardProp: notForwardOne('color')
})<ColorDecorationProps>(({ theme, color }) => ({
  height: theme.spacing(9),
  width: theme.spacing(0.25),
  backgroundColor: color
}));

export type TodayEventsListItemProps = {
  /**
   * The event that will be rendered
   */
  event: EventDTO;
};

const TodayEventsListItem = ({
  event
}: TodayEventsListItemProps): JSX.Element => (
  <Stack direction="row" gap={1} alignItems="center">
    <ColorDecoration color={(event.eventType as EventTypeDTO).labelColor} />

    <Stack direction="column" width="100%">
      <Typography variant="h6">{event.name}</Typography>

      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="body2">
          {(event.eventType as EventTypeDTO).name}
        </Typography>

        <Typography variant="body2">
          {event.appointmentCount}/{event.capacity}
        </Typography>
      </Stack>

      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="body2">
          {event.startTime} - {event.endTime}
        </Typography>

        <Stack direction="row" alignItems="center" spacing={1}>
          <Tooltip
            title={`Facial mask${event.maskRequired ? '' : 'not'} required`}
          >
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
                event.covidPassport
                  ? 'passport-required'
                  : 'passport-not-required'
              }
            />
          </Tooltip>
        </Stack>
      </Stack>
    </Stack>
  </Stack>
);

export default TodayEventsListItem;
