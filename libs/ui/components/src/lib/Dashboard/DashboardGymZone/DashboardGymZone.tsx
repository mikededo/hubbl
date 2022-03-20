import React from 'react';

import { GymZoneDTO } from '@hubbl/shared/models/dto';
import { CallToAction, FitnessCenter, Masks } from '@mui/icons-material';
import {
  CardActionArea,
  Stack,
  styled,
  Tooltip,
  Typography
} from '@mui/material';

import ContentCard from '../../ContentCard';

const ContentCardAction = styled(CardActionArea)(({ theme }) => ({
  borderRadius: theme.spacing(2)
}));

const PaddedContentCard = styled(ContentCard)(({ theme }) => ({
  padding: theme.spacing(3),
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

export type DashboardGymZoneProps = {
  /**
   * `GymZone` to display to the screen
   */
  gymZone: GymZoneDTO;
} & AnchorLinkProps;

const DashboardGymZone = React.forwardRef<
  HTMLAnchorElement,
  DashboardGymZoneProps
>(({ gymZone, href, onClick }, ref) => (
  <Anchor href={href} ref={ref} onClick={onClick}>
    <ContentCardAction color="primary">
      <PaddedContentCard>
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
                    sx={{ fontSize: '2rem', transform: 'rotate(-45deg)' }}
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
                    fontSize="large"
                    color={gymZone.maskRequired ? 'success' : undefined}
                    titleAccess={
                      gymZone.maskRequired
                        ? 'mask-required'
                        : 'mask-not-required'
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
                    sx={{ fontSize: '1.7rem' }}
                    titleAccess={
                      gymZone.covidPassport
                        ? 'passport-required'
                        : 'passport-not-required'
                    }
                  />
                </Tooltip>
              </Stack>
            </Stack>

            <Typography>{gymZone.description}</Typography>
          </Stack>

          <Stack gap={1}>
            <Typography>
              {gymZone.openTime} - {gymZone.closeTime}
            </Typography>
            <Typography>Maximum capacity: {gymZone.capacity}</Typography>
          </Stack>
        </ContentStack>
      </PaddedContentCard>
    </ContentCardAction>
  </Anchor>
));

export default DashboardGymZone;
