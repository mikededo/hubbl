import { styled, Typography } from '@mui/material';
import Link from 'next/link';

export const FormWrapper = styled('section')(({ theme }) => ({
  margin: 'auto',
  width: '500px',
  [theme.breakpoints.down('sm')]: { width: '300px' }
}));

export const FormFooter = styled(Typography)({ textAlign: 'center' });

export const FooterLink = styled(Link)(({ theme }) => ({
  color: theme.palette.text.primary,
  textDecoration: 'none'
}));
