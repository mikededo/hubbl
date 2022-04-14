import { useEffect, useState } from 'react';

import { useFormContext } from 'react-hook-form';

import { EventTemplateDTO, EventTypeDTO } from '@hubbl/shared/models/dto';

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
  const { control, setValue, watch } =
    useFormContext<CalendarEventFormFields>();

  // Keep the state
  const [options, setOptions] = useState<EventTemplateDTO[]>([]);

  // Watch the input
  const selected = watch('template');

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
    if (selected) {
      const template = templates?.find(({ id }) => selected === id);

      if (template) {
        setValue('name', template.name);
        setValue('description', template.description);
        setValue('capacity', template.capacity);
        setValue('maskRequired', template.maskRequired);
        setValue('covidPassport', template.covidPassport);
        setValue('type', (template.type as EventTypeDTO).id);
        setValue('difficulty', template.difficulty);
      }
    }
  }, [selected, templates, setValue]);

  useEffect(() => {
    if (templates?.length) {
      setOptions(templates);
    }
  }, [templates]);

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
