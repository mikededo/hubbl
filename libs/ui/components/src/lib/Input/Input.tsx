import { UseFormRegisterReturn } from 'react-hook-form';

import {
  alpha,
  InputBase,
  InputBaseProps,
  Stack,
  styled,
  Typography
} from '@mui/material';

const Styled = styled(InputBase)(({ theme, error }) => ({
  '& .MuiInputBase-input': {
    position: 'relative',
    backgroundColor: alpha('#94A3B8', 0.15),
    borderColor: alpha(theme.palette.primary.main, 0),
    fontSize: 16,
    borderRadius: theme.spacing(1),
    padding: theme.spacing(1.25, 1.5),
    transition: theme.transitions.create(
      ['border-color', 'background-color', 'box-shadow'],
      { duration: '0.2s' }
    ),
    boxShadow: error
      ? `${alpha(theme.palette.error.main, 0.25)} 0 0 0 4px, ${alpha(
          theme.palette.error.main,
          0.5
        )} 0 0 0 2px`
      : undefined,
    '&:hover': {
      boxShadow: `${alpha(
        theme.palette[error ? 'error' : 'primary'].main,
        error ? 0.75 : 0.25
      )} 0 0 0 2px`
    },
    '&:focus': {
      boxShadow: `${alpha(theme.palette.primary.main, 0.25)} 0 0 0 4px, ${alpha(
        theme.palette.primary.main,
        0.5
      )} 0 0 0 2px`
    }
  }
}));

type InputProps = { label: string; registerResult: UseFormRegisterReturn };

const Input = ({
  label,
  registerResult,
  ...props
}: InputProps & InputBaseProps): JSX.Element => (
  <Stack direction="column" gap={1}>
    <Typography variant="h6" component="label">
      {label}
    </Typography>

    <Styled {...props} {...registerResult} />
  </Stack>
);

export default Input;
