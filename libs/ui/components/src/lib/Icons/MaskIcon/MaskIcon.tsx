import { Masks } from '@mui/icons-material';
import { Tooltip } from '@mui/material';

export type MaskIconProps = {
  /**
   * Whether the icon is active
   * 
   * @default false
   */
  active?: boolean;
};

const MaskIcon = ({ active = false }: MaskIconProps): JSX.Element => (
  <Tooltip title={`Facial mask${active ? '' : ' not'} required`}>
    <Masks
      sx={{ fontSize: '1.75rem' }}
      color={active ? 'success' : undefined}
      titleAccess={active ? 'mask-required' : 'mask-not-required'}
    />
  </Tooltip>
);

export default MaskIcon;
