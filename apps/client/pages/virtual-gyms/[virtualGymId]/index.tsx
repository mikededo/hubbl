import { ReactElement, useMemo, useState } from 'react';

import { useRouter } from 'next/router';
import useSWR from 'swr';

import { useAppContext, useToastContext } from '@hubbl/data-access/contexts';
import {
  CalendarAppointmentDTO,
  VirtualGymDTO
} from '@hubbl/shared/models/dto';
import { EmptyHandler, SingleHandler } from '@hubbl/shared/types';
import {
  CalendarAppointmentDialog,
  CalendarAppointmentFormFields,
  ConfirmationDialog,
  GymZoneGrid,
  PageHeader,
  TodayEventsList
} from '@hubbl/ui/components';

import { BaseLayout, GeneralPages } from '../../../components';

const VirtualGym = () => {
  const router = useRouter();

  const { onError } = useToastContext();
  const {
    user,
    token,
    todayEvents,
    API: { fetcher, poster }
  } = useAppContext();
  const { data, error } = useSWR<VirtualGymDTO>(
    token.parsed ? `/virtual-gyms/${router.query.virtualGymId}` : null,
    fetcher,
    { revalidateOnFocus: false }
  );

  const [selectedCalendar, setSelectedCalendar] = useState<number>();
  const [createdAppointment, setCreatedAppoinment] =
    useState<CalendarAppointmentDTO>();

  const classGymZones = useMemo(() => {
    if (!data) {
      return [];
    }

    return data.gymZones.filter(({ isClassType }) => isClassType);
  }, [data]);

  const nonClassGymZones = useMemo(() => {
    if (!data) {
      return [];
    }

    return data.gymZones.filter(({ isClassType }) => !isClassType);
  }, [data]);

  const handleOnCloseCreationDialog: EmptyHandler = () => {
    setSelectedCalendar(null);
  };

  const handleOnCloseConfirmationDialog: EmptyHandler = () => {
    setCreatedAppoinment(null);
  };

  const handleOnNonClassClick: SingleHandler<number> = (zoneId) => {
    const iof = nonClassGymZones.findIndex(({ id }) => id === zoneId);

    setSelectedCalendar(nonClassGymZones[iof].calendar as number);
  };

  const handleOnCreateAppointment: SingleHandler<
    CalendarAppointmentFormFields
  > = async (formData) => {
    const calendar = selectedCalendar;
    setSelectedCalendar(null);

    try {
      const { interval, date, ...times } = formData;
      const appointment = await poster<CalendarAppointmentDTO>(
        '/appointments/calendars',
        {
          ...times,
          client: user.id,
          calendar,
          date: {
            year: date.getFullYear(),
            month: date.getMonth() + 1,
            day: date.getDate()
          }
        }
      );

      setCreatedAppoinment(appointment);
    } catch (e) {
      onError(e.response.data.message);
    }
  };

  if (error) {
    onError(error);
    router.push('/404');
  }

  return (
    <>
      <PageHeader
        title="Virtual gym"
        breadcrumbs={[
          { href: '/virtual-gyms', label: 'Virtual gyms' },
          {
            href: `/virtual-gyms/${router.query.virtualGymId}`,
            label: 'Virtual gym name'
          }
        ]}
      />

      <GymZoneGrid
        addButtonTitle=""
        header="Class gym zones"
        href={`/virtual-gyms/${router.query.virtualGymId}/gym-zones`}
        gymZones={classGymZones}
      />

      <GymZoneGrid
        addButtonTitle=""
        header="Non-class gym zones"
        gymZones={nonClassGymZones}
        onGymZoneClick={handleOnNonClassClick}
      />

      <TodayEventsList events={todayEvents} />

      <CalendarAppointmentDialog
        title="Create an appointment"
        calendar={selectedCalendar}
        open={!!selectedCalendar}
        onClose={handleOnCloseCreationDialog}
        onSubmit={handleOnCreateAppointment}
      />

      <ConfirmationDialog.CalendarAppointment
        appointment={createdAppointment}
        open={!!createdAppointment}
        onClose={handleOnCloseConfirmationDialog}
      />
    </>
  );
};

VirtualGym.getLayout = (page: ReactElement) => (
  <GeneralPages>
    <BaseLayout header="Gym name" selected="virtualGyms">
      {page}
    </BaseLayout>
  </GeneralPages>
);

export default VirtualGym;
