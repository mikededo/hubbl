import { styled } from '@mui/material';

const CalendarWeek = styled('ul')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'flex-start',
  overflowX: 'auto',
  maxHeight: theme.spacing(5 + 8 * 10),
  overflowY: 'auto'
}));

export default CalendarWeek;
