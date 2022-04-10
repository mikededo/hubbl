import { useEffect, useState } from 'react';

import { useFormContext } from 'react-hook-form';

import { EventTemplateDTO } from '@hubbl/shared/models/dto';

import SelectInput, { SelectItem } from '../../../SelectInput';
import { CalendarEventFormFields } from '../../types';

export type CalendarEventTemplateProps = {
  /**
   * Event template options of the select input
   */
  templates?: EventTemplateDTO[];
};

const CalendarEventTemplate = ({
  templates
}: CalendarEventTemplateProps): JSX.Element => {
  const { control, getValues, setValue } =
    useFormContext<CalendarEventFormFields>();

  // Keep the state
  const [options, setOptions] = useState<EventTemplateDTO[]>([]);

  const mapTemplates = (): SelectItem[] => {
    const values = (templates?.length ? templates : options).map((gz) => ({
      key: gz.id,
      value: gz.id,
      label: gz.name
    }));

    // Add null value
    return [{ key: 'empty', value: '', label: 'None' }, ...values];
  };

  useEffect(() => {
    if (templates?.length) {
      setOptions(templates);
    }
  }, [templates, getValues, setValue]);

  return (
    <SelectInput
      control={control}
      formName="template"
      label="Template (optional)"
      placeholder="Select a template"
      inputProps={{ title: 'calendar-event-template' }}
      options={mapTemplates()}
      disabled={!templates}
    />
  );
};

export default CalendarEventTemplate;
