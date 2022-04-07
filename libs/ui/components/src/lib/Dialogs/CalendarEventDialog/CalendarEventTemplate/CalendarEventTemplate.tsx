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

  const mapTemplates = (): SelectItem[] =>
    (templates?.length ? templates : options).map((gz) => ({
      key: gz.id,
      value: gz.id,
      label: gz.name
    }));

  useEffect(() => {
    if (templates?.length) {
      setOptions(templates);
      setValue(
        'template',
        getValues('template') ? getValues('template') : templates[0].id
      );
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
      required
    />
  );
};

export default CalendarEventTemplate;
