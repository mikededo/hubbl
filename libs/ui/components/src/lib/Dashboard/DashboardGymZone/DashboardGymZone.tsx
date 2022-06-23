import React from 'react';

import { GymZoneDTO } from '@hubbl/shared/models/dto';
import { CardActionArea, styled } from '@mui/material';

import Anchor from '../../Anchor';
import GymZoneListItem from '../../GymZoneListItem';

const ContentCardAction = styled(CardActionArea)(({ theme }) => ({
  borderRadius: theme.spacing(2)
}));

/**
 * Props that are required to be passed to the `a` component,
 * since the item works as a link
 */
type AnchorLinkProps = Pick<
  React.HTMLProps<HTMLAnchorElement>,
  'href' | 'onClick'
>;

export type DashboardGymZoneProps = {
  /**
   * `GymZone` to display to the screen
   */
  gymZone: GymZoneDTO;
} & AnchorLinkProps;

const DashboardGymZone = React.forwardRef<
  HTMLAnchorElement,
  DashboardGymZoneProps
>(
  ({ gymZone, href, onClick }, ref): JSX.Element => (
    <Anchor href={href} ref={ref} onClick={onClick}>
      <ContentCardAction color="primary" disabled={!onClick}>
        <GymZoneListItem gymZone={gymZone} />
      </ContentCardAction>
    </Anchor>
  )
);

export default DashboardGymZone;
