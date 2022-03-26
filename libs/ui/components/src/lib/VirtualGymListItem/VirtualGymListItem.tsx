import { useState } from 'react';

import Link from 'next/link';

import { VirtualGymDTO } from '@hubbl/shared/models/dto';
import { EmptyHandler, SingleHandler } from '@hubbl/shared/types';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import {
  alpha,
  CardActionArea,
  IconButton,
  Stack,
  styled,
  Typography
} from '@mui/material';

import AddItemPlaceholder from '../AddItemPlaceholder';
import Anchor from '../Anchor';
import CarouselItem from '../CarouselItem';
import ContentCard from '../ContentCard';
import GymZoneListItem from '../GymZoneListItem';

const Header = styled('div')(({ theme }) => ({
  marginLeft: theme.spacing(4),
  padding: theme.spacing(1, 6),
  borderTopLeftRadius: theme.spacing(2),
  borderTopRightRadius: theme.spacing(2),
  backgroundColor: 'white',
  width: 'fit-content',
  boxShadow: `0 ${theme.spacing(1)} ${theme.spacing(1.5)} ${alpha(
    '#777',
    0.15
  )}`
}));

const HeaderLink = styled(Typography)(({ theme }) => ({
  transition: theme.transitions.create('color', { duration: 200 }),
  ':hover': { color: theme.palette.primary.main }
}));

const PaddedContentCard = styled(ContentCard)(({ theme }) => ({
  padding: theme.spacing(3, 1.5),
  width: '100%'
}));

const ContentCardAction = styled(CardActionArea)(({ theme }) => ({
  borderRadius: theme.spacing(2)
}));

const CarouselStack = styled(Stack)(({ theme }) => ({
  margin: theme.spacing(-3, 0),
  padding: theme.spacing(3, 1.5),
  position: 'relative',
  overflow: 'hidden',
  width: '100%',
  '& > *': { flexShrink: 0 }
}));

const PlaceholderText = styled(Typography)({
  textAlign: 'center',
  width: '75%'
});

export type VirtualGymListItemProps = {
  /**
   * `VirtualGym` to render
   */
  virtualGym: VirtualGymDTO;

  /**
   * Callback to run when the add placeholder has been clicked
   *
   * @default undefined
   */
  onAddGymZone?: SingleHandler<number>;
};

const VirtualGymListItem = ({
  virtualGym,
  onAddGymZone
}: VirtualGymListItemProps): JSX.Element => {
  const [iteration, setIteration] = useState(0);

  const decrementIteration: EmptyHandler = () => {
    setIteration((prev) => prev - 1);
  };

  const incrementIteration: EmptyHandler = () => {
    setIteration((prev) => prev + 1);
  };

  const handleOnAddClick: EmptyHandler = () => {
    onAddGymZone?.(virtualGym.id);
  };

  return (
    <Stack key={virtualGym.id} component="section">
      <Header>
        <Link href={`/virtual-gyms/${virtualGym.id}`} passHref>
          <Anchor>
            <HeaderLink variant="h6">
              {virtualGym.name.toUpperCase()}
            </HeaderLink>
          </Anchor>
        </Link>
      </Header>

      <PaddedContentCard>
        <Stack direction="row" alignItems="center">
          <IconButton
            aria-label="carousel-prev"
            onClick={decrementIteration}
            disabled={!iteration}
          >
            <ChevronLeft />
          </IconButton>

          <CarouselStack
            direction="row"
            gap={2}
            alignItems="center"
            data-testid="gym-zone-carousel"
          >
            {virtualGym.gymZones.map((gymZone) => (
              <CarouselItem key={gymZone.id} iteration={iteration} width={46}>
                <Link
                  href={`/virtual-gyms/${virtualGym.id}/gym-zones/${gymZone.id}`}
                  passHref
                >
                  <Anchor>
                    <ContentCardAction color="primary">
                      <GymZoneListItem gymZone={gymZone} flat />
                    </ContentCardAction>
                  </Anchor>
                </Link>
              </CarouselItem>
            ))}

            <CarouselItem iteration={iteration} width={46}>
              <AddItemPlaceholder
                title={`add-gym-zone-${virtualGym.id}`}
                height={25}
                width={44}
                onClick={handleOnAddClick}
              >
                <PlaceholderText variant="placeholder">
                  Click me to create a new gym zone!
                </PlaceholderText>
              </AddItemPlaceholder>
            </CarouselItem>
          </CarouselStack>

          <IconButton
            aria-label="carousel-next"
            onClick={incrementIteration}
            disabled={iteration === virtualGym.gymZones.length}
          >
            <ChevronRight />
          </IconButton>
        </Stack>
      </PaddedContentCard>
    </Stack>
  );
};

export default VirtualGymListItem;
