import { FormProvider, useForm } from 'react-hook-form';

import { AppPalette, SingleHandler } from '@hubbl/shared/types';
import { Save } from '@mui/icons-material';
import { Button, Stack } from '@mui/material';

import Base, { BaseProps } from '../Base';
import DialogSection from '../DialogSection';
import { EventTypeFormFields } from '../types';
import EventTypeColor from './EventTypeColor';
import EventTypeDescription from './EventTypeDescription';
import EventTypeName from './EventTypeName';

export type EventTypeDialogProps = {
  /**
   * Default values of the form
   *
   * @default undefined
   */
  defaultValues?: Partial<EventTypeFormFields>;

  /**
   * Callback to run whent he form has been successfully
   * submitted
   *
   * @default undefined
   */
  onSubmit?: SingleHandler<EventTypeFormFields>;
} & BaseProps;

const EventTypeDialog = ({
  defaultValues,
  onSubmit,
  ...props
}: EventTypeDialogProps): JSX.Element => {
  const methods = useForm<EventTypeFormFields>({
    defaultValues: { color: AppPalette.BLUE, ...defaultValues },
    shouldUnregister: true,
    shouldFocusError: false
  });

  const handleOnSubmit = (data: EventTypeFormFields) => {
    onSubmit?.(data);
  };

  return (
    <Base {...props}>
      <form onSubmit={methods.handleSubmit(handleOnSubmit)}>
        <FormProvider {...methods}>
          <DialogSection>
            <Stack width="100%" spacing={2}>
              <EventTypeName />

              <EventTypeDescription />

              <EventTypeColor/>
            </Stack>
          </DialogSection>

          <DialogSection footer>
            <Stack direction="row" justifyContent="flex-end" spacing={2}>
              <Button type="submit" title="submit" startIcon={<Save />}>
                Save
              </Button>
            </Stack>
          </DialogSection>
        </FormProvider>
      </form>
    </Base>
  );
};

export default EventTypeDialog;
