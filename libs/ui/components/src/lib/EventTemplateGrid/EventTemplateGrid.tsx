import { EventTemplateDTO } from '@hubbl/shared/models/dto';
import { EventTemplate } from '@hubbl/shared/models/entities';
import { EmptyHandler, SingleHandler } from '@hubbl/shared/types';
import { CardActionArea, styled, Typography } from '@mui/material';

import AddItemPlaceholder from '../AddItemPlaceholder';
import CarouselGrid from '../CarouselGrid';
import EventTemplateListItem from '../EventTemplateListItem';

const ContentCardAction = styled(CardActionArea)(({ theme }) => ({
  borderRadius: theme.spacing(2)
}));

type EventTemplateGridItemProps = {
  /**
   * Gym zone to render
   */
  eventTemplate: EventTemplateDTO | EventTemplate;

  /**
   * Callback run when a gym zone is clicked.
   *
   * @default undefined
   */
  onClick?: SingleHandler<number>;
};

const EventTemplateGridItem = ({
  eventTemplate,
  onClick
}: EventTemplateGridItemProps): JSX.Element => {
  const handleOnClick = () => {
    onClick?.(eventTemplate.id);
  };

  return (
    <ContentCardAction
      title={`event-template-${eventTemplate.id}`}
      onClick={handleOnClick}
    >
      <EventTemplateListItem eventTemplate={eventTemplate} />
    </ContentCardAction>
  );
};

export type EventTemplateGridProps = {
  /**
   * Gym zones to render in the grid.
   */
  eventTemplates: Array<EventTemplateDTO | EventTemplate>;

  /**
   * Callback run when the add button is clicked.
   *
   * @default undefined
   */
  onAddEventTemplate?: EmptyHandler;

  /**
   * Callback run when a gym zone is clicked.
   *
   * @default undefined
   */
  onEventTemplateClick?: SingleHandler<number>;
};

const EventTemplateGrid = ({
  eventTemplates,
  onAddEventTemplate,
  onEventTemplateClick
}: EventTemplateGridProps): JSX.Element => (
  <CarouselGrid header="Event templates" rowCount={3} height={56} width={46.5}>
    {eventTemplates.map((eventTemplate) => (
      <EventTemplateGridItem
        key={eventTemplate.id}
        eventTemplate={eventTemplate}
        onClick={onEventTemplateClick}
      />
    ))}

    <AddItemPlaceholder
      title="add-event-template"
      height={15}
      width={44}
      onClick={onAddEventTemplate}
    >
      <Typography variant="placeholder">
        Click me to create an event template!
      </Typography>
    </AddItemPlaceholder>
  </CarouselGrid>
);

export default EventTemplateGrid;
