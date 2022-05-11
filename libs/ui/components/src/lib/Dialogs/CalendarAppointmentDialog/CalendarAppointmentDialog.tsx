import { useEffect, useState } from 'react';

import { FormProvider, useForm } from 'react-hook-form';
import useSWR from 'swr';

import { useAppContext } from '@hubbl/data-access/contexts';
import { GymZoneIntervals, SingleHandler } from '@hubbl/shared/types';
import { FitnessCenter } from '@mui/icons-material';
import {
  Button,
  CircularProgress,
  Divider,
  Stack,
  Typography
} from '@mui/material';

import Base, { BaseProps } from '../Base';
import DialogSection from '../DialogSection';
import { CalendarAppointmentFormFields } from '../types';
import CalendarAppointmentDate from './CalendarAppointmentDate';
import CalendarAppointmentEndTime from './CalendarAppointmentEndTime';
import CalendarAppointmentInterval from './CalendarAppointmentInterval';
import CalendarAppointmentStartTime from './CalendarAppointmentStartTime';

type QueryDateState = {
  year: number;
  month: number;
  day: number;
};

const fetchUrl = (
  calendar: number,
  date: QueryDateState,
  interval: GymZoneIntervals
): string => {
  const { year, month, day } = date;

  return `/appointments/calendars/${calendar}?year=${year}&month=${month}&day=${day}&interval=${interval}`;
};

const getInitialDate = (): QueryDateState => {
  const today = new Date();

  return {
    year: today.getFullYear(),
    month: today.getMonth() + 1,
    day: today.getDate() + 1
  };
};

export type CalendarAppointmentDialogProps = {
  /**
   * Identifier of the calendar
   */
  calendar: number;

  /**
   * Default values of the form
   */
  defaultValues?: Partial<CalendarAppointmentFormFields>;

  /**
   * Callback to run when the form has been submitted
   */
  onSubmit?: SingleHandler<CalendarAppointmentFormFields>;
} & BaseProps;

const CalendarAppointmentDialog = ({
  calendar,
  defaultValues,
  onSubmit,
  ...props
}: CalendarAppointmentDialogProps): JSX.Element => {
  const {
    token,
    API: { fetcher }
  } = useAppContext();

  const [queryDate, setQueryDate] = useState<QueryDateState>(getInitialDate());

  const methods = useForm<CalendarAppointmentFormFields>({
    defaultValues: {
      ...defaultValues,
      interval: defaultValues?.interval ?? GymZoneIntervals.HOURTHIRTY
    },
    shouldUnregister: true,
    shouldFocusError: false
  });

  const { data } = useSWR<string[]>(
    token?.parsed && props.open && methods.watch('interval')
      ? // May be called everytime interval changes
        fetchUrl(calendar, queryDate, methods.watch('interval'))
      : null,
    fetcher,
    { revalidateOnFocus: false }
  );

  const date = methods.watch('date');

  const handleOnSubmit = (data: CalendarAppointmentFormFields) => {
    onSubmit?.(data);
  };

  useEffect(() => {
    const today = new Date();
    const parsed: QueryDateState = {
      year: (date ?? today).getFullYear(),
      month: (date ?? today).getMonth() + 1,
      day: (date ?? today).getDate()
    };

    if (
      parsed.year !== queryDate.year ||
      parsed.month !== queryDate.month ||
      parsed.day !== queryDate.day
    ) {
      setQueryDate(parsed);
    }
  }, [date, queryDate, setQueryDate]);

  useEffect(() => {
    if (props.open) {
      methods.reset({
        ...defaultValues,
        interval: defaultValues?.interval ?? GymZoneIntervals.HOURTHIRTY
      });
    }
  }, [props.open, defaultValues, methods]);

  return (
    <Base {...props}>
      <form onSubmit={methods.handleSubmit(handleOnSubmit)}>
        <FormProvider {...methods}>
          <DialogSection>
            <Stack gap={2}>
              <Typography variant="subtitle1">
                Choose the date of the appointment you want to create. Select
                the interval of your workout, to finally select the start of
                your workout!{' '}
                <span role="img" aria-label="strong-emoji">
                  💪🏼
                </span>
              </Typography>

              <Stack direction="row" gap={2}>
                <CalendarAppointmentDate />

                <CalendarAppointmentInterval />
              </Stack>

              <Stack direction="row" gap={2}>
                <CalendarAppointmentStartTime times={data} />

                <CalendarAppointmentEndTime />
              </Stack>
            </Stack>
          </DialogSection>

          <Divider />

          <DialogSection footer>
            <Stack direction="row" justifyContent="flex-end" gap={2}>
              {!data && <CircularProgress />}

              <Button
                type="submit"
                title="submit"
                startIcon={<FitnessCenter />}
              >
                Create
              </Button>
            </Stack>
          </DialogSection>
        </FormProvider>
      </form>
    </Base>
  );
};

export default CalendarAppointmentDialog;
