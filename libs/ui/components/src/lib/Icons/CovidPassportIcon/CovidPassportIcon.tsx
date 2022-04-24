import { CallToAction } from '@mui/icons-material';
import { Tooltip } from '@mui/material';

export type CovidPassportIconProps = {
  /**
   * Whether the icon is active
   *
   * @default false
   */
  active?: boolean;
};

const CovidPassportIcon = ({
  active = false
}: CovidPassportIconProps): JSX.Element => (
  <Tooltip title={`Covid passport${active ? '' : ' not'} required`}>
    <CallToAction
      color={active ? 'success' : undefined}
      titleAccess={active ? 'passport-required' : 'passport-not-required'}
    />
  </Tooltip>
);

export default CovidPassportIcon;
