import { HeaderCell } from '@hubbl/ui/components';
import { TableRow } from '@mui/material';

const TableHeader = () => (
  <TableRow hover={false} sx={{ cursor: 'default' }}>
    <HeaderCell width="21.5%">First name</HeaderCell>
    <HeaderCell width="21.5%">Last name</HeaderCell>
    <HeaderCell width="21.5%">Email</HeaderCell>
    <HeaderCell width="21.5%">Phone</HeaderCell>
    <HeaderCell width="12%">Covid passport</HeaderCell>
    <HeaderCell width="2%">Gender</HeaderCell>
  </TableRow>
);

export default TableHeader;
