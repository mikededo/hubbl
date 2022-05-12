import { ReactElement, useCallback, useMemo, useState } from 'react';

import { useRouter } from 'next/router';
import useSWR from 'swr';

import { useAppContext } from '@hubbl/data-access/contexts';
import { EventDTO, GymZoneDTO, VirtualGymDTO } from '@hubbl/shared/models/dto';
import {
  EmptyHandler,
  Hour,
  HourRange,
  SingleHandler
} from '@hubbl/shared/types';
import {
  Calendar,
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

  const {
    token,
    todayEvents,
    API: { fetcher }
  } = useAppContext();

  const virtualGymHref = `/virtual-gyms/${router.query.virtualGymId}`;
  const gymZoneHref = `${virtualGymHref}/gym-zones/${router.query.gymZoneId}`;

  const [weekPage, setWeekPage] = useState(0);
  const [selectedEvent, setSelectedEvent] = useState<EventDTO>();

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
    setSelectedEvent(event);
  };

  const handleOnCloseCreateDialog: EmptyHandler = () => {
    setSelectedEvent(null);
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
        open={!!selectedEvent}
        event={selectedEvent}
        onClose={handleOnCloseCreateDialog}
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
