import React, { useEffect, useState } from 'react';

import { useFormContext } from 'react-hook-form';

import { EventTypeDTO } from '@hubbl/shared/models/dto';

import SelectInput, { SelectItem } from '../../../SelectInput';
import { CalendarEventFormFields } from '../../types';

export type CalendarEventTypeProps = {
  eventTypes?: EventTypeDTO[];
};

const CalendarEventType = ({
  eventTypes
}: CalendarEventTypeProps): JSX.Element => {
  const { control, getValues, setValue, watch } =
    useFormContext<CalendarEventFormFields>();

  const [options, setOptions] = useState<EventTypeDTO[]>([]);

  const mapEventTypes = (): SelectItem[] =>
    (eventTypes?.length ? eventTypes : options).map((et) => ({
      key: et.id,
      value: et.id,
      label: et.name
    }));

  useEffect(() => {
    if (eventTypes?.length) {
      setOptions(eventTypes);
      setValue(
        'type',
        getValues('type') ? getValues('type') : eventTypes[0].id
      );
    }
  }, [eventTypes, getValues, setValue]);

  return (
    <SelectInput
      control={control}
      formName="type"
      label="Event type"
      // Placehoder is not displayed, but used in tests
      placeholder="Select an event type"
      inputProps={{ title: 'calendar-event-type' }}
      options={mapEventTypes()}
      disabled={!eventTypes?.length || !!watch('template')}
      required
    />
  );
};

export default CalendarEventType;
