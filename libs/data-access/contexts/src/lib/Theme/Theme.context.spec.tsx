import { render } from '@testing-library/react';
import { useTheme } from '@mui/material';
import { ThemeProvider } from './Theme.context';

const ThemeAccess = () => {
  const theme = useTheme();

  expect(theme).toBeDefined();
  expect(theme.palette.primary.main).toBe('#2196F3');

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
