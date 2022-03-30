import { useEffect } from 'react';

import { FormProvider, useForm } from 'react-hook-form';
import useSWR from 'swr';

import { useAppContext, useToastContext } from '@hubbl/data-access/contexts';
import { EventTypeDTO } from '@hubbl/shared/models/dto';
import { SingleHandler } from '@hubbl/shared/types';
import { Save } from '@mui/icons-material';
import { Button, CircularProgress, Divider, Stack } from '@mui/material';

import Base, { BaseProps } from '../Base';
import DialogSection from '../DialogSection';
import { EventTemplateFormFields } from '../types';
import EventTemplateCapacity from './EventTemplateCapacity';
import EventTemplateDescription from './EventTemplateDescription';
import EventTemplateName from './EventTemplateName';
import EventTemplateProperties from './EventTemplateProperties';
import EventTemplateVirtualEvent from './EventTemplateType';
import EventTemplateDifficulty from './EventTemplateDifficulty';

export type EventTemplateDialogProps = {
  /**
   * Default values of the form
   *
   * @default undefined
   */
  defaultValues?: Partial<EventTemplateFormFields>;

  /**
   * Callback to run when the form has been successfully
   * submitted
   *
   * @default undefined
   */
  onSubmit?: SingleHandler<EventTemplateFormFields>;
} & BaseProps;

const EventTemplateDialog = ({
  defaultValues,
  onSubmit,
  ...props
}: EventTemplateDialogProps): JSX.Element => {
  const {
    token,
    API: { fetcher }
  } = useAppContext();
  const { onError } = useToastContext();
  const { data, error } = useSWR<EventTypeDTO[]>(
    token?.parsed && props.open ? '/event-types' : null,
    fetcher,
    { revalidateOnFocus: false }
  );

  const methods = useForm<EventTemplateFormFields>({
    defaultValues: { ...defaultValues, eventType: '' },
    shouldUnregister: true,
    shouldFocusError: false
  });

  const handleOnSubmit = (data: EventTemplateFormFields) => {
    onSubmit?.(data);
  };

  if (error) {
    onError('An error occurred.');
  }

  useEffect(() => {
    if (data && data.length) {
      methods.reset({
        ...defaultValues,
        eventType: defaultValues?.eventType ?? data[0].id
      });
    }
  }, [data, defaultValues, methods]);

  return (
    <Base {...props}>
      <form onSubmit={methods.handleSubmit(handleOnSubmit)}>
        <FormProvider {...methods}>
          <DialogSection>
            <Stack width="100%" gap={2}>
              <EventTemplateName />

              <EventTemplateDescription />
            </Stack>
          </DialogSection>

          <Divider />

          <DialogSection>
            <Stack width="100%" gap={1.5}>
              <EventTemplateProperties />

              <Stack
                direction={{ xs: 'column', sm: 'column', md: 'row' }}
                gap={{ xs: 1, sm: 1, md: 3 }}
              >
                <EventTemplateCapacity />

                <EventTemplateVirtualEvent eventTypes={data} />
              </Stack>

              <EventTemplateDifficulty />
            </Stack>
          </DialogSection>

          <Divider />

          <DialogSection footer>
            <Stack direction="row" justifyContent="flex-end" gap={2}>
              {!data && <CircularProgress />}

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

export default EventTemplateDialog;
