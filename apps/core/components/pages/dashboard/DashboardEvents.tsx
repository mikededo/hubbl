import { useAppContext } from '@hubbl/data-access/contexts';
import { EmptyHandler } from '@hubbl/shared/types';
import { DashboardEvents as EventsGrid } from '@hubbl/ui/components';

import { useDashboard } from './hooks';

const DashboardEvents = () => {
  const {
    token,
    user,
    API: { fetcher }
  } = useAppContext();

  const { data } = useDashboard({
    run: !!token.parsed,
    gymId: user?.gym?.id,
    fetcher
  });

  const handleOnAddClick: EmptyHandler = () => {
    console.log('To be implemented');
  };

  return data ? (
    <EventsGrid items={data.events} onAddEvent={handleOnAddClick} />
  ) : null;
};

export default DashboardEvents;
