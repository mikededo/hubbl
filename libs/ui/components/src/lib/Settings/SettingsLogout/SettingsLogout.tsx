import { EmptyHandler } from '@hubbl/shared/types';
import { Logout } from '@mui/icons-material';
import { Button, Stack, styled, Typography } from '@mui/material';

import ContentCard from '../../ContentCard';

const Content = styled(ContentCard)(({ theme }) => ({
  padding: theme.spacing(1.5, 3),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between'
}));

export type SettingsLogoutProps = {
  /**
   * Text to display as the header of the card
   */
  header: string;

  /**
   * Optional text to display as the subtitle of the header
   */
  subtitle?: string;

  /**
   * Callback to run when the log out button has been clicked
   */
  onLogOut?: EmptyHandler;
};

const SettingsLogout = ({
  header,
  subtitle,
  onLogOut
}: SettingsLogoutProps) => (
  <Content as="section">
    <Stack>
      <Typography variant="h6">{header}</Typography>
      {subtitle && <Typography>{subtitle}</Typography>}
    </Stack>

    <Button startIcon={<Logout />} color="secondary" onClick={onLogOut}>
      Log out
    </Button>
  </Content>
);

export default SettingsLogout;
