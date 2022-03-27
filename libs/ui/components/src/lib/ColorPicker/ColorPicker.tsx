import { Control, Controller, FieldValues, Path } from 'react-hook-form';

import { AppPalette } from '@hubbl/shared/types';
import { notForwardOne } from '@hubbl/utils';
import { alpha, Stack, styled } from '@mui/material';

import ColorCircle, { ColorCircleProps } from '../ColorCircle';

type ColorProps = {
  /**
   * Whether the color is selected or not
   */
  selected?: boolean;
};

const Color = styled(ColorCircle, {
  shouldForwardProp: notForwardOne('selected')
})<ColorCircleProps & ColorProps>(({ theme, color, selected }) => ({
  minWidth: theme.spacing(3),
  maxWidth: theme.spacing(3),
  minHeight: theme.spacing(3),
  maxHeight: theme.spacing(3),
  borderRadius: '100%',
  boxShadow: selected
    ? `0 0 0 2px #fff, 0 0 0 4px ${color}`
    : `0 0 ${alpha('#fff', 0)}`,
  cursor: 'pointer',
  transition: theme.transitions.create('box-shadow', {
    duration: 150
  })
}));

type ColorStack = {
  /**
   * Whether the stack extends to its maximum
   *
   * @default false
   */
  fullWidth?: boolean;
};

const ColorStack = styled(Stack, {
  shouldForwardProp: notForwardOne('fullWidth')
})<ColorStack>(({ theme, fullWidth }) => ({
  width: fullWidth ? '100%' : `calc(75% + ${theme.spacing(2)})`,
  [theme.breakpoints.between('xs', 'lg')]: {
    width: `calc(100% + ${theme.spacing(1)})`
  }
}));

type ColorPickerProps<T extends FieldValues> = {
  /**
   * Control prop of the form hook to attach the controller to
   */
  control: Control<T>;

  /**
   * Whether the stack extends to its maximum
   *
   * @default false
   */
  fullWidth?: boolean;

  /**
   * Name of the controller of the color picker
   */
  name: Path<T>;
};

const ColorPicker = <T extends FieldValues>({
  control,
  fullWidth = false,
  name
}: ColorPickerProps<T>) => (
  <Controller
    name={name}
    control={control}
    render={({ field: { onChange, value } }) => (
      <ColorStack
        direction="row"
        gap={{ xs: 1, sm: 1, md: 2 }}
        alignItems="center"
        justifyContent="space-between"
        flexWrap="wrap"
        fullWidth={fullWidth}
      >
        {Object.entries(AppPalette).map(([key, color]) => (
          <Color
            key={key}
            aria-label="color selector"
            aria-selected={value === color}
            color={color}
            selected={value === color}
            role="option"
            title={color}
            onClick={() => onChange(color)}
          />
        ))}
      </ColorStack>
    )}
  />
);

export default ColorPicker;
