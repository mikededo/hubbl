import { useEffect, useState } from 'react';

import { useFormContext } from 'react-hook-form';

import { VirtualGymDTO } from '@hubbl/shared/models/dto';

import SelectInput, { SelectItem } from '../../../SelectInput';
import { GymZoneFormFields } from '../../types';

export type GymZoneVirtualGymProps = {
  virtualGyms?: VirtualGymDTO[];
};

const GymZoneVirtualGym = ({
  virtualGyms
}: GymZoneVirtualGymProps): JSX.Element => {
  const { control, getValues, setValue } = useFormContext<GymZoneFormFields>();

  // A state is required since, whent he dialog unmounts,
  // the virtualGyms prop becomes undefined and therefore,
  // no more options exist. A select without options throws a
  // mui console warning
  const [options, setOptions] = useState<VirtualGymDTO[]>([]);

  const mapVirtualGyms = (): SelectItem[] =>
    (virtualGyms?.length ? virtualGyms : options).map((vg) => ({
      key: vg.id,
      value: vg.id,
      label: vg.name
    }));

  useEffect(() => {
    if (virtualGyms?.length) {
      setOptions(virtualGyms);
      setValue(
        'virtualGym',
        getValues('virtualGym') ? getValues('virtualGym') : virtualGyms[0].id
      );
    }
  }, [virtualGyms, getValues, setValue]);

  return (
    <SelectInput
      control={control}
      formName="virtualGym"
      label="Virtual gym"
      // Placehoder is not displayed, but used in tests
      placeholder="Select a virtual gym"
      inputProps={{ title: 'gym-zone-virtual-gym' }}
      options={mapVirtualGyms()}
      disabled={!virtualGyms}
      required
    />
  );
};

export default GymZoneVirtualGym;
