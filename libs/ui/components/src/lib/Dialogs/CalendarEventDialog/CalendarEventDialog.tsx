import { useEffect } from 'react';

import { FormProvider, useForm } from 'react-hook-form';

import { SingleHandler } from '@hubbl/shared/types';
import { Save } from '@mui/icons-material';
import { Button, Divider, Stack } from '@mui/material';

import Base, { BaseProps } from '../Base';
import DialogSection from '../DialogSection';
import { CalendarEventFormFields } from '../types';
import CalendarEventCapacity from './CalendarEventCapacity';
import CalendarEventDate from './CalendarEventDate';
import CalendarEventDescription from './CalendarEventDescription';
import CalendarEventDifficulty from './CalendarEventDifficulty';
import CalendarEventEndTime from './CalendarEventEndTime';
import CalendarEventGymZone from './CalendarEventGymZone';
import CalendarEventName from './CalendarEventName';
import CalendarEventProperties from './CalendarEventProperties';
import CalendarEventStartTime from './CalendarEventStartTime';
import CalendarEventTemplate from './CalendarEventTemplate';
import CalendarEventTrainer from './CalendarEventTrainer';
import CalendarEventType from './CalendarEventType';
import { UseEventDialogResult } from './useCalendarEventDialog';

export type CalendarEventDialogProps = {
  /**
   * Default values of the form
   */
  defaultValues: Partial<CalendarEventFormFields>;

  /**
   * Required data that is obtained using the dialog
   * hook. The data has to be provided in order to avoid making
   * api calls each time the modal is open.
   */
  dialogData: UseEventDialogResult;

  /**
   * Callback to run when the form has been submitted
   *
   * @default undefined
   */
  onSubmit?: SingleHandler<CalendarEventFormFields>;
} & BaseProps;

const CalendarEventDialog = ({
  dialogData,
  defaultValues,
  onSubmit,
  ...props
}: CalendarEventDialogProps): JSX.Element => {
  // Calendar event dialog hook result
  const { eventTypes, eventTemplates, gymZones, trainers } = dialogData;

  const methods = useForm<CalendarEventFormFields>({
    defaultValues: {
      ...defaultValues,
      type: defaultValues?.type ?? '',
      template: defaultValues?.template ?? '',
      gymZone: defaultValues?.gymZone ?? '',
      trainer: defaultValues?.trainer ?? ''
    },
    shouldUnregister: true,
    shouldFocusError: false
  });

  const handleOnSubmit = (data: CalendarEventFormFields) => {
    onSubmit?.(data);
  };

  useEffect(() => {
    if (props.open) {
      methods.reset({
        ...defaultValues,
        type: defaultValues?.type ?? '',
        template: defaultValues?.template ?? '',
        gymZone: defaultValues?.gymZone ?? '',
        trainer: defaultValues?.trainer ?? ''
      });
    }
  }, [props.open, defaultValues, methods]);

  return (
    <Base {...props}>
      <form onSubmit={methods.handleSubmit(handleOnSubmit)}>
        <FormProvider {...methods}>
          <DialogSection>
            <Stack width="100%" spacing={2}>
              <CalendarEventName />

              <CalendarEventDescription />
            </Stack>
          </DialogSection>

          <Divider />

          <DialogSection>
            <Stack width="100%" spacing={1.5}>
              <Stack
                direction={{ xs: 'column', sm: 'column', md: 'row' }}
                gap={{ xs: 1, sm: 1, md: 3 }}
              >
                <CalendarEventGymZone gymZones={gymZones ?? []} />

                <CalendarEventTrainer trainers={trainers ?? []} />
              </Stack>

              <Stack
                direction={{ xs: 'column', sm: 'column', md: 'row' }}
                gap={{ xs: 1, sm: 1, md: 3 }}
              >
                <CalendarEventTemplate templates={eventTemplates ?? []} />

                <CalendarEventDate />
              </Stack>
            </Stack>
          </DialogSection>

          <Divider />

          <DialogSection>
            <Stack width="100%" spacing={1.5}>
              <CalendarEventProperties />

              <Stack
                direction={{ xs: 'column', sm: 'column', md: 'row' }}
                gap={{ xs: 1, sm: 1, md: 3 }}
              >
                <CalendarEventStartTime />

                <CalendarEventEndTime />
              </Stack>

              <Stack
                direction={{ xs: 'column', sm: 'column', md: 'row' }}
                gap={{ xs: 1, sm: 1, md: 3 }}
              >
                <CalendarEventCapacity />

                <CalendarEventType eventTypes={eventTypes ?? []} />
              </Stack>

              <CalendarEventDifficulty />
            </Stack>
          </DialogSection>

          <Divider />

          <DialogSection footer>
            <Stack direction="row" justifyContent="flex-end" spacing={2}>
              <Button title="submit" type="submit" startIcon={<Save />}>
                Save
              </Button>
            </Stack>
          </DialogSection>
        </FormProvider>
      </form>
    </Base>
  );
};

export default CalendarEventDialog;
