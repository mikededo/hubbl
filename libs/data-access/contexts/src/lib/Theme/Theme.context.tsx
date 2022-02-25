import { alpha, createTheme, Theme, ThemeProvider } from '@mui/material';
import React from 'react';

const AppTheme: Theme = createTheme({
  palette: {
    primary: { main: '#2196F3' },
    text: { primary: '#3F3F3F', secondary: '#666666', disabled: '#BBBBBB' },
    divider: alpha('#94A3B8', 0.15)
  },
  typography: {
    fontFamily: 'Inter',
    h1: { fontSize: 32, fontWeight: 500, color: '#3F3F3F' },
    h2: { fontSize: 28, fontWeight: 500, color: '#3F3F3F' },
    h3: { fontWeight: 500, color: '#3F3F3F' },
    h6: { fontSize: 16, fontWeight: 500, color: '#3F3F3F' },
    subtitle1: { fontSize: 14, color: '#666666' },
    subtitle2: { fontSize: 12, fontWeight: 400, color: '#666666' },
    button: { fontSize: 16, textTransform: 'none' }
  },
  shape: { borderRadius: 8 },
  components: {
    MuiButton: {
      defaultProps: { variant: 'contained', disableElevation: true }
    }
  }
});

type ThemeContextProps = { children: React.ReactNode };

const ThemeContext = ({ children }: ThemeContextProps): JSX.Element => (
  <ThemeProvider theme={AppTheme}>{children}</ThemeProvider>
);

export { ThemeContext };
