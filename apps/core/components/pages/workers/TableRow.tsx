import { WorkerDTO } from '@hubbl/shared/models/dto';
import { Gender, SingleHandler } from '@hubbl/shared/types';
import { GenderCell, TableBodyRow } from '@hubbl/ui/components';
import { Man, Woman } from '@mui/icons-material';
import { TableCell } from '@mui/material';

type TableRowProps = {
  /**
   * Worker to display
   */
  worker?: WorkerDTO<number>;

  /**
   * Callback to run when the row has been clicledk
   *
   * @default undefined
   */
  onClick?: SingleHandler<WorkerDTO<number>>;
};

const TableRow = ({ worker, onClick }: TableRowProps) => {
  const genderIcon = () =>
    worker?.gender === Gender.WOMAN ? <Woman /> : <Man />;

  const handleOnClick = () => {
    onClick?.(worker);
  };

  return (
    <TableBodyRow onClick={handleOnClick}>
      <TableCell>{worker?.firstName}</TableCell>
      <TableCell>{worker?.lastName}</TableCell>
      <TableCell>{worker?.email}</TableCell>
      <TableCell>{worker?.phone}</TableCell>
      <GenderCell>{worker ? genderIcon() : undefined}</GenderCell>
    </TableBodyRow>
  );
};

export default TableRow;
