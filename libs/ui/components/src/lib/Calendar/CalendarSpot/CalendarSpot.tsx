import { CardActionArea, styled } from '@mui/material';

const Li = styled('li')(({ theme }) => ({
  borderBottom: `1px dashed ${theme.palette.divider}`,
  ':last-of-type': { borderBottom: 'none' },
  width: '100%',
  height: theme.spacing(8)
}));

const CalendarSpotArea = styled(CardActionArea)({
  width: '100%',
  height: '100%'
});

const CalendarSpot = () => (
  <Li>
    <CalendarSpotArea />
  </Li>
);
export default CalendarSpot;
