import { FormProvider, useForm } from 'react-hook-form';
import useSWR from 'swr';

import { useAppContext, useToastContext } from '@hubbl/data-access/contexts';
import { VirtualGymDTO } from '@hubbl/shared/models/dto';
import { SingleHandler } from '@hubbl/shared/types';
import { Save } from '@mui/icons-material';
import { Button, CircularProgress, Divider, Stack } from '@mui/material';

import Base, { BaseProps } from '../Base';
import DialogSection from '../DialogSection';
import { GymZoneFormFields } from '../types';
import GymZoneCapacity from './GymZoneCapacity';
import GymZoneCloseTime from './GymZoneCloseTime';
import GymZoneDescription from './GymZoneDescription';
import GymZoneName from './GymZoneName';
import GymZoneOpenTime from './GymZoneOpenTime';
import GymZoneProperties from './GymZoneProperties';
import GymZoneVirtualGym from './GymZoneVirtualGym';

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
  const {
    token,
    API: { fetcher }
  } = useAppContext();
  const { onError } = useToastContext();
  const { data, error } = useSWR<VirtualGymDTO[]>(
    token?.parsed && props.open ? '/virtual-gyms' : null,
    fetcher,
    { revalidateOnFocus: false }
  );

  const methods = useForm<GymZoneFormFields>({
    defaultValues: { ...defaultValues, virtualGym: '' },
    shouldUnregister: true
  });

  const handleOnSubmit = (data: GymZoneFormFields) => {
    onSubmit?.(data);
  };

  if (error) {
    onError('An error occurred.');
  }

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

                <GymZoneVirtualGym virtualGyms={data} />
              </Stack>
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

export default GymZoneDialog;
