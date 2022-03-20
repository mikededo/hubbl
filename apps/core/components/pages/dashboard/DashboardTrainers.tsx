import useSWR from 'swr';

import { DashboardResponse } from '@hubbl/data-access/api';
import { useAppContext } from '@hubbl/data-access/contexts';
import { EmptyHandler } from '@hubbl/shared/types';
import { DashboardTrainers as TrainersGrid } from '@hubbl/ui/components';

const DashboardTrainers = () => {
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
    <TrainersGrid items={data.trainers} onAddTrainer={handleOnAddClick} />
  ) : null;
};

export default DashboardTrainers;
