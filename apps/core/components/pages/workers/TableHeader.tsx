import { HeaderCell } from '@hubbl/ui/components';
import { TableRow } from '@mui/material';

const TableHeader = () => (
  <TableRow hover={false} sx={{ cursor: 'default' }}>
    <HeaderCell width="24.25%">First name</HeaderCell>
    <HeaderCell width="24.25%">Last name</HeaderCell>
    <HeaderCell width="24.25%">Email</HeaderCell>
    <HeaderCell width="24.25%">Phone</HeaderCell>
    <HeaderCell width="1%">Gender</HeaderCell>
  </TableRow>
);

export default TableHeader;
