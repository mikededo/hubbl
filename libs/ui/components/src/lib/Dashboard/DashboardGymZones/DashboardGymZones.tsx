import Link from 'next/link';

import { GymZoneDTO } from '@hubbl/shared/models/dto';
import { EmptyHandler } from '@hubbl/shared/types';
import { Grid, Stack, styled, Typography } from '@mui/material';

import AddItemPlaceholder from '../../AddItemPlaceholder';
import DashboardGymZone from '../DashboardGymZone';

const ResponseiveGrid = styled(Grid)(({ theme }) => ({
  justifyContent: 'flex-start',
  [theme.breakpoints.down('sm')]: {
    justifyContent: 'center'
  }
}));

export type DashboardGymZonesProps = {
  /**
   * List of `GymZone`'s to display
   */
  items: GymZoneDTO[];

  /**
   * Callback to run when the add placeholder has been clicked
   *
   * @default undefined
   */
  onAddGymZone?: EmptyHandler;
};

const PlaceholderText = styled(Typography)({
  textAlign: 'center',
  width: '75%'
});

const DashboardGymZones = ({
  items,
  onAddGymZone
}: DashboardGymZonesProps): JSX.Element => (
  <Stack gap={4}>
    <Typography variant="h5">GYM ZONES</Typography>

    <ResponseiveGrid
      direction="row"
      gap={{ xs: 3, sm: 2, md: 3}}
      container
    >
      {items.slice(0, Math.min(items.length, 5)).map((gymZone) => (
        <Grid key={gymZone.id} item>
          <Link
            href={`/virtual-gyms/${gymZone.virtualGym}/gym-zones/${gymZone.id}`}
            passHref
          >
            <DashboardGymZone gymZone={gymZone} />
          </Link>
        </Grid>
      ))}

      <Grid item>
        <AddItemPlaceholder
          title="add-gym-zone"
          height={25}
          width={44}
          onClick={onAddGymZone}
        >
          <PlaceholderText variant="placeholder">
            Click me to create a new gym zone!
          </PlaceholderText>
        </AddItemPlaceholder>
      </Grid>
    </ResponseiveGrid>
  </Stack>
);

export default DashboardGymZones;
