import { useState } from 'react';

import Link from 'next/link';

import { GymZoneDTO } from '@hubbl/shared/models/dto';
import { GymZone } from '@hubbl/shared/models/entities';
import { EmptyHandler, SingleHandler } from '@hubbl/shared/types';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import {
  CardActionArea,
  IconButton,
  Stack,
  styled,
  Typography
} from '@mui/material';

import AddItemPlaceholder from '../AddItemPlaceholder';
import Anchor from '../Anchor';
import CarouselItem from '../CarouselItem';
import GymZoneListItem from '../GymZoneListItem';

const CarouselGrid = styled(Stack)(({ theme }) => ({
  position: 'relative',
  overflow: 'hidden',
  height: theme.spacing(60),
  margin: theme.spacing(-3, -3, -3, -1.5),
  padding: theme.spacing(3, 3, 3, 1.5),
  gap: theme.spacing(2.5),
  transition: theme.transitions.create(['margin', 'padding']),
  [theme.breakpoints.down('md')]: {
    margin: theme.spacing(-3, -2, -3, -1.5),
    padding: theme.spacing(3, 2, 3, 1.5)
  },
  [theme.breakpoints.down('sm')]: {
    maxWidth: theme.spacing(47),
    margin: 'auto'
  }
}));

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
  gymZones,
  header,
  href,
  onAddGymZone,
  onGymZoneClick
}: GymZoneGridProps): JSX.Element => {
  const [iteration, setIteration] = useState(0);

  const decrementIteration: EmptyHandler = () => {
    setIteration((prev) => prev - 1);
  };

  const incrementIteration: EmptyHandler = () => {
    setIteration((prev) => prev + 1);
  };

  return (
    <Stack gap={2}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h5">{header}</Typography>

        <Stack direction="row" component="ul">
          <IconButton
            aria-label="carousel-prev"
            disabled={iteration === 0}
            onClick={decrementIteration}
          >
            <ChevronLeft fontSize="large" />
          </IconButton>

          <IconButton
            aria-label="carousel-next"
            disabled={iteration >= gymZones.length / 2 - 1}
            onClick={incrementIteration}
          >
            <ChevronRight fontSize="large" />
          </IconButton>
        </Stack>
      </Stack>

      <CarouselGrid
        direction="column"
        flexWrap="wrap"
        alignItems="flex-start"
        alignContent="flex-start"
        gap={0}
      >
        {gymZones.map((gymZone) => (
          <CarouselItem key={gymZone.id} iteration={iteration} width={46.5}>
            {href ? (
              <Link href={`${href}/${gymZone.id}`} passHref>
                <Anchor>
                  <GymZoneGridItem gymZone={gymZone} />
                </Anchor>
              </Link>
            ) : (
              <GymZoneGridItem gymZone={gymZone} onClick={onGymZoneClick} />
            )}
          </CarouselItem>
        ))}

        <CarouselItem iteration={iteration} width={46.5}>
          <AddItemPlaceholder
            title="add-gym-zone"
            height={25}
            width={44}
            onClick={onAddGymZone}
          >
            <Typography variant="placeholder">
              Click me to create a gym zone!
            </Typography>
          </AddItemPlaceholder>
        </CarouselItem>
      </CarouselGrid>
    </Stack>
  );
};

export default GymZoneGrid;
