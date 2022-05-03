import { useState } from 'react';

import { motion } from 'framer-motion';

import { ChevronRight } from '@mui/icons-material';
import {
  IconButton,
  PaperProps,
  styled,
  Tooltip,
  useTheme
} from '@mui/material';

import ContentCard from '../ContentCard';

const AnimatedWrapper = styled(motion.div)<PaperProps>(({ theme }) => ({
  width: theme.spacing(44),
  height: `calc(100vh - ${theme.spacing(20.5)})`,
  position: 'fixed',
  right: theme.spacing(4),
  top: theme.spacing(16.5),
  zIndex: theme.zIndex.drawer,
  [theme.breakpoints.down('md')]: { right: theme.spacing(-12) }
}));

const Wrapper = styled(ContentCard)<PaperProps>(({ theme }) => ({
  overflow: 'hidden',
  width: '100%',
  height: '100%',
  zIndex: theme.zIndex.drawer
}));

const IconContentCard = styled(ContentCard)(({ theme }) => ({
  transform: `translateY(${theme.spacing(-8)})`,
  padding: 0,
  height: theme.spacing(6),
  width: theme.spacing(6),
  right: theme.spacing(4),
  top: theme.spacing(16.5),
  position: 'fixed',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: '0.3s right cubic-bezier(0.47, 1.64, 0.41, 0.8)',
  [theme.breakpoints.down('md')]: { right: theme.spacing(-12) }
}));

export type SideTogglerProps = {
  children?: React.ReactNode;

  /**
   * Label to show in the button when it has to be closed
   */
  hideLabel: string;

  /**
   * Label to show in the button when it has to be opened
   */
  showLabel: string;
};

const SideToggler = ({
  children,
  hideLabel,
  showLabel
}: SideTogglerProps): JSX.Element => {
  const theme = useTheme();

  const [hidden, setHidden] = useState(false);

  const handleOnToggleHidden = () => {
    setHidden((prev) => !prev);
  };

  return (
    <>
      <IconContentCard>
        <motion.span
          animate={{
            transform: `rotate(${hidden ? '180deg' : '0deg'})`
          }}
        >
          <Tooltip title={hidden ? showLabel : hideLabel}>
            <IconButton
              aria-label={`${hidden ? 'show' : 'hide'}-side-menu`}
              onClick={handleOnToggleHidden}
            >
              <ChevronRight />
            </IconButton>
          </Tooltip>
        </motion.span>
      </IconContentCard>

      <AnimatedWrapper
        animate={{ right: theme.spacing(!hidden ? 4 : -60) }}
        transition={{ type: 'spring', stiffness: 700, damping: 50 }}
      >
        <Wrapper>{children}</Wrapper>
      </AnimatedWrapper>
    </>
  );
};

export default SideToggler;
