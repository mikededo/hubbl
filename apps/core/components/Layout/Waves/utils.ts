import { styled } from '@mui/material';

export const UpWave = styled('div')({
  position: 'absolute',
  width: '100%',
  height: '300px',
  top: 0,
  left: 0,
  right: 0,
  zIndex: -1
});

export const DownWave = styled('div')({
  position: 'absolute',
  width: '100%',
  height: '300px',
  bottom: 0,
  left: 0,
  right: 0,
  zIndex: -1
});
