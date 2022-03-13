import { UseFormRegisterReturn } from 'react-hook-form';
import InputMask from 'react-input-mask';

import { AccessTime } from '@mui/icons-material';
import { InputAdornment } from '@mui/material';

import Input, { InputProps } from '../Input';

export type TimeInputProps = {
  registerResult: UseFormRegisterReturn;
} & InputProps;

const TimeInput = ({
  registerResult,
  ...props
}: TimeInputProps): JSX.Element => (
  <InputMask mask="99:99" maskChar={null} {...registerResult}>
    {() => (
      <Input
        {...props}
        startAdornment={
          <InputAdornment position="start">
            <AccessTime />
          </InputAdornment>
        }
      />
    )}
  </InputMask>
);

export default TimeInput;
