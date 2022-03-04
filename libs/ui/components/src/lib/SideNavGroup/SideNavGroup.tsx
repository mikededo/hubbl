import { Typography, styled } from '@mui/material';
import SideNavLink, { SideNavLinkItem } from '../SideNavLink';

const HeaderListItem = styled('li')({ listStyle: 'none' });

export type SideNavGroupItem = {
  /**
   * Entries of the group
   */
  entries: Record<string, SideNavLinkItem>;

  /**
   * Whether the group title should be hidden or shown
   */
  hidden?: boolean;

  /**
   * Name of the group, which will be displayed. If no name is given,
   * nothing will be displayed
   */
  name?: string;
};

type SideNavGroupProps = {
  /**
   * Value of the {@link SideNavLinkItem.label} that is selected
   */
  selected: string;
} & SideNavGroupItem;

const SideNavGroup = ({
  entries,
  hidden = false,
  name,
  selected
}: SideNavGroupProps): JSX.Element => (
  <>
    {!hidden && (
      <HeaderListItem>
        <Typography variant="h6">{name}</Typography>
      </HeaderListItem>
    )}

    {Object.entries(entries).map(([entry, { label, href }]) => (
      <SideNavLink
        key={entry}
        label={label}
        href={href}
        selected={entry === selected}
      />
    ))}
  </>
);

export default SideNavGroup;
