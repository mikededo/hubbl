import useSWR from 'swr';

import { DashboardResponse } from '@hubbl/data-access/api';
import { useAppContext } from '@hubbl/data-access/contexts';
import { EmptyHandler } from '@hubbl/shared/types';
import { DashboardEvents as EventsGrid } from '@hubbl/ui/components';

const DashboardEvents = () => {
  const {
    token,
    user,
    API: { fetcher }
  } = useAppContext();

  const { data } = useSWR<DashboardResponse>(
    // Wait for the user to be defined, before making the call
    token.parsed ? `/dashboards/${user.gym.id}` : null,
    fetcher,
    { revalidateOnFocus: false }
  );

  const handleOnAddClick: EmptyHandler = () => {
    console.log('To be implemented');
  };

  return data ? (
    <EventsGrid items={data.events} onAddEvent={handleOnAddClick} />
  ) : null;
};

export default DashboardEvents;
