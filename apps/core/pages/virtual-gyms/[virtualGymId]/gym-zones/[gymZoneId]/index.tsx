import { ReactElement, useCallback, useMemo, useState } from 'react';

import { useRouter } from 'next/router';
import useSWR from 'swr';

import { useAppContext, useToastContext } from '@hubbl/data-access/contexts';
import {
  EventDTO,
  EventTemplateDTO,
  EventTypeDTO,
  GymZoneDTO,
  TrainerDTO,
  VirtualGymDTO
} from '@hubbl/shared/models/dto';
import { CalendarDate } from '@hubbl/shared/models/entities';
import { EmptyHandler, Hour, SingleHandler } from '@hubbl/shared/types';
import {
  Calendar,
  CalendarEventDialog,
  CalendarEventFormFields,
  ContentCard,
  EventSpot,
  PageHeader,
  TodayEventsList,
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
   * Whether the modal is opened or not
   */
  status: 'create' | 'edit' | undefined;

  // Fields required for every instance

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

  // Fields required when editing

  /**
   * Id of the clicked event
   */
  id?: number;

  /**
   * Name of the clicked event
   */
  name?: string;

  /**
   * Description of the clicked event
   */
  description?: string;

  /**
   * Whether the event requires mask
   */
  maskRequired?: boolean;

  /**
   * Difficulty of the event
   */
  capacity?: number;

  /**
   * Difficulty of the event
   */
  difficulty?: number;

  /**
   * Whether the event requires to have the covid passport
   */
  covidPassport?: boolean;

  /**
   * Event type identifier of the event
   */
  type?: number;

  /**
   * Event template identifier of the event
   */
  template?: number;

  /**
   * Trainer identifier of the event
   */
  trainer?: number;
};

const InitialEventDialogState: EventDialogState = {
  status: null,
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

const parseFormDataFields = (
  formData: CalendarEventFormFields
): Record<string, unknown> => ({
  name: formData.name,
  description: formData.description,
  capacity: formData.capacity,
  maskRequired: formData.maskRequired,
  covidPassport: formData.covidPassport,
  startTime: formData.startTime,
  endTime: formData.endTime,
  trainer: formData.trainer,
  difficulty: formData.difficulty,
  // Fields that need to be parsed
  template: formData.template ? formData.template : undefined,
  date: {
    year: formData.date.getFullYear(),
    month: formData.date.getMonth() + 1,
    day: formData.date.getDate()
  },
  eventType: formData.type
});

const isToday = ({ year, month, day }: CalendarDate) => {
  const today = new Date();

  return (
    today.getFullYear() === year &&
    today.getMonth() === month - 1 &&
    today.getDate() === day
  );
};

const GymZone = () => {
  const router = useRouter();
  const { onError, onSuccess } = useToastContext();
  const {
    user,
    token,
    todayEvents,
    helpers: { hasAccess },
    API: { fetcher, poster, putter, todayEvents: todayEventsApi }
  } = useAppContext();

  const virtualGymHref = `/virtual-gyms/${router.query.virtualGymId}`;
  const gymZoneHref = `${virtualGymHref}/gym-zones/${router.query.gymZoneId}`;

  /**
   * Create, update or delete permissions
   */
  const CUD =
    hasAccess('createEvents') ||
    hasAccess('updateEvents') ||
    hasAccess('deleteEvents');

  // Dialog state
  const [eventDialog, setEventDialog] = useState<EventDialogState>(
    InitialEventDialogState
  );

  const dialogData = useCalendarEventDialog({
    virtualGym: +router.query.virtualGymId,
    shouldRun: CUD
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
      (prev, event) => ({ ...prev, [event.id]: event }),
      {}
    );
  }, [dialogData.eventTypes]);

  /**
   * Maps the event templates to their id in order to make searches
   * faster
   */
  const idToEventTemplate = useMemo<Record<number, EventTemplateDTO>>(() => {
    if (!dialogData.eventTemplates) {
      return {};
    }

    return dialogData.eventTemplates.reduce(
      (prev, template) => ({ ...prev, [template.id]: template }),
      {}
    );
  }, [dialogData.eventTemplates]);

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

  const handleOnEventClick: SingleHandler<EventDTO> = useCallback((event) => {
    const { date } = event;

    setEventDialog({
      status: 'edit',
      date: new Date(`${date.year}/${date.month}/${date.day}`),
      startTime: event.startTime,
      endTime: event.endTime,
      id: event.id,
      capacity: event.capacity,
      covidPassport: event.covidPassport,
      description: event.description,
      difficulty: event.difficulty,
      maskRequired: event.maskRequired,
      name: event.name,
      template: (event?.template as EventTemplateDTO)?.id,
      trainer: (event.trainer as TrainerDTO<number>).id,
      type: (event.eventType as EventTypeDTO).id
    });
  }, []);

  const handleOnSpotClick: SingleHandler<EventSpot> = useCallback(
    ({ hour, day }) => {
      const clickedDate = weekInitialDay(weekPage);

      clickedDate.setDate(
        clickedDate.getDate() + (!day ? 7 : day) - clickedDate.getDay()
      );

      setEventDialog({
        status: 'create',
        date: clickedDate,
        startTime: `${`${hour}`.padStart(2, '0')}:00`,
        endTime: `${`${hour + 1}`.padStart(2, '0')}:00`
      });
    },
    [weekPage]
  );

  const handleOnCloseEventDialog: EmptyHandler = useCallback(() => {
    setEventDialog(InitialEventDialogState);
  }, []);

  const handleOnSubmitEvent: SingleHandler<CalendarEventFormFields> = async (
    formData
  ) => {
    setEventDialog(InitialEventDialogState);

    try {
      const created = await poster<EventDTO>('events', {
        ...parseFormDataFields(formData),
        calendar: gymZone.data.calendar,
        gym: user.gym.id
      });

      // Revalidate if event created is from today
      if (isToday(created.date)) {
        todayEventsApi.revalidate();
      }

      // Set appointment count of created event
      created.appointmentCount = 0;
      // Set type from the list of types
      created.eventType = idToEventType[created.eventType as number];
      // Set template from the list of templates - undefined if none
      created.template = idToEventTemplate[created.template as number];

      await events.mutate([...events.data, created], false);

      onSuccess('Event created successfully!');
    } catch (e) {
      // Get message from axios error
      onError(`${e.response.data.message}`);
    }
  };

  const handleOnUpdateEvent: SingleHandler<CalendarEventFormFields> = async (
    formData
  ) => {
    const { id } = eventDialog;
    setEventDialog(InitialEventDialogState);

    try {
      const updated = parseFormDataFields(formData);

      await putter<EventDTO>('events', {
        ...updated,
        id,
        calendar: gymZone.data.calendar,
        gym: user.gym.id
      });

      // Revalidate if event updated is from today
      if (isToday(updated.date as CalendarDate)) {
        todayEventsApi.revalidate();
      }

      // Find element to update
      const outdated = {
        ...events.data.find(({ id: eventId }) => id === eventId),
        ...updated
      };

      // Set type from the list of types
      outdated.eventType = idToEventType[outdated.eventType as number];
      // Set template from the list of templates - undefined if none
      outdated.template = idToEventTemplate[outdated.template as number];

      await events.mutate(
        events.data.map((event) =>
          event.id === outdated.id ? outdated : event
        ) as EventDTO[],
        false
      );

      onSuccess('Event updated successfully!');
    } catch (e) {
      // Get message from axios error
      onError(`${e.response.data.message}`);
    }
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

  // FInish today's events testing #time 30m

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
              onEventClick={
                hasAccess('updateEvents') ? handleOnEventClick : undefined
              }
              onSpotClick={
                hasAccess('createEvents') ? handleOnSpotClick : undefined
              }
            />
          </Stack>
        </CalendarContentCard>
      </Stack>

      <TodayEventsList events={todayEvents} />

      {CUD && (
        <CalendarEventDialog
          title={`${
            eventDialog.status === 'create' ? 'Create' : 'Edit'
          } an event`}
          dialogData={dialogData}
          defaultValues={{
            date: eventDialog?.date,
            startTime: eventDialog?.startTime,
            endTime: eventDialog?.endTime,
            gymZone: router.query.gymZoneId as string,
            capacity: eventDialog?.capacity,
            covidPassport: eventDialog?.covidPassport,
            description: eventDialog?.description,
            difficulty: eventDialog?.difficulty,
            maskRequired: eventDialog?.maskRequired,
            name: eventDialog?.name,
            template: eventDialog?.template,
            trainer: eventDialog?.trainer,
            type: eventDialog?.type
          }}
          open={!!eventDialog.status}
          onClose={handleOnCloseEventDialog}
          onSubmit={
            eventDialog.status === 'create'
              ? hasAccess('createEvents')
                ? handleOnSubmitEvent
                : undefined
              : hasAccess('updateEvents')
              ? handleOnUpdateEvent
              : undefined
          }
        />
      )}
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
