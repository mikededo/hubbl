import { useFormContext } from 'react-hook-form';

import Input from '../../../../Input';

import { SettingsUserInfoFields } from '../types';

type PhoneProps = {
  /**
   * Whether the input is disabled or not
   *
   * @default false
   */
  disabled?: boolean;
};

const Phone = ({disabled = false}: PhoneProps) => {
  const { register } = useFormContext<SettingsUserInfoFields>();

  return (
    <Input
      label="Phone"
      labelVariant="body1"
      title="phone"
      type="tel"
      placeholder="000 000 000"
      disabled={disabled}
      registerResult={register('phone')}
      fullWidth
    />
  );
};

export default Phone;
