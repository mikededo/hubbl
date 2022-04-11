import { ReactElement, useCallback, useMemo, useState } from 'react';

import { useRouter } from 'next/router';
import useSWR from 'swr';

import {
  useAppContext,
  useLoadingContext,
  useToastContext
} from '@hubbl/data-access/contexts';
import {
  EventDTO,
  EventTypeDTO,
  GymZoneDTO,
  VirtualGymDTO
} from '@hubbl/shared/models/dto';
import { EmptyHandler, Hour, SingleHandler } from '@hubbl/shared/types';
import {
  Calendar,
  CalendarEventDialog,
  CalendarEventFormFields,
  ContentCard,
  EventSpot,
  PageHeader,
  useCalendarEventDialog
} from '@hubbl/ui/components';
import { weekInitialDay } from '@hubbl/utils';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { IconButton, Stack, styled, Typography } from '@mui/material';

import { BaseLayout, GeneralPages } from '../../../../../components';

type HourRange = {
  /**
   * Initial hour of the range
   */
  initial: Hour;

  /**
   * Final hour of the range
   */
  final: Hour;
};

type EventDialogState = {
  /**
   * Date clicked
   */
  date: Date;

  /**
   * Time at which the event starts
   */
  startTime: string;

  /**
   * Time at which the event ends
   */
  endTime: string;

  /**
   * Whether the modal is opened or not
   */
  open: boolean;
};

const InitialEventDialogState: EventDialogState = {
  open: false,
  date: null,
  startTime: null,
  endTime: null
};

const SidePadded = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 3)
}));

const CalendarContentCard = styled(ContentCard)(({ theme }) => ({
  paddingTop: theme.spacing(2),
  overflow: 'hidden'
}));

/**
 * Generates the `startDate` param for the events query
 *
 * @param iteration The amount of weeks to go forward (negative int) or
 * backwards (positive int)
 * @returns The `startDate` param
 */
const getStartDateParam = (iteration: number): string => {
  const initial = weekInitialDay(iteration);

  return `startDate=${initial.getFullYear()}-${`${
    initial.getMonth() + 1
  }`.padStart(2, '0')}-${`${initial.getDate()}`.padStart(2, '0')}`;
};

const GymZone = () => {
  const router = useRouter();
  const { onPopLoading, onPushLoading } = useLoadingContext();
  const { onError } = useToastContext();
  const {
    user,
    token,
    API: { fetcher, poster }
  } = useAppContext();

  const virtualGymHref = `/virtual-gyms/${router.query.virtualGymId}`;
  const gymZoneHref = `${virtualGymHref}/gym-zones/${router.query.gymZoneId}`;

  // Dialog state
  const [eventDialog, setEventDialog] = useState<EventDialogState>(
    InitialEventDialogState
  );

  const dialogData = useCalendarEventDialog({
    virtualGym: +router.query.virtualGymId
  });

  // Week state
  const [weekPage, setWeekPage] = useState(0);

  const virtualGym = useSWR<VirtualGymDTO>(
    token.parsed && router.query.virtualGymId ? `${virtualGymHref}` : null,
    fetcher,
    { revalidateOnFocus: false }
  );

  const gymZone = useSWR<GymZoneDTO>(
    token.parsed && router.query.gymZoneId ? `${gymZoneHref}` : null,
    fetcher,
    { revalidateOnFocus: false }
  );

  const events = useSWR<EventDTO[]>(
    gymZone.data
      ? `/calendars/${gymZone.data.calendar}/events?${getStartDateParam(
          weekPage
        )}`
      : null,
    fetcher,
    { revalidateOnFocus: false }
  );

  const hourRange = useMemo<HourRange>(() => {
    if (!gymZone.data) {
      return { initial: 8 as Hour, final: 17 as Hour };
    }

    return {
      initial: +gymZone.data.openTime.split(':')[0] as Hour,
      final: +gymZone.data.closeTime.split(':')[0] as Hour
    };
  }, [gymZone.data]);

  /**
   * Maps the event types to their id in order to make searches
   * faster
   */
  const idToEventType = useMemo<Record<number, EventTypeDTO>>(() => {
    if (!dialogData.eventTypes) {
      return {};
    }

    return dialogData.eventTypes.reduce(
      (prev, event) => ({
        ...prev,
        [event.id]: event
      }),
      {}
    );
  }, [dialogData.eventTypes]);

  const calendarDateRange = useCallback(() => {
    const monday = weekInitialDay(weekPage);
    const sunday = weekInitialDay(weekPage);

    sunday.setDate(monday.getDate() + 6);

    const first = monday.toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric'
    });
    const last = sunday.toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric'
    });

    return `${first} - ${last}`;
  }, [weekPage]);

  const handleOnChangeWeekPage: SingleHandler<number, EmptyHandler> =
    (by: number) => () => {
      setWeekPage((prev) => prev + by);
    };

  const handleOnSpotClick: SingleHandler<EventSpot> = ({ hour, day }) => {
    const clickedDate = weekInitialDay(weekPage);
    clickedDate.setDate(clickedDate.getDate() + day - clickedDate.getDay());

    setEventDialog({
      open: true,
      date: clickedDate,
      startTime: `${`${hour}`.padStart(2, '0')}:00`,
      endTime: `${`${hour + 1}`.padStart(2, '0')}:00`
    });
  };

  const handleOnCloseEventDialog: EmptyHandler = () => {
    setEventDialog(InitialEventDialogState);
  };

  const handleOnSubmitEvent: SingleHandler<CalendarEventFormFields> = async (
    formData
  ) => {
    setEventDialog(InitialEventDialogState);
    onPushLoading();
    console.log({ formData });
    try {
      const created = await poster<EventDTO>('events', {
        // Fields that do not need parse
        name: formData.name,
        description: formData.description,
        capacity: formData.capacity,
        maskRequired: formData.maskRequired,
        covidPassport: formData.covidPassport,
        startTime: formData.startTime,
        endTime: formData.endTime,
        trainer: formData.trainer,
        difficulty: formData.difficulty,
        calendar: gymZone.data.calendar,
        gym: user.gym.id,
        // Fields that need to be parsed
        template: formData.template ? formData.template : undefined,
        date: {
          year: formData.date.getFullYear(),
          month: formData.date.getMonth() + 1,
          day: formData.date.getDate()
        },
        eventType: formData.type
      });

      // Set appointment count of created event
      created.appointmentCount = 0;
      // Set type from the list of types
      created.eventType = idToEventType[created.eventType as number];

      await events.mutate([...events.data, created], false);
    } catch (e) {
      // Get message from axios error
      onError(`${e.response.data.message}`);
    }

    onPopLoading();
  };

  // Use else if so router is only called once
  if (virtualGym.error) {
    router.push('/404');
  } else if (gymZone.error) {
    router.push('/404');
  }

  if (events.error) {
    onError(`${events.error}`);
  }

  return (
    <>
      <PageHeader
        title={`Gym zone - ${gymZone.data?.name ?? ''}`}
        breadcrumbs={[
          { href: '/virtual-gyms', label: 'Virtual gyms' },
          { href: virtualGymHref, label: virtualGym.data?.name },
          { href: gymZoneHref, label: gymZone.data?.name }
        ]}
      />

      <Stack spacing={1}>
        <Stack direction="row" justifyContent="flex-end" alignItems="center">
          <IconButton
            aria-label="prev-week"
            size="small"
            onClick={handleOnChangeWeekPage(1)}
          >
            <ChevronLeft fontSize="large" />
          </IconButton>

          <IconButton
            aria-label="next-week"
            size="small"
            onClick={handleOnChangeWeekPage(-1)}
          >
            <ChevronRight fontSize="large" />
          </IconButton>
        </Stack>

        <CalendarContentCard>
          <Stack spacing={2}>
            <SidePadded>
              <Typography variant="h6">
                Calendar - {gymZone.data?.name}
              </Typography>

              <Typography>{calendarDateRange()}</Typography>
            </SidePadded>

            <Calendar
              currentWeek={!weekPage}
              pastWeek={weekPage > 0}
              events={events.data ?? []}
              initialHour={hourRange.initial}
              finalHour={hourRange.final}
              onSpotClick={handleOnSpotClick}
            />
          </Stack>
        </CalendarContentCard>
      </Stack>

      <CalendarEventDialog
        title="Create an event"
        dialogData={dialogData}
        defaultValues={{
          date: eventDialog?.date,
          startTime: eventDialog?.startTime,
          endTime: eventDialog?.endTime,
          gymZone: router.query.gymZoneId as string
        }}
        open={eventDialog.open}
        onClose={handleOnCloseEventDialog}
        onSubmit={handleOnSubmitEvent}
      />
    </>
  );
};

GymZone.getLayout = (page: ReactElement) => (
  <GeneralPages>
    <BaseLayout header="Gym name" selected="virtualGyms">
      {page}
    </BaseLayout>
  </GeneralPages>
);

export default GymZone;
