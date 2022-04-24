import { useState } from 'react';

import { useFormContext } from 'react-hook-form';

import { VisibilityOffOutlined, VisibilityOutlined } from '@mui/icons-material';

import ClickableEndAdornment from '../../../ClickableEndAdornment';
import Input from '../../../Input';
import { PersonFormFields } from '../../types';

const PersonPassword = (): JSX.Element => {
  const {
    register,
    formState: { errors }
  } = useFormContext<PersonFormFields>();

  const [visible, setVisible] = useState(false);
 
  const handleOnToggleVisibility =
    (updater: React.Dispatch<React.SetStateAction<boolean>>) => () => {
      updater((prev) => !prev);
    };

  return (
    <Input
      label="Password"
      title="person-password"
      placeholder="At least 8 characters!"
      type="password"
      registerResult={register('password', { required: true, minLength: 8 })}
      error={!!errors.password}
      endAdornment={
        <ClickableEndAdornment
          label="password visibility"
          visible={visible}
          visibleIcon={<VisibilityOutlined />}
          notVisibleIcon={<VisibilityOffOutlined />}
          onClick={handleOnToggleVisibility(setVisible)}
        />
      }
      fullWidth
    />
  );
};

export default PersonPassword;
