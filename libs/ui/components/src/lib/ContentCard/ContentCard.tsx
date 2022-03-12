import { alpha, Card, styled } from '@mui/material';

export default styled(Card)(({ theme }) => ({
  backgroundColor: 'white',
  boxShadow: `0 ${theme.spacing(1)} ${theme.spacing(1.5)} ${alpha(
    '#777',
    0.15
  )}`,
  borderRadius: theme.spacing(2),
  width: '100%',
  overflow: 'unset'
}));
