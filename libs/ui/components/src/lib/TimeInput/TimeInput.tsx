import { UseFormRegisterReturn } from 'react-hook-form';

import { AccessTime } from '@mui/icons-material';
import {
  InputAdornment,
  InputBaseProps,
  Stack,
  Typography,
  TypographyVariants
} from '@mui/material';

import InputBase from '../InputBase';
import { timeNormalizer } from '@hubbl/utils';
import React from 'react';

export type TimeInputProps = {
  /**
   * Text to display as the label of the input
   */
  label: string;

  /**
   * Variant of the label component
   * @default 'h6'
   */
  labelVariant?: keyof Pick<TypographyVariants, 'h6' | 'body1'>;

  /**
   * Result value of registering the input into the
   * `useForm`'s hook
   */
  registerResult?: UseFormRegisterReturn;
} & InputBaseProps;

const TimeInput = ({
  label,
  labelVariant = 'h6',
  registerResult,
  ...props
}: TimeInputProps): JSX.Element => {
  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.target.value = timeNormalizer(e.target.value);
  };

  return (
    <Stack direction="column" gap={1} width="100%">
      <Typography variant={labelVariant} component="label">
        {label}
      </Typography>

      <InputBase
        {...props}
        {...registerResult}
        onChange={handleOnChange}
        startAdornment={
          <InputAdornment position="start">
            <AccessTime />
          </InputAdornment>
        }
      />
    </Stack>
  );
};

export default TimeInput;
