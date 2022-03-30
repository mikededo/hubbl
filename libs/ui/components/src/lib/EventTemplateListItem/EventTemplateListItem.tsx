import React from 'react';

import { EventTemplateDTO } from '@hubbl/shared/models/dto';
import { EventTemplate, EventType } from '@hubbl/shared/models/entities';
import { CallToAction, Masks } from '@mui/icons-material';
import { Stack, styled, Tooltip, Typography } from '@mui/material';

import ColorCircle from '../ColorCircle';
import ContentCard from '../ContentCard';
import DifficultyStack from '../DifficultyStack';
import EllipsedTypography from '../EllipsedTypography';

const PaddedContentCard = styled(ContentCard)(({ theme }) => ({
  padding: theme.spacing(2, 3),
  width: theme.spacing(44),
  height: theme.spacing(15)
}));

const ContentStack = styled(Stack)({ height: '100%' });

export type EventTemplateListItemProps = {
  /**
   * `EventTemplate` to render
   */
  eventTemplate: EventTemplateDTO | EventTemplate;
};

const EventTemplateListItem = React.forwardRef<
  HTMLDivElement,
  EventTemplateListItemProps
>(
  ({ eventTemplate }, ref): JSX.Element => (
    <PaddedContentCard ref={ref}>
      <ContentStack justifyContent="space-between">
        <Stack direction="column" overflow="hidden">
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6">{eventTemplate.name}</Typography>

            <Stack direction="row" spacing={1} alignItems="center">
              <Tooltip
                title={`Facial mask${
                  eventTemplate.maskRequired ? '' : 'not'
                } required`}
              >
                <Masks
                  sx={{ fontSize: '1.75rem' }}
                  color={eventTemplate.maskRequired ? 'success' : undefined}
                  titleAccess={
                    eventTemplate.maskRequired
                      ? 'mask-required'
                      : 'mask-not-required'
                  }
                />
              </Tooltip>

              <Tooltip
                title={`Covid passport${
                  eventTemplate.covidPassport ? '' : 'not'
                } required`}
              >
                <CallToAction
                  color={eventTemplate.covidPassport ? 'success' : undefined}
                  titleAccess={
                    eventTemplate.covidPassport
                      ? 'passport-required'
                      : 'passport-not-required'
                  }
                />
              </Tooltip>
            </Stack>
          </Stack>

          <EllipsedTypography>{eventTemplate.description}</EllipsedTypography>
        </Stack>

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <DifficultyStack difficulty={eventTemplate.difficulty} />

          <Stack
            direction="row"
            alignItems="center"
            justifyContent="flex-end"
            spacing={1}
          >
            <Typography>{(eventTemplate.type as EventType).name}</Typography>

            <ColorCircle
              title={`${eventTemplate.id}-color`}
              color={(eventTemplate.type as EventType).labelColor}
            />
          </Stack>
        </Stack>
      </ContentStack>
    </PaddedContentCard>
  )
);

export default EventTemplateListItem;
