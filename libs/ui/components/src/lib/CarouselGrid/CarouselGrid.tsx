import { Children, useState } from 'react';

import { EmptyHandler } from '@hubbl/shared/types';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { IconButton, Stack, styled, Typography } from '@mui/material';
import CarouselItem from '../CarouselItem';

const GridWrapper = styled(Stack)(({ theme }) => ({
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

export type CarouselGridProps = {
  /**
   * Children to render inside the grid
   */
  children: React.ReactNode;

  /**
   * Header of the section
   */
  header: string;

  /**
   * Number of elements per row
   *
   * @default 2
   */
  rowCount?: number;

  /**
   * Width of each item as a `theme.spacing` factor
   */
  width: number;
};

const CarouselGrid = ({
  children,
  header,
  rowCount = 2,
  width
}: CarouselGridProps): JSX.Element => {
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
            disabled={iteration >= Children.count(children) / rowCount - 1}
            onClick={incrementIteration}
          >
            <ChevronRight fontSize="large" />
          </IconButton>
        </Stack>
      </Stack>

      <GridWrapper
        direction="column"
        flexWrap="wrap"
        alignItems="flex-start"
        alignContent="flex-start"
        gap={0}
      >
        {Children.map(children, (child) => (
          <CarouselItem iteration={iteration} width={width}>
            {child}
          </CarouselItem>
        ))}
      </GridWrapper>
    </Stack>
  );
};

export default CarouselGrid;
