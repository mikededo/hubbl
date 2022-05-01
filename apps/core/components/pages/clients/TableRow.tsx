import { ClientDTO } from '@hubbl/shared/models/dto';
import { Gender, SingleHandler } from '@hubbl/shared/types';
import { GenderCell, TableBodyRow } from '@hubbl/ui/components';
import { CallToAction, Man, Woman } from '@mui/icons-material';
import { TableCell } from '@mui/material';

type TableRowProps = {
  /**
   * Client to display
   */
  client?: ClientDTO<number>;

  /**
   * Callback to run when the row has been clicledk
   *
   * @default undefined
   */
  onClick?: SingleHandler<ClientDTO<number>>;
};

const TableRow = ({ client, onClick }: TableRowProps) => {
  const genderIcon = () =>
    client?.gender === Gender.WOMAN ? <Woman /> : <Man />;

  const handleOnClick = () => {
    onClick?.(client);
  };

  return (
    <TableBodyRow onClick={handleOnClick}>
      <TableCell>{client?.firstName}</TableCell>
      <TableCell>{client?.lastName}</TableCell>
      <TableCell>{client?.email}</TableCell>
      <TableCell>{client?.phone}</TableCell>
      <GenderCell>
        <CallToAction color={client?.covidPassport ? 'success' : undefined} />
      </GenderCell>
      <GenderCell>{client ? genderIcon() : undefined}</GenderCell>
    </TableBodyRow>
  );
};

export default TableRow;
