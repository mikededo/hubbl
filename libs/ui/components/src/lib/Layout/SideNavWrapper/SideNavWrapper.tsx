import React, { useState } from 'react';

import { motion } from 'framer-motion';

import { SingleHandler } from '@hubbl/shared/types';
import { useTheme } from '@mui/material';

export type SideNavWrapperProps = {
  children: React.ReactNode;

  /**
   * Whether the header is hidden or not
   */
  hidden?: boolean;

  /**
   * Whether the header is toggled or not
   */
  toggled?: boolean;
};

const SideNavWrapper = ({
  children,
  hidden = false,
  toggled = false
}: SideNavWrapperProps): JSX.Element => {
  const theme = useTheme();

  // Reference of the navigation wrapper
  const [ref, setRef] = useState<HTMLElement | null>(null);

  const handleOnSetRef: SingleHandler<HTMLElement> = (ref) => {
    setRef(ref);
  };

  return (
    <motion.nav
      role="menubar"
      animate={{
        marginLeft: hidden
          ? `-${ref?.getBoundingClientRect().width ?? 0}px`
          : '0px',
        paddingTop: theme.spacing(toggled ? 4 : 0)
      }}
      transition={{ type: 'spring', stiffness: 700, damping: 50 }}
      ref={handleOnSetRef}
    >
      {children}
    </motion.nav>
  );
};

export default SideNavWrapper;
