import { HeaderCell } from '@hubbl/ui/components';
import { styled, TableRow } from '@mui/material';

const SpecialitiesHeader = styled(HeaderCell)(({ theme }) => ({
  maxWidth: '20%',
  overflow: 'hidden'
}));

const TableHeader = () => (
  <TableRow hover={false} sx={{ cursor: 'default' }}>
    <HeaderCell width="20%">First name</HeaderCell>
    <HeaderCell width="20%">Last name</HeaderCell>
    <HeaderCell width="20%">Email</HeaderCell>
    <HeaderCell width="1%">Gender</HeaderCell>
    <HeaderCell width="14%">Code</HeaderCell>
    <SpecialitiesHeader width="25%">Specialities</SpecialitiesHeader>
  </TableRow>
);

export default TableHeader;
