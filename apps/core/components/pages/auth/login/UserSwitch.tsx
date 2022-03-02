import { motion } from 'framer-motion';

import { EmptyHandler } from '@hubbl/shared/types';
import { alpha, styled, Typography } from '@mui/material';

const SwitchContainer = styled(motion.div)(({ theme }) => ({
  height: theme.spacing(6),
  width: '100%',
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha('#94A3B8', 0.15),
  cursor: 'pointer'
}));

const SwitchText = styled(Typography)({
  width: '50%',
  textAlign: 'center',
  zIndex: 1
});

const SwitchSlider = styled(motion.span)(({ theme }) => ({
  backgroundColor: 'white',
  position: 'absolute',
  textAlign: 'center',
  top: theme.spacing(0.5),
  bottom: theme.spacing(0.5),
  borderRadius: theme.spacing(1),
  boxShadow: `0 4px 6px ${alpha('#777', 0.15)}`
}));

const AnimationVariants = {
  owner: { left: 4, right: 250 },
  worker: { left: 250, right: 4 }
};

type UserSwitchProps = {
  owner: boolean;
  onClick: EmptyHandler;
};

const UserSwitch = ({ owner, onClick }: UserSwitchProps) => (
  <SwitchContainer role="switch" onClick={onClick}>
    <SwitchText>Owner</SwitchText>
    <SwitchText>Worker</SwitchText>

    <SwitchSlider
      key="slider"
      animate={owner ? 'owner' : 'worker'}
      variants={AnimationVariants}
      transition={{ type: 'spring', stiffness: 700, damping: 50 }}
    />
  </SwitchContainer>
);

export default UserSwitch;
