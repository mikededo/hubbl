import { FormProvider, useForm } from 'react-hook-form';

import { SingleHandler } from '@hubbl/shared/types';
import { Save } from '@mui/icons-material';
import { Button, Divider, Stack } from '@mui/material';

import Base, { BaseProps } from '../Base';
import DialogSection from '../DialogSection';
import { GymZoneFormFields } from '../types';
import GymZoneCapacity from './GymZoneCapacity';
import GymZoneCloseTime from './GymZoneCloseTime';
import GymZoneDescription from './GymZoneDescription';
import GymZoneName from './GymZoneName';
import GymZoneOpenTime from './GymZoneOpenTime';
import GymZoneProperties from './GymZoneProperties';

export type GymZoneDialogProps = {
  /**
   * Default values of the form
   *
   * @default undefined
   */
  defaultValues?: GymZoneFormFields;

  /**
   * Callback to run when the form has been successfully
   * submitted.
   *
   * @default undefined
   */
  onSubmit?: SingleHandler<GymZoneFormFields>;
} & BaseProps;

const GymZoneDialog = ({
  defaultValues,
  onSubmit,
  ...props
}: GymZoneDialogProps): JSX.Element => {
  const methods = useForm<GymZoneFormFields>({ defaultValues });

  const handleOnSubmit = (data: GymZoneFormFields) => {
    onSubmit?.(data);
  };

  return (
    <Base {...props}>
      <form onSubmit={methods.handleSubmit(handleOnSubmit)}>
        <FormProvider {...methods}>
          <DialogSection>
            <Stack width="100%" gap={2}>
              <GymZoneName />

              <GymZoneDescription />
            </Stack>
          </DialogSection>

          <Divider />

          <DialogSection>
            <Stack width="100%" gap={1.5}>
              <GymZoneProperties />

              <Stack
                direction={{ xs: 'column', sm: 'column', md: 'row' }}
                gap={{ xs: 1, sm: 1, md: 3 }}
              >
                <GymZoneOpenTime />

                <GymZoneCloseTime />
              </Stack>

              <Stack
                direction={{ xs: 'column', sm: 'column', md: 'row' }}
                gap={{ xs: 1, sm: 1, md: 3 }}
              >
                <GymZoneCapacity />
              </Stack>
            </Stack>
          </DialogSection>

          <Divider />

          <DialogSection footer>
            <Stack alignItems="flex-end">
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

export default GymZoneDialog;
