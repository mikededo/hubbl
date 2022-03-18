import React from 'react';
import { keyframes } from '@emotion/react';

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

const ContainerAnimation = keyframes`
  0 { transform: rotate(0deg); }
  100% { transform: rotate(-5deg); }
`;

const DialogContainer = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    overflow: 'visible',
    borderRadius: theme.spacing(2),
    boxShadow: theme.shadows[22],
    animation: `${ContainerAnimation} 0.5s cubic-bezier(0.25, 1, 0.5, 1)`,
    animationFillMode: 'forwards'
  }
}));

const ContentAnimation = keyframes`
  0 { transform: rotate(-0deg); }
  100% { transform: rotate(5deg); }
`;

const DialogCardContent = styled(ContentCard)(({ theme }) => ({
  boxShadow: theme.shadows[22],
  animation: `${ContentAnimation} 0.5s cubic-bezier(0.25, 1, 0.5, 1)`,
  animationFillMode: 'forwards',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden'
}));

const DialogScrollable = styled('section')(({ theme }) => ({
  maxHeight: `calc(100% - ${theme.spacing(17)})`,
  overflowY: 'scroll'
}));

const Base = ({
  children,
  open = false,
  title,
  onClose
}: BaseProps): JSX.Element => (
  <DialogContainer open={open} onClose={onClose} maxWidth="sm" fullWidth>
    <DialogCardContent>
      <DialogHeader title={title} onClose={onClose} />

      <Divider />

      {/* TODO: Make children scrollable, not parent */}
      <DialogScrollable>{children}</DialogScrollable>
    </DialogCardContent>
  </DialogContainer>
);

export default Base;
