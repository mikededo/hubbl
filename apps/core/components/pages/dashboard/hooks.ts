import { DashboardResponse } from '@hubbl/data-access/api';
import useSWR, { Fetcher } from 'swr';

type UseDashboardProps = {
  /**
   * Condition to make or not the api call
   */
  run: boolean;

  /**
   * Identifier of the gym to get the dashboard
   */
  gymId: number;

  /**
   * Fetcher to make the api call
   */
  fetcher: Fetcher<never, string>;
};

export const useDashboard = ({ run, gymId, fetcher }: UseDashboardProps) =>
  useSWR<DashboardResponse>(
    // Wait for the user to be defined, before making the call
    run ? `/dashboards/${gymId}` : null,
    fetcher,
    { revalidateOnFocus: false }
  );
