import React from 'react';

import { GymZoneDTO } from '@hubbl/shared/models/dto';
import { GymZone } from '@hubbl/shared/models/entities';
import { notForwardOne } from '@hubbl/utils';
import { CallToAction, FitnessCenter, Masks } from '@mui/icons-material';
import {
  alpha,
  CardProps,
  Stack,
  styled,
  Tooltip,
  Typography
} from '@mui/material';

import ContentCard from '../ContentCard';

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
              <Tooltip
                title={gymZone.isClassType ? 'Class zone' : 'Non class zone'}
              >
                <FitnessCenter
                  sx={{ transform: 'rotate(-45deg)' }}
                  color={gymZone.isClassType ? 'success' : undefined}
                  titleAccess={
                    gymZone.isClassType ? 'class-zone' : 'non-class-zone'
                  }
                />
              </Tooltip>

              <Tooltip
                title={`Facial mask${
                  gymZone.maskRequired ? '' : 'not'
                } required`}
              >
                <Masks
                  sx={{ fontSize: '1.75rem' }}
                  color={gymZone.maskRequired ? 'success' : undefined}
                  titleAccess={
                    gymZone.maskRequired ? 'mask-required' : 'mask-not-required'
                  }
                />
              </Tooltip>

              <Tooltip
                title={`Covid passport${
                  gymZone.covidPassport ? '' : 'not'
                } required`}
              >
                <CallToAction
                  color={gymZone.covidPassport ? 'success' : undefined}
                  titleAccess={
                    gymZone.covidPassport
                      ? 'passport-required'
                      : 'passport-not-required'
                  }
                />
              </Tooltip>
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
