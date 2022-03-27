import { Control, Controller, FieldValues, Path } from 'react-hook-form';

import { AppPalette } from '@hubbl/shared/types';
import { notForwardOne } from '@hubbl/utils';
import { alpha, Grid, styled } from '@mui/material';

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

const ResponsiveGrid = styled(Grid)(({ theme }) => ({
  '&.MuiGrid-root': {
    width: `calc(75% + ${theme.spacing(2)})`
  },
  [theme.breakpoints.between('xs', 'lg')]: {
    '&.MuiGrid-root': { width: `calc(100% + ${theme.spacing(1)})` }
  }
}));

type ColorPickerProps<T extends FieldValues> = {
  /**
   * Control prop of the form hook to attach the controller to
   */
  control: Control<T>;

  /**
   * Name of the controller of the color picker
   */
  name: Path<T>;
};

const ColorPicker = <T extends FieldValues>({
  control,
  name
}: ColorPickerProps<T>) => (
  <Controller
    name={name}
    control={control}
    render={({ field: { onChange, value } }) => (
      <ResponsiveGrid
        spacing={{ xs: 1, sm: 1, md: 2 }}
        justifyContent="space-between"
        container
      >
        {Object.entries(AppPalette).map(([key, color]) => (
          <Grid key={key} lg={1} md={2} item>
            <Color
              aria-label="color selector"
              aria-selected={value === color}
              color={color}
              selected={value === color}
              role="option"
              title={color}
              onClick={() => onChange(color)}
            />
          </Grid>
        ))}
      </ResponsiveGrid>
    )}
  />
);

export default ColorPicker;
