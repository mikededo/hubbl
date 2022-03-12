import { VirtualGymDTO } from '@hubbl/shared/models/dto';
import { Grid, Stack, Typography, styled } from '@mui/material';
import AddItemPlaceholder from '../../AddItemPlaceholder';

import DashboardVirtualGym from '../DashboardVirtualGym';

export type DashboardVirtualGymsProps = {
  items: VirtualGymDTO[];
};

const PlaceholderText = styled(Typography)({
  textAlign: 'center',
  width: '75%'
});

const DashboardVirtualGyms = ({ items }: DashboardVirtualGymsProps) => (
  <Stack gap={4}>
    <Typography variant="h5">VIRTUAL GYMS</Typography>

    <Grid direction="row" gap={4} container>
      {items.slice(0, 5).map((virtualGym) => (
        <Grid key={virtualGym.id} item>
          <DashboardVirtualGym virtualGym={virtualGym} />
        </Grid>
      ))}

      <Grid item>
        <AddItemPlaceholder title="add-virtual-gym" height="100%" width={44}>
          <PlaceholderText variant="placeholder">
            Click me to create a new virtual gym!
          </PlaceholderText>
        </AddItemPlaceholder>
      </Grid>
    </Grid>
  </Stack>
);

export default DashboardVirtualGyms;
