import React from 'react';

import { motion } from 'framer-motion';

import { useTheme } from '@mui/material';

export type CarouselItemProps = {
  /**
   * Content of the item to render.
   */
  children: React.ReactNode;

  /**
   * Iteration count, which is multiplied by the width to 
   * move the element.
   */
  iteration: number;

  /**
   * Width of the element to render. The with is multiplied
   * by the `theme.spacing` value.
   */
  width: number;
};

const CarouselItem = ({
  children,
  iteration,
  width
}: CarouselItemProps): JSX.Element => {
  const theme = useTheme();

  return (
    <motion.li
      style={{ listStyle: 'none' }}
      animate={{ x: theme.spacing(-(width * iteration)) }}
      transition={{ type: 'spring', stiffness: 700, damping: 50 }}
    >
      {children}
    </motion.li>
  );
};

export default CarouselItem;
