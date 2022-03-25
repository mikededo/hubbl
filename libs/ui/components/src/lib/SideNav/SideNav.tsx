import { notForwardOne } from '@hubbl/utils';
import {
  Breakpoint,
  Divider,
  Stack,
  styled,
  Theme,
  Typography,
  useMediaQuery
} from '@mui/material';

import SideNavGroup, { SideNavGroupItem } from '../SideNavGroup';

type ContainerProps = {
  /**
   * Breakpoint in which the side nav is shrink
   *
   * @default 'lg'
   */
  breakpoint?: Breakpoint;
};

const Container = styled('nav', {
  shouldForwardProp: notForwardOne('breakpoint')
})<ContainerProps>(({ theme, breakpoint = 'lg' }) => ({
  minWidth: theme.spacing(40),
  width: theme.spacing(40),
  margin: theme.spacing(6, 4, 4),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(4),
  transition: theme.transitions.create(['width', 'minWidth']),
  [theme.breakpoints.down(breakpoint)]: {
    minWidth: theme.spacing(8),
    width: theme.spacing(8)
  }
}));

type SideNavProps<T extends SideNavGroupItem> = {
  /**
   * Breakpoint in which the side nav is shrink
   *
   * @default 'lg'
   */
  breakpoint?: Breakpoint;

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
  breakpoint = 'lg',
  entries,
  header,
  selected
}: SideNavProps<T>): JSX.Element => {
  const shrink = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down(breakpoint)
  );

  return (
    <Container breakpoint={breakpoint}>
      <Typography variant="h2" textAlign="center">
        {shrink ? header[0].toUpperCase() : header}
      </Typography>

      <Divider />

      <Stack direction="column" gap={1.5} component="ul" role="list">
        {Object.values(entries).map(({ entries, hidden, name }) => (
          <SideNavGroup
            key={name}
            breakpoint={breakpoint}
            entries={entries}
            hidden={hidden}
            name={name}
            selected={selected}
          />
        ))}
      </Stack>
    </Container>
  );
};

export default SideNav;
