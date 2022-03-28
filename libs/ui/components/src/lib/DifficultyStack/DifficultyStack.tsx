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
    <Fire key="difficulty-one" titleAccess="difficulty-one" color="primary" />
    <Fire
      key="difficulty-two"
      titleAccess="difficulty-two"
      color={difficulty >= 2 ? 'primary' : 'disabled'}
    />
    <Fire
      key="difficulty-three"
      titleAccess="difficulty-three"
      color={difficulty >= 3 ? 'primary' : 'disabled'}
    />
    <Fire
      key="difficulty-four"
      titleAccess="difficulty-four"
      color={difficulty >= 4 ? 'primary' : 'disabled'}
    />
    <Fire
      key="difficulty-five"
      titleAccess="difficulty-five"
      color={difficulty >= 5 ? 'primary' : 'disabled'}
    />
  </Stack>
);

export default DifficultyStack;
