import { lighten, styled } from '@mui/material';

const CalendarDayColumn = styled('ul')(({ theme }) => ({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  width: 'calc(100% / 7)',
  minWidth: theme.spacing(16),
  borderRight: `1px solid ${theme.palette.divider}`,
  listStyle: 'none',
  ':nth-of-type(2n)': {
    backgroundColor: lighten(theme.palette.primary.main, 0.95),
    '> li:first-of-type': {
      backgroundColor: lighten(theme.palette.primary.main, 0.95)
    }
  },
  ':last-of-type': { borderRight: 'none' }
}));

export default CalendarDayColumn;
