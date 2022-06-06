import React from 'react';

import { VirtualGymDTO } from '@hubbl/shared/models/dto';
import { CardActionArea, Stack, styled, Typography } from '@mui/material';

import ContentCard from '../../ContentCard';

const ContentCardAction = styled(CardActionArea)(({ theme }) => ({
  borderRadius: theme.spacing(2)
}));

const PaddedContentCard = styled(ContentCard)(({ theme }) => ({
  padding: theme.spacing(2, 3),
  width: theme.spacing(44),
  height: theme.spacing(25)
}));

const ContentStack = styled(Stack)({ height: '100%' });

const Anchor = styled('a')({ textDecoration: 'none', backroundColor: 'none' });

/**
 * Props that are required to be passed to the `a` component,
 * since the item works as a link
 */
type AnchorLinkProps = Pick<
  React.HTMLProps<HTMLAnchorElement>,
  'href' | 'onClick'
>;

export type DashboardVirtualGymProps = {
  /**
   * `VirtualGym` to display to the screen
   */
  virtualGym: VirtualGymDTO;
} & AnchorLinkProps;

const DashboardVirtualGym = React.forwardRef<
  HTMLAnchorElement,
  DashboardVirtualGymProps
>(
  ({ virtualGym, href, onClick }, ref): JSX.Element => (
    <Anchor href={href} ref={ref} onClick={onClick}>
      <ContentCardAction color="primary" disabled={!onClick}>
        <PaddedContentCard>
          <ContentStack justifyContent="space-between">
            <Stack gap={1}>
              <Typography variant="h6">
                {virtualGym.name.toUpperCase()}
              </Typography>
              <Typography>{virtualGym.description}</Typography>
            </Stack>

            <Stack gap={1}>
              <Typography>
                {virtualGym.openTime} - {virtualGym.closeTime}
              </Typography>
              <Typography>{virtualGym.location}</Typography>
            </Stack>
          </ContentStack>
        </PaddedContentCard>
      </ContentCardAction>
    </Anchor>
  )
);

export default DashboardVirtualGym;
