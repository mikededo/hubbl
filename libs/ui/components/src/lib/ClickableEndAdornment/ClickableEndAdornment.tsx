import React from 'react';

import { EmptyHandler } from '@hubbl/shared/types';
import { IconButton, InputAdornment } from '@mui/material';

export type ClickableEndAdornmentProps = {
  /**
   * Aria-label to attach to the icon button
   */
  label: string;

  /**
   * Whether the input is visible or not, which will toggle the icon
   * being displayed
   */
  visible: boolean;

  /**
   * Icon to display when visible
   */
  visibleIcon: React.ReactNode;

  /**
   * Icon to display when not visible
   */
  notVisibleIcon: React.ReactNode;

  /**
   * Handler called when the icon button is clicked
   */
  onClick: EmptyHandler;
};

const ClickableEndAdornment = ({
  label,
  visible,
  visibleIcon,
  notVisibleIcon,
  onClick
}: ClickableEndAdornmentProps): JSX.Element => (
  <InputAdornment position="end">
    <IconButton aria-label={label} onClick={onClick}>
      {visible ? visibleIcon : notVisibleIcon}
    </IconButton>
  </InputAdornment>
);

export default ClickableEndAdornment;
