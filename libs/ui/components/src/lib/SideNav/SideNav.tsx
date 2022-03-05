import { Divider, Stack, Typography } from '@mui/material';
import { styled } from '@mui/system';

import SideNavGroup, { SideNavGroupItem } from '../SideNavGroup';

const Container = styled('nav')(({ theme }) => ({
  minWidth: theme.spacing(40),
  width: theme.spacing(40),
  margin: theme.spacing(6, 4, 4),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(4)
}));

type SideNavProps<T extends SideNavGroupItem> = {
  /**
   * Entries of the side navigation bar
   */
  entries: T[];

  /**
   * Header of the side navigation bar
   */
  header: string;

  /**
   * Selected value of the navigation bar
   */
  selected: string;
};

const SideNav = <T extends SideNavGroupItem>({
  entries,
  header,
  selected
}: SideNavProps<T>): JSX.Element => (
  <Container>
    <Typography variant="h2" textAlign="center">
      {header}
    </Typography>

    <Divider />

    <Stack direction="column" gap={1.5} component="ul" role="list">
      {Object.values(entries).map(({ entries, hidden, name }) => (
        <SideNavGroup
          key={name}
          entries={entries}
          hidden={hidden}
          name={name}
          selected={selected}
        />
      ))}
    </Stack>
  </Container>
);

export default SideNav;
