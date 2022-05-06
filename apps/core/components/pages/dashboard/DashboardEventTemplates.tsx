import { useState } from 'react';

import { useAppContext, useToastContext } from '@hubbl/data-access/contexts';
import { EventTemplateDTO } from '@hubbl/shared/models/dto';
import { EmptyHandler, SingleHandler } from '@hubbl/shared/types';
import {
  DashboardEventTemplates as EventTemplatesGrid,
  EventTemplateDialog,
  EventTemplateFormFields
} from '@hubbl/ui/components';

import { useDashboard } from './hooks';

const DashboardEventTemplates = () => {
  const { onError, onSuccess } = useToastContext();
  const {
    token,
    user,
    helpers: { hasAccess },
    API: { fetcher, poster }
  } = useAppContext();

  const { data, mutate } = useDashboard({
    run: !!token.parsed,
    gymId: user?.gym?.id,
    fetcher
  });

  // Dialog state
  const [open, setOpen] = useState(false);

  const handleOnAddClick: EmptyHandler = () => {
    setOpen(true);
  };

  const handleOnClose: EmptyHandler = () => {
    setOpen(false);
  };

  const handleOnSubmit: SingleHandler<EventTemplateFormFields> = async (
    formData
  ) => {
    setOpen(false);

    try {
      const created = await poster<EventTemplateDTO>('/event-templates', {
        name: formData.name,
        description: formData.description,
        capacity: formData.capacity,
        maskRequired: formData.maskRequired,
        difficulty: formData.difficulty,
        covidPassport: formData.covidPassport,
        type: formData.eventType,
        gym: user.gym.id
      });

      // Mutate the event template list
      await mutate({ ...data, templates: [created, ...data.templates] }, false);

      onSuccess('Event template created!');
    } catch (e) {
      onError(`${e}`);
    }
  };

  return (
    <>
      {data ? (
        <EventTemplatesGrid
          items={data.templates}
          onAddEventTemplate={
            hasAccess('createEventTemplates') ? handleOnAddClick : undefined
          }
        />
      ) : null}

      <EventTemplateDialog
        title="Create a template"
        open={open}
        onClose={handleOnClose}
        onSubmit={handleOnSubmit}
      />
    </>
  );
};

export default DashboardEventTemplates;
