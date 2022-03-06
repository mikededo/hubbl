import { useFormContext } from 'react-hook-form';
import { Gender as GenderEnum } from '@hubbl/shared/types';

import SelectInput from '../../../../SelectInput';
import { SettingsUserInfoFields } from '../types';

const GenderOptions = [
  { key: 'man', value: GenderEnum.MAN, label: 'Man' },
  { key: 'woman', value: GenderEnum.WOMAN, label: 'Woman' },
  {
    key: 'other',
    value: GenderEnum.OTHER,
    label: 'Other'
  }
];

type GenderProps = {
  /**
   * Whether the input is disabled or not
   *
   * @default false
   */
  disabled?: boolean;
};

const Gender = ({ disabled = false }: GenderProps) => {
  const { control } = useFormContext<SettingsUserInfoFields>();

  return (
    <SelectInput
      label="Gender name"
      labelVariant="body1"
      title="gender"
      type="text"
      placeholder="Other"
      disabled={disabled}
      control={control}
      formName="gender"
      options={GenderOptions}
      sx={{ width: '50%' }}
    />
  );
};

export default Gender;
