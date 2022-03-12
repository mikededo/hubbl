import { UseFormRegisterReturn } from 'react-hook-form';

import {
  InputBaseProps,
  Stack,
  Typography,
  TypographyVariants
} from '@mui/material';

import InputBase from '../InputBase';

type InputProps = {
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
  registerResult: UseFormRegisterReturn;
};

const Input = ({
  label,
  labelVariant = 'h6',
  registerResult,
  ...props
}: InputProps & InputBaseProps): JSX.Element => (
  <Stack direction="column" gap={1} width="100%">
    <Typography variant={labelVariant} component="label">
      {label}
    </Typography>

    <InputBase {...props} {...registerResult} />
  </Stack>
);

export default Input;
