import { ReactElement, useEffect } from 'react';

import { EventTypeGrid, PageHeader } from '@hubbl/ui/components';

import { BaseLayout, GeneralPages } from '../../components';
import {
  useAppContext,
  useLoadingContext,
  useToastContext
} from '@hubbl/data-access/contexts';
import useSWR from 'swr';

const EventTypes = () => {
  const { loading, onPopLoading, onPushLoading } = useLoadingContext();
  const { onError } = useToastContext();
  const {
    token,
    API: { fetcher }
  } = useAppContext();

  // Fetch event types
  const eventTypes = useSWR(token.parsed ? '/event-types' : null, fetcher);

  if (eventTypes.error) {
    onError(`${eventTypes.error}`);
  }

  useEffect(() => {
    if (!eventTypes.data && !loading) {
      onPushLoading();
    } else if (eventTypes.data && loading) {
      onPopLoading();
    }
  }, [eventTypes, loading, onPopLoading, onPushLoading]);

  return (
    <>
      <PageHeader
        title="Events"
        breadcrumbs={[{ href: '/', label: 'Events' }]}
      />

      <EventTypeGrid eventTypes={eventTypes.data ?? []} />
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
