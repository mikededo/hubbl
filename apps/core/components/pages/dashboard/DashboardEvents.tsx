import { useAppContext } from '@hubbl/data-access/contexts';
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

  return <>{data ? <EventsGrid items={data.events} /> : null}</>;
};

export default DashboardEvents;
