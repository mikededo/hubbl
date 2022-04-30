import { styled } from '@mui/material';

export const UpWave = styled('div')({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  zIndex: -1
});

export const DownWave = styled('div')({
  position: 'fixed',
  bottom: -10,
  left: 0,
  right: 0,
  zIndex: -1
});
