import { styled, TableCell } from '@mui/material';

const HeaderCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 600,
  fontSize: 10,
  color: theme.palette.text.secondary,
  padding: theme.spacing(1, 2),
  letterSpacing: theme.spacing(0.1),
  textTransform: 'uppercase'
}));


export default HeaderCell;