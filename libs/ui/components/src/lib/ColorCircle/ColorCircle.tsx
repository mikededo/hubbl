import { AppPalette } from '@hubbl/shared/types';
import { notForwardOne } from '@hubbl/utils';
import { Box, BoxProps, styled } from '@mui/material';

export type ColorCircleProps = {
  /**
   * The color to render as the background of the circle
   */
  color: string | AppPalette;
};

export default styled(Box, {
  shouldForwardProp: notForwardOne('color')
})<BoxProps & ColorCircleProps>(({ theme, color }) => ({
  minWidth: theme.spacing(2),
  maxWidth: theme.spacing(2),
  minHeight: theme.spacing(2),
  maxHeight: theme.spacing(2),
  backgroundColor: color,
  borderRadius: '100%',
  cursor: 'pointer'
}));
