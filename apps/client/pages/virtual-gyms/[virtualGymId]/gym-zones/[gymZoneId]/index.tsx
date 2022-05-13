import {
  Dispatch,
  ReactElement,
  SetStateAction,
  useCallback,
  useMemo,
  useState
} from 'react';

import { useRouter } from 'next/router';
import useSWR from 'swr';

import { useAppContext, useToastContext } from '@hubbl/data-access/contexts';
import {
  EventAppointmentDTO,
  EventDTO,
  GymZoneDTO,
  VirtualGymDTO
} from '@hubbl/shared/models/dto';
import {
  ConfirmationState,
  EmptyHandler,
  Hour,
  HourRange,
  SingleHandler
} from '@hubbl/shared/types';
import {
  Calendar,
  ConfirmationDialog,
  ContentCard,
  EventAppointmentDialog,
  PageHeader,
  TodayEventsList
} from '@hubbl/ui/components';
import { getStartDateParam, weekInitialDay } from '@hubbl/utils';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { IconButton, Stack, styled, Typography } from '@mui/material';

import { BaseLayout, GeneralPages } from '../../../../../components';

const SidePadded = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 3)
}));

const CalendarContentCard = styled(ContentCard)(({ theme }) => ({
  paddingTop: theme.spacing(2),
  overflow: 'hidden'
}));

const GymZone = (): JSX.Element => {
  const router = useRouter();

  const { onError } = useToastContext();
  const {
    user,
    token,
    todayEvents,
    API: { fetcher, poster }
  } = useAppContext();

  const virtualGymHref = `/virtual-gyms/${router.query.virtualGymId}`;
  const gymZoneHref = `${virtualGymHref}/gym-zones/${router.query.gymZoneId}`;

  const [weekPage, setWeekPage] = useState(0);

  const [selectedEvent, setSelectedEvent] = useState<
    ConfirmationState<EventDTO>
  >({
    open: false,
    value: null
  });
  const [appointConfirm, setAppointConfirm] = useState<
    ConfirmationState<EventAppointmentDTO>
  >({ open: false, value: null });

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

  const eventsUrl = `/calendars/${
    gymZone.data?.calendar
  }/events?${getStartDateParam(weekPage)}`;
  const events = useSWR<EventDTO[]>(gymZone.data ? eventsUrl : null, fetcher, {
    revalidateOnFocus: false
  });

  const hourRange = useMemo<HourRange>(() => {
    if (!gymZone.data) {
      return { initial: 8 as Hour, final: 17 as Hour };
    }

    return {
      initial: +gymZone.data.openTime.split(':')[0] as Hour,
      final: +gymZone.data.closeTime.split(':')[0] as Hour
    };
  }, [gymZone.data]);

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

  const handleOnClickEvent: SingleHandler<EventDTO> = (event) => {
    setSelectedEvent({ open: true, value: event });
  };

  const handleOnCloseDialog: SingleHandler<
    Dispatch<SetStateAction<ConfirmationState<unknown>>>,
    EmptyHandler
  > = (setter) => () => {
    setter((prev) => ({ ...prev, open: false }));
  };

  const handleOnCreateAppointment: EmptyHandler = async () => {
    const id = selectedEvent.value.id;
    handleOnCloseDialog(setSelectedEvent)();

    try {
      const appointment = await poster<EventAppointmentDTO>(
        '/appointments/events',
        { client: user.id, event: id }
      );

      // Mutate the list of events
      await events.mutate([
        ...events.data.map((event) => {
          if (event.id !== id) {
            return event;
          }

          const clone = { ...event } as EventAppointmentDTO;
          clone.appointmentCount++;
          return clone;
        })
      ]);

      setAppointConfirm({ open: true, value: appointment });
    } catch (e) {
      onError(e.response.data.message);
    }
  };

  // Use else if so router is only called once
  if (virtualGym.error) {
    router.push('/404');
  } else if (gymZone.error) {
    router.push('/404');
  }

  return (
    <>
      <PageHeader
        title={`Gym zone - ${gymZone.data?.name}`}
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
              onEventClick={handleOnClickEvent}
            />
          </Stack>
        </CalendarContentCard>
      </Stack>

      <TodayEventsList events={todayEvents} />

      <EventAppointmentDialog
        open={selectedEvent.open}
        event={selectedEvent.value}
        onClose={handleOnCloseDialog(setSelectedEvent)}
        onSubmit={handleOnCreateAppointment}
      />

      <ConfirmationDialog.Appointment
        open={appointConfirm.open}
        appointment={appointConfirm.value}
        onClose={handleOnCloseDialog(setAppointConfirm)}
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
