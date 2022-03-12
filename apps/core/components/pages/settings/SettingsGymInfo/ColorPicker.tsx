import { Control, Controller } from 'react-hook-form';

import { AppPalette } from '@hubbl/shared/types';
import { notForwardAny } from '@hubbl/utils';
import { alpha, Box, BoxProps, Grid, styled } from '@mui/material';

import { RequiredGymInfoFields } from './types';

type ColorProps = {
  /**
   * The color to render as the background of the circle
   */
  color: AppPalette;

  /**
   * Whether the color is selected or not
   */
  selected?: boolean;
};

const Color = styled(Box, {
  shouldForwardProp: notForwardAny(['color', 'selected'])
})<BoxProps & ColorProps>(({ theme, color, selected }) => ({
  minWidth: theme.spacing(3),
  maxWidth: theme.spacing(3),
  minHeight: theme.spacing(3),
  maxHeight: theme.spacing(3),
  backgroundColor: color,
  borderRadius: '100%',
  boxShadow: selected
    ? `0 0 0 2px #fff, 0 0 0 4px ${color}`
    : `0 0 ${alpha('#fff', 0)}`,
  cursor: 'pointer',
  transition: theme.transitions.create('box-shadow', {
    duration: 150
  })
}));

const ResponsiveGrid = styled(Grid)(({ theme, spacing }) => ({
  '&.MuiGrid-root': {
    width: `calc(75% + ${theme.spacing(2)})`
  },
  [theme.breakpoints.between('xs', 'lg')]: {
    '&.MuiGrid-root': { width: `calc(100% + ${theme.spacing(1)})` }
  }
}));

type ColorPickerProps = {
  /**
   * Control prop of the form hook to attach the controller to
   */
  control: Control<RequiredGymInfoFields>;
};

const ColorPicker = ({ control }: ColorPickerProps) => (
  <Controller
    name="color"
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
