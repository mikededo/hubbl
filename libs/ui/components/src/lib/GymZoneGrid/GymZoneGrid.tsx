import Link from 'next/link';

import { GymZoneDTO } from '@hubbl/shared/models/dto';
import { GymZone } from '@hubbl/shared/models/entities';
import { EmptyHandler, SingleHandler } from '@hubbl/shared/types';
import { CardActionArea, styled, Typography } from '@mui/material';

import AddItemPlaceholder from '../AddItemPlaceholder';
import Anchor from '../Anchor';
import CarouselGrid from '../CarouselGrid';
import GymZoneListItem from '../GymZoneListItem';

const ContentCardAction = styled(CardActionArea)(({ theme }) => ({
  borderRadius: theme.spacing(2)
}));

type GymZoneGridItemProps = {
  /**
   * Gym zone to render
   */
  gymZone: GymZoneDTO | GymZone;

  /**
   * Callback run when a gym zone is clicked.
   *
   * @default undefined
   */
  onClick?: SingleHandler<number>;
};

const GymZoneGridItem = ({
  gymZone,
  onClick
}: GymZoneGridItemProps): JSX.Element => {
  const handleOnClick = () => {
    onClick?.(gymZone.id);
  };

  return (
    <ContentCardAction title={`gym-zone-${gymZone.id}`} onClick={handleOnClick}>
      <GymZoneListItem gymZone={gymZone} />
    </ContentCardAction>
  );
};

export type GymZoneGridProps = {
  /**
   * Title passed to the add button of the grid
   */
  addButtonTitle?: string;

  /**
   * Gym zones to render in the grid.
   */
  gymZones: Array<GymZoneDTO | GymZone>;

  /**
   * Header of the section.
   */
  header: string;

  /**
   * Base hyperref string to use as prefix of the gym zone
   * id. If given, item is rendered as a link.
   *
   * @default undefined
   */
  href?: string;

  /**
   * Callback run when the add button is clicked.
   *
   * @default undefined
   */
  onAddGymZone?: EmptyHandler;

  /**
   * Callback run when a gym zone is clicked.
   *
   * @default undefined
   */
  onGymZoneClick?: SingleHandler<number>;
};

const GymZoneGrid = ({
  addButtonTitle,
  gymZones,
  header,
  href,
  onAddGymZone,
  onGymZoneClick
}: GymZoneGridProps): JSX.Element => (
  <CarouselGrid header={header} width={46.5}>
    {gymZones.map((gymZone) =>
      href ? (
        <Link key={gymZone.id} href={`${href}/${gymZone.id}`} passHref>
          <Anchor>
            <GymZoneGridItem gymZone={gymZone} />
          </Anchor>
        </Link>
      ) : (
        <GymZoneGridItem
          key={gymZone.id}
          gymZone={gymZone}
          onClick={onGymZoneClick}
        />
      )
    )}

    {onAddGymZone && (
      <AddItemPlaceholder
        title={addButtonTitle}
        height={25}
        width={44}
        onClick={onAddGymZone}
      >
        <Typography variant="placeholder">
          Click me to create a gym zone!
        </Typography>
      </AddItemPlaceholder>
    )}
  </CarouselGrid>
);

export default GymZoneGrid;
