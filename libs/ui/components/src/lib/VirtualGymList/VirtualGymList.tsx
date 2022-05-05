import { VirtualGymDTO } from '@hubbl/shared/models/dto';
import { Add } from '@mui/icons-material';
import { styled } from '@mui/material';
import { EmptyHandler, SingleHandler } from '@hubbl/shared/types';

import AddItemPlaceholder from '../AddItemPlaceholder';
import VirtualGymListItem from '../VirtualGymListItem';

export type VirtualGymListProps = {
  /**
   * List of virtual gyms to render
   */
  virtualGyms: VirtualGymDTO[];

  /**
   * Callback to run when the add button inside a gym zone
   * is clicked. It is called with the virtual gym id.
   *
   * @default undefined
   */
  onAddGymZone?: SingleHandler<number>;

  /**
   * Callback to run when the virtual gym add button is clicked
   */
  onAddVirtualGym?: EmptyHandler;
};

const AddIcon = styled(Add)(({ theme }) => ({
  color: theme.palette.text.secondary,
  margin: theme.spacing(1, 'auto')
}));

const VirtualGymList = ({
  virtualGyms,
  onAddGymZone,
  onAddVirtualGym
}: VirtualGymListProps): JSX.Element => (
  <>
    {virtualGyms.map((virtualGym) => (
      <VirtualGymListItem
        key={virtualGym.id}
        virtualGym={virtualGym}
        onAddGymZone={onAddGymZone}
      />
    ))}

    {onAddVirtualGym && (
      <AddItemPlaceholder title="add-virtual-gym" onClick={onAddVirtualGym}>
        <AddIcon />
      </AddItemPlaceholder>
    )}
  </>
);

export default VirtualGymList;
