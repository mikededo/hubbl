import { styled } from '@mui/material/styles';

const AuthLayout = styled('main')(({ theme }) => ({
  height: '100vh',
  width: '100vw',
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: 0,
  [theme.breakpoints.down('lg')]: { gridTemplateColumns: '2fr 1fr' },
  [theme.breakpoints.down('md')]: { gridTemplateColumns: '1fr' }
}));

export default AuthLayout;
