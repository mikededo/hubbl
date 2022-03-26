import React from 'react';

import {
  alpha,
  createTheme,
  darken,
  Theme,
  ThemeProvider
} from '@mui/material';

declare module '@mui/material/styles' {
  interface TypographyVariants {
    placeholder: React.CSSProperties;
  }

  interface TypographyVariantsOptions {
    placeholder?: React.CSSProperties;
  }
}

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    placeholder: true;
  }
}

const AppTheme: Theme = createTheme({
  palette: {
    primary: { main: '#2196F3' },
    text: { primary: '#3F3F3F', secondary: '#666666', disabled: '#BBBBBB' },
    success: { main: '#68D391' },
    info: { main: '#2196F3' },
    error: { main: '#F56565' },
    divider: alpha('#94A3B8', 0.15)
  },
  typography: {
    fontFamily: 'Inter',
    h1: { fontSize: 32, fontWeight: 500, color: '#3F3F3F' },
    h2: { fontSize: 28, fontWeight: 500, color: '#3F3F3F' },
    h3: { fontWeight: 500, color: '#3F3F3F' },
    h5: { fontSize: 18, fontWeight: 500, color: '#3F3F3F' },
    h6: { fontSize: 16, fontWeight: 500, color: '#3F3F3F' },
    body1: { color: '#3F3F3F' },
    body2: { fontSize: 14, color: '#3F3F3F' },
    subtitle1: { fontSize: 14, color: '#666666' },
    subtitle2: { fontSize: 12, fontWeight: 400, color: '#666666' },
    button: { fontSize: 16, textTransform: 'none' },
    placeholder: { fontSize: 16, fontWeight: 400, color: '#BBB' }
  },
  shadows: [
    'none',
    `0 8px 12px ${alpha('#777', 0.0)}`,
    `0 8px 12px ${alpha('#777', 0.1)}`,
    `0 8px 12px ${alpha('#777', 0.15)}`,
    `0 8px 12px ${alpha('#777', 0.2)}`,
    `0 8px 12px ${alpha('#777', 0.25)}`,
    `0 8px 12px ${alpha('#777', 0.3)}`,
    `0 8px 12px ${alpha('#777', 0.35)}`,
    `0 8px 12px ${alpha('#777', 0.4)}`,
    `0 8px 12px ${alpha('#777', 0.45)}`,
    `0 8px 12px ${alpha('#777', 0.5)}`,
    `0 8px 12px ${alpha('#777', 0.55)}`,
    `0 8px 12px ${alpha('#777', 0.6)}`,
    `0 8px 12px ${alpha('#777', 0.65)}`,
    `0 8px 12px ${alpha('#777', 0.7)}`,
    `0 8px 12px ${alpha('#777', 0.75)}`,
    `0 8px 12px ${alpha('#777', 0.8)}`,
    `0 8px 12px ${alpha('#777', 0.85)}`,
    `0 8px 12px ${alpha('#777', 0.9)}`,
    `0 8px 12px ${alpha('#777', 0.95)}`,
    // Dialogs
    `0 0px 12px ${alpha('#777', 0.15)}`,
    `0 0px 12px ${alpha('#777', 0.25)}`,
    `0 0px 12px ${alpha('#777', 0.5)}`,
    `0 0px 12px ${alpha('#777', 0.75)}`,
    `0 0px 12px ${alpha('#777', 1)}`
  ],
  shape: { borderRadius: 8 },
  components: {
    MuiAlert: {
      styleOverrides: {
        root: { boxShadow: `0 4px 6px ${alpha('#777', 0.15)}` }
      }
    },
    MuiButton: {
      defaultProps: { variant: 'contained', disableElevation: true },
      styleOverrides: {
        containedSecondary: {
          backgroundColor: '#4A5568',
          ':hover': { backgroundColor: darken('#4A5568', 0.3) }
        }
      }
    },
    MuiCardActionArea: {
      styleOverrides: { root: { color: '#3F3F3F' } }
    },
    MuiGrid: {
      styleOverrides: {
        root: ({ theme }) => ({
          transition: theme.transitions.create(['gap'])
        })
      }
    },
    MuiInputBase: {
      styleOverrides: {
        adornedStart: ({ theme }) => ({
          '& .MuiInputAdornment-root': { marginLeft: theme.spacing(2) },
          '&.MuiInputBase-root .MuiInputBase-input': {
            marginLeft: theme.spacing(-5.5),
            paddingLeft: theme.spacing(6)
          }
        })
      }
    },
    MuiSkeleton: {
      styleOverrides: {
        rectangular: { borderRadius: 8 }
      }
    }
  }
});

type ThemeContextProps = { children: React.ReactNode };

const ThemeContext = ({ children }: ThemeContextProps): JSX.Element => (
  <ThemeProvider theme={AppTheme}>{children}</ThemeProvider>
);

export { ThemeContext as ThemeProvider };
