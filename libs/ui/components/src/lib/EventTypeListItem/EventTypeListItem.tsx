import React from 'react';

import { EventTypeDTO } from '@hubbl/shared/models/dto';
import { EventType } from '@hubbl/shared/models/entities';
import { Stack, styled, Typography } from '@mui/material';

import ColorCircle from '../ColorCircle';
import ContentCard from '../ContentCard';
import EllipsedTypography from '../EllipsedTypography';

const PaddedContentCard = styled(ContentCard)(({ theme }) => ({
  padding: theme.spacing(2, 3),
  width: theme.spacing(44),
  height: theme.spacing(10)
}));

const ContentStack = styled(Stack)({ height: '100%' });

export type EventTypeListItemProps = {
  /**
   * `EventType` to render
   */
  eventType: EventTypeDTO | EventType;
};

const EventTypeListItem = React.forwardRef<
  HTMLDivElement,
  EventTypeListItemProps
>(
  ({ eventType }, ref): JSX.Element => (
    <PaddedContentCard ref={ref}>
      <ContentStack justifyContent="space-between">
        <Stack
          direction="row"
          spacing={1}
          alignItems="flex-start"
          justifyContent="space-between"
        >
          <Stack direction="column" overflow="hidden">
            <Typography variant="h6">{eventType.name}</Typography>

            <EllipsedTypography>{eventType.description}</EllipsedTypography>
          </Stack>

          <ColorCircle
            title={`${eventType.id}-color`}
            color={eventType.labelColor}
          />
        </Stack>
      </ContentStack>
    </PaddedContentCard>
  )
);

export default EventTypeListItem;
