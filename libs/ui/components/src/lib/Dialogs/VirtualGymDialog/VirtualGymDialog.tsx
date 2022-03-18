import { FormProvider, useForm } from 'react-hook-form';

import { SingleHandler } from '@hubbl/shared/types';
import { Save } from '@mui/icons-material';
import { Button, Divider, Stack } from '@mui/material';

import Base, { BaseProps } from '../Base';
import DialogSection from '../DialogSection';
import { VirtualGymFormFields } from '../types';
import VirtualGymCapacity from './VirtualGymCapacity';
import VirtualGymCloseTime from './VirtualGymCloseTime';
import VirtualGymDescription from './VirtualGymDescription';
import VirtualGymLocation from './VirtualGymLocation';
import VirtualGymName from './VirtualGymName';
import VirtualGymOpenTime from './VirtualGymOpenTime';
import VirtualGymPhone from './VirtualGymPhone';

export type VirtualGymDialogProps = {
  /**
   * Default values of the form
   *
   * @default undefined
   */
  defaultValues?: VirtualGymFormFields;

  /**
   * Callback to run when the form has been successfully
   * submitted.
   *
   * @default undefined
   */
  onSubmit?: SingleHandler<VirtualGymFormFields>;
} & BaseProps;

const VirtualGymDialog = ({
  defaultValues,
  onSubmit,
  ...props
}: VirtualGymDialogProps): JSX.Element => {
  const methods = useForm<VirtualGymFormFields>({ defaultValues });

  const handleOnSubmit = (data: VirtualGymFormFields) => {
    onSubmit?.(data);
  };

  return (
    <Base {...props}>
      <form onSubmit={methods.handleSubmit(handleOnSubmit)}>
        <FormProvider {...methods}>
          <DialogSection>
            <Stack width="100%" gap={2}>
              <VirtualGymName />

              <VirtualGymDescription />
            </Stack>
          </DialogSection>

          <Divider />

          <DialogSection>
            <Stack width="100%" gap={1.5}>
              <VirtualGymLocation />

              <Stack
                direction={{ xs: 'column', sm: 'column', md: 'row' }}
                gap={{ xs: 1, sm: 1, md: 3 }}
              >
                <VirtualGymPhone />

                <VirtualGymCapacity />
              </Stack>

              <Stack
                direction={{ xs: 'column', sm: 'column', md: 'row' }}
                gap={{ xs: 1, sm: 1, md: 3 }}
              >
                <VirtualGymOpenTime />

                <VirtualGymCloseTime />
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

export default VirtualGymDialog;
