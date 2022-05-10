import { useEffect, useState } from 'react';

import { useFormContext } from 'react-hook-form';

import { CalendarAppointmentFormFields } from '../../';
import SelectInput, { SelectItem } from '../../../SelectInput';

const parseTime = (time: string): string =>
  time.split(':').slice(0, 2).join(':');

const filterTime = (time: string): boolean => {
  const today = new Date();
  const [hours, minutes] = time.split(':');

  return (
    +hours > today.getHours() ||
    (+hours === today.getHours() && +minutes > today.getMinutes())
  );
};

export type CalendarAppointmentStartTimeProps = {
  times?: string[];
};

const CalendarAppointmentStartTime = ({
  times = []
}: CalendarAppointmentStartTimeProps): JSX.Element => {
  const {
    control,
    formState: { errors },
    getValues,
    setValue
  } = useFormContext<CalendarAppointmentFormFields>();

  const [options, setOptions] = useState<string[]>([]);

  const mapOptions = (): SelectItem[] =>
    options.map((time) => ({ key: time, label: time, value: time }));

  useEffect(() => {
    if (times?.length) {
      const parsed = times.reduce<string[]>((list, time) => {
        if (filterTime(time)) {
          return [...list, parseTime(time)];
        }

        return list;
      }, []);

      setOptions(parsed);
      setValue(
        'startTime',
        getValues('startTime') ? getValues('startTime') : parsed[0]
      );
    }
  }, [times, getValues, setValue]);

  return (
    <SelectInput
      control={control}
      formName="startTime"
      title="calendar-appointment-start-time"
      label="Start time"
      placeholder="Select the start time"
      options={mapOptions()}
      disabled={!options?.length}
      error={!!errors.startTime}
      required
    />
  );
};

export default CalendarAppointmentStartTime;
