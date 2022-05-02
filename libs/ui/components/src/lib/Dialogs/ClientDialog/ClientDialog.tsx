import { useEffect } from 'react';

import { FormProvider, useForm } from 'react-hook-form';

import { EmptyHandler, Gender, SingleHandler } from '@hubbl/shared/types';
import { Delete, Save } from '@mui/icons-material';
import { Typography, Button, Divider, Stack } from '@mui/material';
import { ResponsiveStyleValue } from '@mui/system';

import Base, { BaseProps } from '../Base';
import DialogSection from '../DialogSection';
import {
  PersonEmail,
  PersonFirstName,
  PersonGender,
  PersonLastName,
  PersonPhone
} from '../Person';
import { ClientFormFields } from '../types';
import ClientPermissions from './ClientPermissions';

const StackDirections: ResponsiveStyleValue<'column' | 'row'> = {
  xs: 'column',
  sm: 'column',
  md: 'row',
  lg: 'row',
  xl: 'row'
};

export type ClientDialogProps = {
  /**
   * Code of the gym to display in the information text
   */
  code?: string;

  /**
   * Default values of the form
   *
   * @default undefined
   */
  defaultValues?: Partial<ClientFormFields>;

  /**
   * Callback to run when the delete button has been pressed.
   * The delete button will only be displayed if such callback
   * has been passed
   *
   * @default undefined
   */
  onDelete?: EmptyHandler;

  /**
   * Callback to run when the form has been successfully
   * submitted.
   *
   * @default undefined
   */
  onSubmit?: SingleHandler<ClientFormFields>;
} & BaseProps;

const ClientDialog = ({
  code,
  defaultValues,
  onDelete,
  onSubmit,
  ...props
}: ClientDialogProps): JSX.Element => {
  const methods = useForm<ClientFormFields>({
    defaultValues: {
      ...defaultValues,
      gender: defaultValues?.gender ?? Gender.OTHER
    },
    shouldUnregister: true
  });

  const handleOnSubmit = (data: ClientFormFields) => {
    onSubmit?.({ ...data });
  };

  useEffect(() => {
    if (props.open) {
      methods.reset({
        ...defaultValues,
        gender: defaultValues?.gender ?? Gender.OTHER
      });
    }
  }, [props.open, defaultValues, methods]);

  return (
    <Base {...props}>
      <form onSubmit={methods.handleSubmit(handleOnSubmit)}>
        <FormProvider {...methods}>
          <DialogSection>
            <Stack gap={2}>
              <Stack direction={StackDirections} width="100%" gap={2}>
                <PersonFirstName />

                <PersonLastName />
              </Stack>

              <PersonEmail />

              <Stack direction={StackDirections} width="100%" gap={2}>
                <PersonPhone />

                <PersonGender fullWidth />
              </Stack>
            </Stack>
          </DialogSection>

          <Divider />

          <DialogSection>
            <ClientPermissions />
          </DialogSection>

          <Divider />

          {code && (
            <>
              <DialogSection>
                <Typography variant="body2">
                  The password of the client will be the gym code, which is:{' '}
                  {code}
                </Typography>
              </DialogSection>

              <Divider />
            </>
          )}

          <DialogSection footer>
            <Stack direction="row" justifyContent="flex-end" gap={2}>
              {onDelete && (
                <Button
                  title="delete"
                  color="error"
                  startIcon={<Delete />}
                  onClick={onDelete}
                >
                  Delete
                </Button>
              )}

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

export default ClientDialog;
