import { notForwardOne } from '@hubbl/utils';
import { styled } from '@mui/system';
import React from 'react';

type DialogSectionProps = {
  footer?: boolean;
};

export default styled('section', {
  shouldForwardProp: notForwardOne('footer')
})<React.HTMLAttributes<HTMLElement> & DialogSectionProps>(
  ({ theme, footer }) => ({
    padding: theme.spacing(footer ? 3 : 2, 3)
  })
);
