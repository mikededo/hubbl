import { styled } from '@mui/material';

const CalendarSpot = styled('li')(({ theme }) => ({
  borderBottom: `1px dashed ${theme.palette.divider}`,
  width: '100%',
  height: theme.spacing(8),
  ':last-of-type': { borderBottom: 'none' }
}));

export default CalendarSpot;
