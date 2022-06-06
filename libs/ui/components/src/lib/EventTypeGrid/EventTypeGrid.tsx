import { EventTypeDTO } from '@hubbl/shared/models/dto';
import { EventType } from '@hubbl/shared/models/entities';
import { EmptyHandler, SingleHandler } from '@hubbl/shared/types';
import { CardActionArea, styled, Typography } from '@mui/material';

import AddItemPlaceholder from '../AddItemPlaceholder';
import CarouselGrid from '../CarouselGrid';
import EventTypeListItem from '../EventTypeListItem';

const ContentCardAction = styled(CardActionArea)(({ theme }) => ({
  borderRadius: theme.spacing(2)
}));

type EventTypeGridItemProps = {
  /**
   * Gym zone to render
   */
  eventType: EventTypeDTO | EventType;

  /**
   * Callback run when a gym zone is clicked.
   *
   * @default undefined
   */
  onClick?: SingleHandler<number>;
};

const EventTypeGridItem = ({
  eventType,
  onClick
}: EventTypeGridItemProps): JSX.Element => {
  const handleOnClick = () => {
    onClick?.(eventType.id);
  };

  return (
    <ContentCardAction
      title={`event-type-${eventType.id}`}
      disabled={!onClick}
      onClick={handleOnClick}
    >
      <EventTypeListItem eventType={eventType} />
    </ContentCardAction>
  );
};

export type EventTypeGridProps = {
  /**
   * Gym zones to render in the grid.
   */
  eventTypes: Array<EventTypeDTO | EventType>;

  /**
   * Callback run when the add button is clicked.
   *
   * @default undefined
   */
  onAddEventType?: EmptyHandler;

  /**
   * Callback run when a gym zone is clicked.
   *
   * @default undefined
   */
  onEventTypeClick?: SingleHandler<number>;
};

const EventTypeGrid = ({
  eventTypes,
  onAddEventType,
  onEventTypeClick
}: EventTypeGridProps): JSX.Element => (
  <CarouselGrid rowCount={4} header="Event types" height={53.5} width={46.5}>
    {eventTypes.map((eventType) => (
      <EventTypeGridItem
        key={eventType.id}
        eventType={eventType}
        onClick={onEventTypeClick}
      />
    ))}

    {onAddEventType && (
      <AddItemPlaceholder
        title="add-event-type"
        height={10}
        width={44}
        onClick={onAddEventType}
      >
        <Typography variant="placeholder">
          Click me to create an event type!
        </Typography>
      </AddItemPlaceholder>
    )}
  </CarouselGrid>
);

export default EventTypeGrid;
