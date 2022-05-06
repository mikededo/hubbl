import useSWR from 'swr';

import { useAppContext, useToastContext } from '@hubbl/data-access/contexts';
import {
  EventTemplateDTO,
  EventTypeDTO,
  GymZoneDTO,
  TrainerDTO
} from '@hubbl/shared/models/dto';

type UseEventDialogProps = {
  /**
   * Indentifier of the current virtual gym, which is required
   * in order to fetch the gym zones
   */
  virtualGym: number;

  /**
   * Whether the hook should make the API calls or not. This is in case
   * the user does not have permissions to create/edit/update events, so
   * the hook is not run
   *
   * @default true
   */
  shouldRun?: boolean;
};

export type UseEventDialogResult = {
  eventTypes?: EventTypeDTO[];
  eventTemplates?: EventTemplateDTO[];
  gymZones?: GymZoneDTO[];
  trainers?: TrainerDTO<number>[];
};

export const OnErrorResult: UseEventDialogResult = {
  eventTypes: undefined,
  eventTemplates: undefined,
  gymZones: undefined,
  trainers: undefined
};

export const useCalendarEventDialog = ({
  shouldRun = true,
  virtualGym
}: UseEventDialogProps) => {
  const {
    token,
    API: { fetcher }
  } = useAppContext();
  const { onError } = useToastContext();

  // Fetch the data
  const eventTypes = useSWR<EventTypeDTO[]>(
    token?.parsed && shouldRun ? '/event-types' : null,
    fetcher,
    { revalidateOnFocus: false }
  );
  const eventTemplates = useSWR<EventTemplateDTO[]>(
    token?.parsed && shouldRun ? '/event-templates' : null,
    fetcher,
    { revalidateOnFocus: false }
  );
  const gymZones = useSWR<GymZoneDTO[]>(
    token?.parsed && shouldRun ? `/virtual-gyms/${virtualGym}/gym-zones` : null,
    fetcher,
    { revalidateOnFocus: false }
  );
  const trainers = useSWR<TrainerDTO<number>[]>(
    token?.parsed && shouldRun ? '/persons/trainers' : null,
    fetcher,
    { revalidateOnFocus: false }
  );

  // Check erros
  if (eventTypes.error) {
    onError(`${eventTypes.error}`);

    return OnErrorResult;
  }

  if (eventTemplates.error) {
    onError(`${eventTemplates.error}`);

    return OnErrorResult;
  }

  if (gymZones.error) {
    onError(`${gymZones.error}`);

    return OnErrorResult;
  }

  if (trainers.error) {
    onError(`${trainers.error}`);

    return OnErrorResult;
  }

  return {
    eventTypes: eventTypes.data,
    eventTemplates: eventTemplates.data,
    gymZones: gymZones.data,
    trainers: trainers.data
  };
};
