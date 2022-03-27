import { ReactElement, useState } from 'react';

import useSWR from 'swr';

import {
  useAppContext,
  useLoadingContext,
  useToastContext
} from '@hubbl/data-access/contexts';
import { EventTypeDTO } from '@hubbl/shared/models/dto';
import {
  EventTypeDialog,
  EventTypeFormFields,
  EventTypeGrid,
  PageHeader
} from '@hubbl/ui/components';

import { BaseLayout, GeneralPages } from '../../components';

const EventTypes = () => {
  const { onPopLoading, onPushLoading } = useLoadingContext();
  const { onError, onSuccess } = useToastContext();
  const {
    token,
    user,
    API: { fetcher, poster }
  } = useAppContext();

  // Fetch event types
  const eventTypes = useSWR<EventTypeDTO[]>(
    token.parsed ? '/event-types' : null,
    fetcher
  );

  // Dialogs state
  const [eventTypeDialog, setEventTypeDialog] = useState(false);

  // Handlers
  const handleOnAddEventType = () => {
    setEventTypeDialog(true);
  };

  const handleOnCloseEventTypeDialog = () => {
    setEventTypeDialog(false);
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

      // Mutate the modified virtual gym
      await eventTypes.mutate([...eventTypes.data, created], false);

      onSuccess('Event type created!');
    } catch (e) {
      onError(`${e}`);
    }

    onPopLoading();
  };

  if (eventTypes.error) {
    onError(`${eventTypes.error}`);
  }

  return (
    <>
      <PageHeader
        title="Events"
        breadcrumbs={[{ href: '/', label: 'Events' }]}
      />

      <EventTypeGrid
        eventTypes={eventTypes.data ?? []}
        onAddEventType={handleOnAddEventType}
      />

      <EventTypeDialog
        open={eventTypeDialog}
        title="Create an event type"
        onClose={handleOnCloseEventTypeDialog}
        onSubmit={handleOnSubmitEventType}
      />
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
