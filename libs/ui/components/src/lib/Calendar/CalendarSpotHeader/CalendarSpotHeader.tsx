import { darken, styled } from '@mui/material';

const CalendarSpotHeader = styled('li')(({ theme }) => ({
  position: 'sticky',
  top: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  height: theme.spacing(6),
  borderBottom: `1px solid ${darken(theme.palette.divider, 1)}`,
  backgroundColor: 'white',
  zIndex: theme.zIndex.appBar
}));

export default CalendarSpotHeader;
