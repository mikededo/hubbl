import React from 'react';

import { GymZoneDTO } from '@hubbl/shared/models/dto';
import { GymZone } from '@hubbl/shared/models/entities';
import { notForwardOne } from '@hubbl/utils';
import { alpha, CardProps, Stack, styled, Typography } from '@mui/material';

import ContentCard from '../ContentCard';
import { ClassZoneIcon, CovidPassportIcon, MaskIcon } from '../Icons';

type PaddedContentCardProps = {
  flat?: boolean;
};

const PaddedContentCard = styled(ContentCard, {
  shouldForwardProp: notForwardOne('flat')
})<CardProps & PaddedContentCardProps>(({ theme, flat }) => ({
  padding: theme.spacing(2, 3),
  width: theme.spacing(44),
  height: theme.spacing(25),
  boxShadow: flat
    ? `0 0 ${theme.spacing(0.75)} ${alpha('#777', 0.15)}`
    : undefined
}));

const ContentStack = styled(Stack)({ height: '100%' });

export type GymZoneListItemProps = {
  /**
   * `GymZone` to render
   */
  gymZone: GymZoneDTO | GymZone;

  /**
   * If flat, the item will remove the offset in the box shadow
   *
   * @default false
   */
  flat?: boolean;
};

const GymZoneListItem = React.forwardRef<HTMLDivElement, GymZoneListItemProps>(
  ({ gymZone, flat = false }, ref): JSX.Element => (
    <PaddedContentCard ref={ref} flat={flat}>
      <ContentStack justifyContent="space-between">
        <Stack gap={1}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6">{gymZone.name.toUpperCase()}</Typography>

            <Stack gap={1} direction="row" alignItems="center">
              <ClassZoneIcon active={gymZone.isClassType} />

              <MaskIcon active={gymZone.maskRequired} />

              <CovidPassportIcon active={gymZone.covidPassport} />
            </Stack>
          </Stack>

          <Typography noWrap>{gymZone.description}</Typography>
        </Stack>

        <Stack gap={1}>
          <Typography>
            {gymZone.openTime} - {gymZone.closeTime}
          </Typography>
          <Typography>Maximum capacity: {gymZone.capacity}</Typography>
        </Stack>
      </ContentStack>
    </PaddedContentCard>
  )
);

export default GymZoneListItem;
