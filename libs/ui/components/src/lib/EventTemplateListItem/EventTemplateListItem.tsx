import React from 'react';

import { EventTemplateDTO } from '@hubbl/shared/models/dto';
import { EventTemplate, EventType } from '@hubbl/shared/models/entities';
import { Stack, styled, Typography } from '@mui/material';

import ColorCircle from '../ColorCircle';
import ContentCard from '../ContentCard';
import DifficultyStack from '../DifficultyStack';
import EllipsedTypography from '../EllipsedTypography';
import { CovidPassportIcon, MaskIcon } from '../Icons';

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
              <MaskIcon active={eventTemplate.maskRequired} />

              <CovidPassportIcon active={eventTemplate.covidPassport} />
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
