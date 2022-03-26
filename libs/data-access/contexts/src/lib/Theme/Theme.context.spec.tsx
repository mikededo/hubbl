import { render } from '@testing-library/react';
import { useTheme } from '@mui/material';
import { ThemeProvider } from './Theme.context';

const ThemeAccess = () => {
  const theme = useTheme();

  expect(theme).toBeDefined();
  expect(theme.palette.primary.main).toBe('#2196F3');
  expect(
    (theme.components?.MuiGrid?.styleOverrides?.root as any)({
      theme: {
        transitions: {
          create: (properties: string[]) => {
            expect(properties).toStrictEqual(['gap']);

            return {};
          }
        }
      }
    })
  ).toBeDefined();
  expect(
    (theme.components?.MuiInputBase?.styleOverrides?.adornedStart as any)({
      theme: { spacing: (n: number) => n * 8 }
    })
  ).toBeDefined();

  return <span />;
};

describe('<ThemeProvider />', () => {
  it('should have access to the custom theme', () => {
    const utils = render(
      <ThemeProvider>
        <ThemeAccess />
      </ThemeProvider>
    );

    expect(utils.container.firstChild).toBeInTheDocument();
  });
});
