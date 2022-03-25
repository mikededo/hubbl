import React, { useState } from 'react';

import { motion } from 'framer-motion';

import { SingleHandler } from '@hubbl/shared/types';
import { useTheme } from '@mui/material';

export type HeaderNavWrapperProps = {
  children: React.ReactNode;

  /**
   * Whether the header is hidden or not
   */
  hidden?: boolean;
};

const HeaderNavWrapper = ({
  children,
  hidden = false
}: HeaderNavWrapperProps): JSX.Element => {
  const theme = useTheme();

  // Reference of the navigation wrapper
  const [headerRef, setHeaderRef] = useState<HTMLElement | null>(null);

  const handleOnSetRef: SingleHandler<HTMLElement> = (ref) => {
    setHeaderRef(ref);
  };

  return (
    <motion.header
      style={{
        position: 'fixed',
        left: 0,
        right: 0,
        zIndex: 1000,
        boxShadow: theme.shadows[21]
      }}
      animate={{
        top: hidden
          ? '0px'
          : `-${headerRef?.getBoundingClientRect().height ?? 0}px`
      }}
      transition={{ type: 'spring', stiffness: 700, damping: 50 }}
      ref={handleOnSetRef}
    >
      {children}
    </motion.header>
  );
};

export default HeaderNavWrapper;
