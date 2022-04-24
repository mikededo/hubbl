import { FitnessCenter } from '@mui/icons-material';
import { Tooltip } from '@mui/material';

export type ClassZoneIconProps = {
  /**
   * Whether the icon is active
   *
   * @default false
   */
  active?: boolean;
};

const ClassZoneIcon = ({ active = false }: ClassZoneIconProps): JSX.Element => (
  <Tooltip title={active ? 'Class zone' : 'Non class zone'}>
    <FitnessCenter
      sx={{ transform: 'rotate(-45deg)' }}
      color={active ? 'success' : undefined}
      titleAccess={active ? 'class-zone' : 'non-class-zone'}
    />
  </Tooltip>
);

export default ClassZoneIcon;
