import { useAppContext } from '@hubbl/data-access/contexts';
import { EmptyHandler } from '@hubbl/shared/types';
import { DashboardEventTemplates as EventTemplatesGrid } from '@hubbl/ui/components';

import { useDashboard } from './hooks';

const DashboardEventTemplates = () => {
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
    <EventTemplatesGrid
      items={data.templates}
      onAddEventTemplate={handleOnAddClick}
    />
  ) : null;
};

export default DashboardEventTemplates;
