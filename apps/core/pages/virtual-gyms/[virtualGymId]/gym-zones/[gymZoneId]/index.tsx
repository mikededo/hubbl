import { ReactElement, useCallback, useMemo, useState } from 'react';

import { useRouter } from 'next/router';
import useSWR from 'swr';

import { useAppContext, useToastContext } from '@hubbl/data-access/contexts';
import { EventDTO, GymZoneDTO } from '@hubbl/shared/models/dto';
import { EmptyHandler, Hour, SingleHandler } from '@hubbl/shared/types';
import { Calendar, ContentCard, PageHeader } from '@hubbl/ui/components';
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
  const { onError } = useToastContext();
  const {
    token,
    API: { fetcher }
  } = useAppContext();

  const virtualGymHref = `/virtual-gyms/${router.query.virtualGymId}`;
  const gymZoneHref = `${virtualGymHref}/gym-zones/${router.query.gymZoneId}`;

  // Week state
  const [weekPage, setWeekPage] = useState(0);

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
    console.log({ monday, sunday });
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

  if (gymZone.error) {
    router.push('/404');
  }

  if (events.error) {
    onError(`${events.error}`);
  }

  const handleOnChangeWeekPage: SingleHandler<number, EmptyHandler> =
    (by: number) => () => {
      setWeekPage((prev) => prev + by);
    };

  return (
    <>
      <PageHeader
        title={`Gym zone - ${gymZone.data?.name ?? ''}`}
        breadcrumbs={[
          { href: '/virtual-gyms', label: 'Virtual gyms' },
          { href: virtualGymHref, label: 'Virtual gym name' },
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
              events={events.data ?? []}
              initialHour={hourRange.initial}
              finalHour={hourRange.final}
            />
          </Stack>
        </CalendarContentCard>
      </Stack>
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
