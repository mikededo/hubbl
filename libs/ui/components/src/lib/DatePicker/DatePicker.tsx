import enLocale from 'date-fns/locale/en-GB';

import { SingleHandler } from '@hubbl/shared/types';
import { InputProps } from '@mui/material';
import { DatePicker as MuiDatePicker, LocalizationProvider } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { alpha, styled, TextField } from '@mui/material';

const Input = styled(TextField)(({ theme, error }) => ({
  '& .MuiInputBase-input': {
    marginRight: theme.spacing(-7.5),
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
    },
    '&.Mui-disabled:hover': {
      boxShadow: `${alpha(theme.palette.grey[500], 0.25)} 0 0 0 4px, ${alpha(
        theme.palette.grey[500],
        0.5
      )} 0 0 0 2px`
    }
  }
}));

export type DatePickerProps = {
  /**
   * Name forwarded to the input component
   */
  name: string;

  /**
   * Current value of the picker
   */
  value: Date | number | string;

  /**
   * Callback to run when the picker changes
   */
  onChangeDate: SingleHandler<Date | null>;
} & Partial<InputProps>;

const DatePicker = ({
  name,
  value,
  onChangeDate,
  ...props
}: DatePickerProps): JSX.Element => (
  <LocalizationProvider dateAdapter={AdapterDateFns} locale={enLocale}>
    <MuiDatePicker
      value={value}
      InputAdornmentProps={{ sx: { marginRight: 3 } }}
      minDate={new Date()}
      renderInput={({ label, margin, ...renderProps }) => (
        <Input
          {...renderProps}
          name={name}
          InputProps={{
            disableUnderline: true,
            ...renderProps.InputProps,
            ...props,
          }}
          inputProps={{ placeholder: 'dd/mm/yyyy', ...renderProps.inputProps }}
          variant="standard"
          fullWidth
        />
      )}
      onChange={onChangeDate}
    />
  </LocalizationProvider>
);

export default DatePicker;
