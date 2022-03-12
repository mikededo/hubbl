import React from 'react';

import { EmptyHandler } from '@hubbl/shared/types';
import { Dialog, Divider, styled } from '@mui/material';

import ContentCard from '../../ContentCard';
import DialogHeader from '../DialogHeader';

export type BaseProps = {
  children?: React.ReactNode;

  /**
   * @default false
   */
  open?: boolean;

  /**
   * Header of the modal
   */
  title: string;

  /**
   * Callback called either when the modal is being cancelled
   * (clicking away of it) or by closing it, using the header
   * icon
   *
   * @default undefined
   */
  onClose?: EmptyHandler;
};

const DialogContainer = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    overflow: 'visible',
    height: theme.spacing(45),
    transform: 'rotate(-5deg)',
    borderRadius: theme.spacing(2),
    boxShadow: theme.shadows[22]
  }
}));

const DialogCardContent = styled(ContentCard)(({ theme }) => ({
  height: '100%',
  transform: 'rotate(5deg)',
  boxShadow: theme.shadows[22]
}));

const Base = ({
  children,
  open = true,
  title = 'Modal title',
  onClose
}: BaseProps): JSX.Element => (
  <DialogContainer open={open} onClose={onClose} maxWidth="sm" fullWidth>
    <DialogCardContent>
      <DialogHeader title={title} onClose={onClose} />

      <Divider />

      {children}
    </DialogCardContent>
  </DialogContainer>
);

export default Base;
