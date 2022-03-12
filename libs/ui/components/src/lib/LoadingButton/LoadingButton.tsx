import { AnimatePresence } from 'framer-motion';

import {
  Button,
  ButtonProps,
  CircularProgress,
  styled,
  Typography
} from '@mui/material';

const FixedHeightButton = styled(Button)(({ theme }) => ({
  height: theme.spacing(5)
}));

type LoadingButtonProps = {
  label: string;
  loading?: boolean;
};

const LoadingButton = ({
  label,
  loading = false,
  ...props
}: LoadingButtonProps & ButtonProps) => (
  <FixedHeightButton
    startIcon={loading ? null : props.startIcon}
    disabled={loading}
    {...props}
  >
    <AnimatePresence>
      {loading ? (
        <CircularProgress size="1.5rem" thickness={4} />
      ) : (
        <Typography variant="button">{label}</Typography>
      )}
    </AnimatePresence>
  </FixedHeightButton>
);

export default LoadingButton;
