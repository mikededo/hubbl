import React, { useEffect, useState } from 'react';

import { useFormContext } from 'react-hook-form';

import { EventTypeDTO } from '@hubbl/shared/models/dto';

import SelectInput, { SelectItem } from '../../../SelectInput';
import { EventTemplateFormFields } from '../../types';

export type EventTemplateEventTypeProps = {
  eventTypes?: EventTypeDTO[];
};

const EventTemplateEventType = ({
  eventTypes
}: EventTemplateEventTypeProps): JSX.Element => {
  const { control, getValues, setValue } =
    useFormContext<EventTemplateFormFields>();

  // A state is required since, whent he dialog unmounts,
  // the eventTypes prop becomes undefined and therefore,
  // no more options exist. A select without options throws a
  // mui console warning
  const [options, setOptions] = useState<EventTypeDTO[]>([]);

  const mapEventTypes = (): SelectItem[] => {
    const values = (eventTypes?.length ? eventTypes : options).map((et) => ({
      key: et.id,
      value: et.id,
      label: et.name
    }));

    // Add null value
    return [{ key: 'empty', value: '', label: 'None' }, ...values];
  };

  useEffect(() => {
    if (eventTypes?.length) {
      setOptions(eventTypes);
      setValue(
        'eventType',
        getValues('eventType') ? getValues('eventType') : eventTypes[0].id
      );
    }
  }, [eventTypes, getValues, setValue]);

  return (
    <SelectInput
      control={control}
      formName="eventType"
      label="Event type (optional)"
      // Placehoder is not displayed, but used in tests
      placeholder="Select an event type (optional)"
      inputProps={{ title: 'event-template-event-type' }}
      options={mapEventTypes()}
      disabled={!eventTypes?.length}
      required
    />
  );
};

export default EventTemplateEventType;
