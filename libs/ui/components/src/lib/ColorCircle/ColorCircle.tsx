import { AppPalette } from '@hubbl/shared/types';
import { notForwardAny } from '@hubbl/utils';
import { Box, BoxProps, styled } from '@mui/material';

type ColorProps = {
  /**
   * The color to render as the background of the circle
   */
  color: string | AppPalette;
};

export default styled(Box, {
  shouldForwardProp: notForwardAny(['color', 'selected'])
})<BoxProps & ColorProps>(({ theme, color }) => ({
  minWidth: theme.spacing(3),
  maxWidth: theme.spacing(3),
  minHeight: theme.spacing(3),
  maxHeight: theme.spacing(3),
  backgroundColor: color,
  borderRadius: '100%',
  cursor: 'pointer'
}));
