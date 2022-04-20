import { styled, TableRow } from '@mui/material';

const TableBodyRow = styled(TableRow)(({ theme }) => ({
  minHeight: theme.spacing(5.5),
  height: theme.spacing(5.5),
  ':last-of-type td': { border: 0 }
}));

export default TableBodyRow;
