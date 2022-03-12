import React from 'react';

import { notForwardAny } from '@hubbl/utils';
import { BoxProps, CardActionArea, styled } from '@mui/material';

export type AddItemPlaceholderProps = {
  /**
   * Optional height of the placeholder item
   *
   * @default '100%'
   */
  height?: number | string;

  /**
   * Content to place inside the placeholder
   */
  children: React.ReactNode;

  /**
   * Optional height of the placeholder item
   *
   * @default '100%'
   */
  width?: number | string;
};

type WrapperProps = {
  /**
   * Optional height of the placeholder wrapper
   */
  height?: number | string;

  /**
   * Optional width of the placeholder wrapper
   */
  width?: number | string;
};

const Wrapper = styled(CardActionArea, {
  shouldForwardProp: notForwardAny(['height', 'width'])
})<BoxProps & WrapperProps>(({ theme, width = '100%', height = '100%' }) => ({
  outline: '2px dashed lightgrey',
  borderRadius: theme.spacing(2),
  height: typeof height !== 'string' ? theme.spacing(height) : height,
  width: typeof width !== 'string' ? theme.spacing(width) : width,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}));

const AddItemPlaceholder = ({
  height,
  children,
  width
}: AddItemPlaceholderProps): JSX.Element => (
  <Wrapper height={height} width={width}>
    {children}
  </Wrapper>
);

export default AddItemPlaceholder;
