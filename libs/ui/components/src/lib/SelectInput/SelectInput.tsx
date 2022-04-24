import { Control, Controller, FieldValues, Path } from 'react-hook-form';

import {
  InputBaseProps,
  MenuItem,
  Select,
  Stack,
  Typography,
  TypographyVariants
} from '@mui/material';

import InputBase from '../InputBase';

export type SelectItem = {
  /**
   * Key attached to the item rendered
   */
  key: string | number;

  /**
   * Value attached to the item rendered, which will be
   * returned once the form is submitted
   */
  value: string | number;

  /**
   * Value to display as the value of the select
   */
  label: string;
};

type SelectInputProps<T extends FieldValues, J extends SelectItem[]> = {
  /**
   * Result value of registering the input into the
   * `useForm`'s hook
   */
  control: Control<T, unknown>;

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
   * Entry of the form field that will be passed to the controller
   * as its name.
   */
  formName: Path<T>;

  /**
   * Whether the select input is multiple or not
   * 
   * @default false
   */
  multiple?: boolean;

  /**
   * Options to display in the select input
   */
  options: J;
};

const SelectInput = <T extends FieldValues, J extends SelectItem[]>({
  control,
  label,
  labelVariant = 'h6',
  formName,
  multiple = false,
  options,
  required,
  ...props
}: InputBaseProps & SelectInputProps<T, J>): JSX.Element => (
  <Stack direction="column" gap={1} width="100%">
    <Typography variant={labelVariant} component="label">
      {label}
    </Typography>

    <Controller
      control={control}
      name={formName}
      rules={{ required }}
      render={({
        field: { onChange, value, name, ref },
        fieldState: { error }
      }) => (
        <Select
          name={name}
          value={options.length ? value : ''}
          input={<InputBase />}
          error={!!error}
          inputRef={ref}
          multiple={multiple}
          {...props}
          onChange={onChange}
        >
          {options.map(({ key, value, label }) => (
            <MenuItem key={`${key}`} value={value}>
              {label}
            </MenuItem>
          ))}
        </Select>
      )}
    />
  </Stack>
);

export default SelectInput;
