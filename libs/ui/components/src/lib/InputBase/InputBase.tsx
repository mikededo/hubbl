import { alpha, InputBase as MuiInputBase, styled } from '@mui/material';

const InputBase = styled(MuiInputBase)(({ theme, error }) => ({
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

export default InputBase;
