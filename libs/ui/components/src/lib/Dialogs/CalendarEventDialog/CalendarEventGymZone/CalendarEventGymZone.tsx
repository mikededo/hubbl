import { useEffect, useState } from 'react';

import { useFormContext } from 'react-hook-form';

import { GymZoneDTO } from '@hubbl/shared/models/dto';

import SelectInput, { SelectItem } from '../../../SelectInput';
import { CalendarEventFormFields } from '../../types';

export type CalendarEventGymZoneProps = {
  /**
   * Gym zone options of the select input
   */
  gymZones?: GymZoneDTO[];
};

const CalendarEventGymZone = ({
  gymZones
}: CalendarEventGymZoneProps): JSX.Element => {
  const { control, getValues, setValue } =
    useFormContext<CalendarEventFormFields>();

  // Keep the state
  const [options, setOptions] = useState<GymZoneDTO[]>([]);

  const mapGymZones = (): SelectItem[] =>
    (gymZones?.length ? gymZones : options).map((gz) => ({
      key: gz.id,
      value: gz.id,
      label: gz.name
    }));

  useEffect(() => {
    if (gymZones?.length) {
      setOptions(gymZones);
      setValue(
        'gymZone',
        getValues('gymZone') ? getValues('gymZone') : gymZones[0].id
      );
    }
  }, [gymZones, getValues, setValue]);

  return (
    <SelectInput
      control={control}
      formName="gymZone"
      label="Gym zone"
      placeholder="Select a gym zone"
      inputProps={{ title: 'calendar-event-gym-zone' }}
      options={mapGymZones()}
      disabled={!gymZones}
      required
    />
  );
};

export default CalendarEventGymZone;
