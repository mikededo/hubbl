import { useFormContext } from 'react-hook-form';

import { GymZoneIntervals } from '@hubbl/shared/types';

import SelectInput from '../../../SelectInput';
import { CalendarAppointmentFormFields } from '../../types';

const GenderOptions = [
  {
    key: `${GymZoneIntervals.FIFTEEN}`,
    value: GymZoneIntervals.FIFTEEN,
    label: '00:15'
  },
  {
    key: `${GymZoneIntervals.THIRTEEN}`,
    value: GymZoneIntervals.THIRTEEN,
    label: '00:30'
  },
  {
    key: `${GymZoneIntervals.FOURTYFIVE}`,
    value: GymZoneIntervals.FOURTYFIVE,
    label: '00:45'
  },
  {
    key: `${GymZoneIntervals.HOUR}`,
    value: GymZoneIntervals.HOUR,
    label: '01:00'
  },
  {
    key: `${GymZoneIntervals.HOURFIFTEEN}`,
    value: GymZoneIntervals.HOURFIFTEEN,
    label: '01:15'
  },
  {
    key: `${GymZoneIntervals.HOURTHIRTY}`,
    value: GymZoneIntervals.HOURTHIRTY,
    label: '01:30'
  },
  {
    key: `${GymZoneIntervals.HOURFORTYFIVE}`,
    value: GymZoneIntervals.HOURFORTYFIVE,
    label: '01:45'
  },
  {
    key: `${GymZoneIntervals.HOURS}`,
    value: GymZoneIntervals.HOURS,
    label: '02:00'
  }
];

type PersonGenderProps = {
  /**
   * Whether the input is disabled or not
   *
   * @default false
   */
  disabled?: boolean;
};

// Finish tests and add api to save appointments #time 1h 45m

const CalendarAppointmentInterval = ({
  disabled = false
}: PersonGenderProps) => {
  const { control } = useFormContext<CalendarAppointmentFormFields>();

  return (
    <SelectInput
      label="Interval"
      inputProps={{ title: 'calendar-appointment-interval' }}
      type="text"
      placeholder="01:00"
      disabled={disabled}
      control={control}
      formName="interval"
      options={GenderOptions}
    />
  );
};

export default CalendarAppointmentInterval;
