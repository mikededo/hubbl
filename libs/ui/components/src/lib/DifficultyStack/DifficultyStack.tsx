import { LocalFireDepartment as Fire } from '@mui/icons-material';
import { Stack } from '@mui/material';

export type DifficultyStackProps = {
  /**
   * Number of fires to display. Displays minimum to one fire and
   * a maximum of five fires
   */
  difficulty: number;
};

const DifficultyStack = ({ difficulty }: DifficultyStackProps): JSX.Element => (
  <Stack direction="row">
    <Fire
      key="difficulty-one"
      titleAccess="difficulty-one-active"
      color="primary"
    />
    <Fire
      key="difficulty-two"
      titleAccess={
        difficulty >= 2 ? 'difficulty-two-active' : 'difficulty-two-inactive'
      }
      color={difficulty >= 2 ? 'primary' : 'disabled'}
    />
    <Fire
      key="difficulty-three"
      titleAccess={
        difficulty >= 3
          ? 'difficulty-three-active'
          : 'difficulty-three-inactive'
      }
      color={difficulty >= 3 ? 'primary' : 'disabled'}
    />
    <Fire
      key="difficulty-four"
      titleAccess={
        difficulty >= 4 ? 'difficulty-four-active' : 'difficulty-four-inactive'
      }
      color={difficulty >= 4 ? 'primary' : 'disabled'}
    />
    <Fire
      key="difficulty-five"
      titleAccess={
        difficulty >= 5 ? 'difficulty-five-active' : 'difficulty-five-inactive'
      }
      color={difficulty >= 5 ? 'primary' : 'disabled'}
    />
  </Stack>
);

export default DifficultyStack;
