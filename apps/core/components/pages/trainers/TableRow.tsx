import { TrainerDTO } from '@hubbl/shared/models/dto';
import { AppPalette, Gender, SingleHandler } from '@hubbl/shared/types';
import { GenderCell, TableBodyRow } from '@hubbl/ui/components';
import { notForwardOne } from '@hubbl/utils';
import { Man, Woman } from '@mui/icons-material';
import { Chip, Stack, styled, TableCell } from '@mui/material';

type TagChipProps = {
  /**
   * Color of the chip
   */
  chipColor?: AppPalette;
};

const TagChip = styled(Chip, {
  shouldForwardProp: notForwardOne('chipColor')
})<TagChipProps>(({ theme, chipColor }) => ({
  backgroundColor: chipColor,
  color: theme.palette.getContrastText(chipColor)
}));

type TableRowProps = {
  /**
   * Trainer to display
   */
  trainer?: TrainerDTO<number>;

  /**
   * Callback to run when the row has been clicledk
   *
   * @default undefined
   */
  onClick?: SingleHandler<TrainerDTO<number>>;
};

const TableRow = ({ trainer, onClick }: TableRowProps) => {
  const genderIcon = () =>
    trainer?.gender === Gender.WOMAN ? <Woman /> : <Man />;

  const handleOnClick = () => {
    onClick?.(trainer);
  };

  return (
    <TableBodyRow onClick={handleOnClick}>
      <TableCell>{trainer?.firstName}</TableCell>
      <TableCell>{trainer?.lastName}</TableCell>
      <TableCell>{trainer?.email}</TableCell>
      <GenderCell>{trainer ? genderIcon() : undefined}</GenderCell>
      <TableCell>
        <Stack direction="row" gap={0.5} flexWrap="wrap">
          {trainer?.tags.map(({ id, color, name }) => (
            <TagChip key={id} label={name} chipColor={color} size="small" />
          ))}
        </Stack>
      </TableCell>
    </TableBodyRow>
  );
};

export default TableRow;
