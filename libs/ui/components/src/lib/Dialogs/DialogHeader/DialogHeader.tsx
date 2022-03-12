import { EmptyHandler } from '@hubbl/shared/types';
import { Close } from '@mui/icons-material';
import { IconButton, Stack, styled, Typography } from '@mui/material';
import React from 'react';

const Wrapper = styled(Stack)(({ theme }) => ({
  padding: theme.spacing(2, 3),
  width: '100%'
}));

type DialogHeaderProps = {
  /**
   * The title of the header
   */
  title: string;

  /**
   * Callback run when the right close icon has been pressed. If
   * no handler is passed, no button is shown
   *
   * @default undefined
   */
  onClose?: EmptyHandler;
};

const DialogHeader = ({ title, onClose }: DialogHeaderProps): JSX.Element => (
  <Wrapper direction="row" justifyContent="space-between" alignItems="center">
    <Typography variant="h5">{title}</Typography>

    {onClose && (
      <IconButton title="close-dialog" onClick={onClose}>
        <Close />
      </IconButton>
    )}
  </Wrapper>
);

export default DialogHeader;
