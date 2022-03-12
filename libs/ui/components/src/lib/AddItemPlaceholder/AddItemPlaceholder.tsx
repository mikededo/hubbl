import React from 'react';

import { notForwardAny } from '@hubbl/utils';
import { BoxProps, CardActionArea, styled } from '@mui/material';
import { EmptyHandler } from '@hubbl/shared/types';

export type AddItemPlaceholderProps = {
  /**
   * Content to place inside the placeholder
   */
  children: React.ReactNode;

  /**
   * Optional height of the placeholder item
   *
   * @default '100%'
   */
  height?: number | string;

  /**
   * Required title to distinguish the placeholder
   */
  title: string;

  /**
   * Optional height of the placeholder item
   *
   * @default '100%'
   */
  width?: number | string;

  /**
   * Callback passed to the actions card to run when clicked
   *
   * @default undefined
   */
  onClick?: EmptyHandler;
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
  children,
  height,
  title,
  width,
  onClick
}: AddItemPlaceholderProps): JSX.Element => (
  <Wrapper title={title} height={height} width={width} onClick={onClick}>
    {children}
  </Wrapper>
);

export default AddItemPlaceholder;
