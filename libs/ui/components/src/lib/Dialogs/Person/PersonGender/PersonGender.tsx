import { useFormContext } from 'react-hook-form';

import { Gender as GenderEnum } from '@hubbl/shared/types';

import SelectInput from '../../../SelectInput';
import { PersonFormFields } from '../../types';

const GenderOptions = [
  { key: 'man', value: GenderEnum.MAN, label: 'Man' },
  { key: 'woman', value: GenderEnum.WOMAN, label: 'Woman' },
  {
    key: 'other',
    value: GenderEnum.OTHER,
    label: 'Other'
  }
];

type PersonGenderProps = {
  /**
   * Whether the input is disabled or not
   *
   * @default false
   */
  disabled?: boolean;
};

const Gender = ({ disabled = false }: PersonGenderProps) => {
  const { control } = useFormContext<PersonFormFields>();

  return (
    <SelectInput
      label="Gender"
      inputProps={{ title: 'user-gender' }}
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
