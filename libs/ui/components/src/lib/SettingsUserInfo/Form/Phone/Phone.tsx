import { useFormContext } from 'react-hook-form';

import Input from '../../../Input';

import { SettingsUserInfoFields } from '../types';

const Phone = () => {
  const { register } = useFormContext<SettingsUserInfoFields>();

  return (
    <Input
      label="Phone"
      labelVariant="body1"
      title="phone"
      type="tel"
      placeholder="000 000 000"
      registerResult={register('phone')}
      fullWidth
    />
  );
};

export default Phone;
