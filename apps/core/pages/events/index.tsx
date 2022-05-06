import { Dispatch, ReactElement, SetStateAction, useState } from 'react';

import useSWR from 'swr';

import {
  useAppContext,
  useLoadingContext,
  useToastContext
} from '@hubbl/data-access/contexts';
import { EventTemplateDTO, EventTypeDTO } from '@hubbl/shared/models/dto';
import {
  EventTemplateDialog,
  EventTemplateFormFields,
  EventTemplateGrid,
  EventTypeDialog,
  EventTypeFormFields,
  EventTypeGrid,
  PageHeader,
  TodayEventsList
} from '@hubbl/ui/components';

import { BaseLayout, GeneralPages } from '../../components';

const EventTypes = () => {
  const { onPopLoading, onPushLoading } = useLoadingContext();
  const { onError, onSuccess } = useToastContext();
  const {
    token,
    user,
    todayEvents,
    helpers: { hasAccess },
    API: { fetcher, poster }
  } = useAppContext();

  // Fetch event types
  const eventTypes = useSWR<EventTypeDTO[]>(
    token.parsed ? '/event-types' : null,
    fetcher,
    { revalidateOnFocus: false }
  );
  // Fetch event templates
  const eventTemplates = useSWR<EventTemplateDTO[]>(
    token.parsed ? '/event-templates' : null,
    fetcher,
    { revalidateOnFocus: false }
  );

  // Dialogs state
  const [eventTypeDialog, setEventTypeDialog] = useState(false);
  const [eventTemplateDialog, setEventTemplateDialog] = useState(false);

  // Handlers
  const handleOnOpenDialog =
    (dispatcher: Dispatch<SetStateAction<boolean>>) => () => {
      dispatcher(true);
    };

  const handleOnCloseDialog =
    (dispatcher: Dispatch<SetStateAction<boolean>>) => () => {
      dispatcher(false);
    };

  const handleOnSubmitEventType = async (data: EventTypeFormFields) => {
    setEventTypeDialog(false);
    onPushLoading();

    try {
      const created = await poster<EventTypeDTO>('/event-types', {
        name: data.name,
        description: data.description,
        labelColor: data.color,
        gym: user.gym.id
      });

      // Mutate the event type list
      await eventTypes.mutate([...eventTypes.data, created], false);

      onSuccess('Event type created!');
    } catch (e) {
      onError(`${e}`);
    }

    onPopLoading();
  };

  const handleOnSubmitEventTemplate = async (data: EventTemplateFormFields) => {
    setEventTemplateDialog(false);
    onPushLoading();

    try {
      const created = await poster<EventTemplateDTO>('/event-templates', {
        name: data.name,
        description: data.description,
        capacity: data.capacity,
        maskRequired: data.maskRequired,
        difficulty: data.difficulty,
        covidPassport: data.covidPassport,
        type: data.eventType,
        gym: user.gym.id
      });

      // Add the type
      created.type = eventTypes.data?.find(
        (type) => type.id === data.eventType
      );

      // Mutate the event template list
      await eventTemplates.mutate([...eventTemplates.data, created], false);

      onSuccess('Event template created!');
    } catch (e) {
      onError(`${e}`);
    }

    onPopLoading();
  };

  if (eventTypes.error) {
    onError(`${eventTypes.error}`);
  }

  if (eventTemplates.error) {
    onError(`${eventTemplates.error}`);
  }

  return (
    <>
      <PageHeader
        title="Events"
        breadcrumbs={[{ href: '/', label: 'Events' }]}
      />

      <EventTypeGrid
        eventTypes={eventTypes.data ?? []}
        onAddEventType={
          hasAccess('createEventTypes')
            ? handleOnOpenDialog(setEventTypeDialog)
            : undefined
        }
      />

      <EventTemplateGrid
        eventTemplates={eventTemplates.data ?? []}
        onAddEventTemplate={
          hasAccess('createEventTemplates')
            ? handleOnOpenDialog(setEventTemplateDialog)
            : undefined
        }
      />

      <TodayEventsList events={todayEvents} />

      {hasAccess('createEventTypes') && (
        <EventTypeDialog
          open={eventTypeDialog}
          title="Create an event type"
          onClose={handleOnCloseDialog(setEventTypeDialog)}
          onSubmit={handleOnSubmitEventType}
        />
      )}

      {hasAccess('createEventTemplates') && (
        <EventTemplateDialog
          open={eventTemplateDialog}
          title="Create an event template"
          onClose={handleOnCloseDialog(setEventTemplateDialog)}
          onSubmit={handleOnSubmitEventTemplate}
        />
      )}
    </>
  );
};

export default EventTypes;

EventTypes.getLayout = (page: ReactElement) => (
  <GeneralPages>
    <BaseLayout header="Gym name" selected="events">
      {page}
    </BaseLayout>
  </GeneralPages>
);
