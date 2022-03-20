import { TrainerDTO } from '@hubbl/shared/models/dto';
import { EmptyHandler } from '@hubbl/shared/types';
import { Grid, Stack, styled, Typography } from '@mui/material';

import AddItemPlaceholder from '../../AddItemPlaceholder';
import DashboardTrainer from '../DashboardTrainer';

export type DashboardTrainersProps = {
  /**
   * List of `Trainer`'s to display
   */
  items: TrainerDTO<number>[];

  /**
   * Callback to run when the add placeholder has been clicked
   *
   * @default undefined
   */
  onAddTrainer?: EmptyHandler;
};

const PlaceholderText = styled(Typography)({
  textAlign: 'center',
  width: '75%'
});

const DashboardTrainers = ({ items, onAddTrainer }: DashboardTrainersProps) => (
  <Stack gap={4}>
    <Typography variant="h5">TRAINERS</Typography>

    <Stack direction="column" gap={2}>
      {items.slice(0, Math.min(items.length, 5)).map((trainer) => (
        <Grid key={trainer.id} item>
          <DashboardTrainer trainer={trainer} />
        </Grid>
      ))}

      <Grid item>
        <AddItemPlaceholder
          title="add-trainer"
          height={7}
          width={44}
          onClick={onAddTrainer}
        >
          <PlaceholderText variant="placeholder">
            Click me to create a new trainer!
          </PlaceholderText>
        </AddItemPlaceholder>
      </Grid>
    </Stack>
  </Stack>
);

export default DashboardTrainers;
