import { EventDTO, EventTemplateDTO } from '@hubbl/shared/models/dto';
import { Stack, Typography } from '@mui/material';

import { CovidPassportIcon, MaskIcon } from '../../Icons';

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
      <MaskIcon active={event.maskRequired} />

      <CovidPassportIcon active={event.covidPassport} />
    </Stack>
  </Stack>
);

export default DashboardCommonEvent;
