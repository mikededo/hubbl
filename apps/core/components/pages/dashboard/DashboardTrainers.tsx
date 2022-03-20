import { useAppContext } from '@hubbl/data-access/contexts';
import { EmptyHandler } from '@hubbl/shared/types';
import { DashboardTrainers as TrainersGrid } from '@hubbl/ui/components';

import { useDashboard } from './hooks';

const DashboardTrainers = () => {
  const {
    token,
    user,
    API: { fetcher }
  } = useAppContext();

  const { data,  } = useDashboard({
    run: !!token.parsed,
    gymId: user?.gym?.id,
    fetcher
  });

  const handleOnAddClick: EmptyHandler = () => {
    console.log('To be implemented');
  };

  return data ? (
    <TrainersGrid items={data.trainers} onAddTrainer={handleOnAddClick} />
  ) : null;
};

export default DashboardTrainers;
