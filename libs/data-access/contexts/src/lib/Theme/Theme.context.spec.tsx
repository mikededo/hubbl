import { render } from '@testing-library/react';
import { useTheme } from '@mui/material';
import { ThemeContext } from './Theme.context';

const ThemeAccess = () => {
  const theme = useTheme();

  expect(theme).toBeDefined();
  expect(theme.palette.primary.main).toBe('#2196F3');

  return <span />;
};

describe('ThemeContext', () => {
  it('should have access to the custom theme', () => {
    const utils = render(
      <ThemeContext>
        <ThemeAccess />
      </ThemeContext>
    );

    expect(utils.container.firstChild).toBeInTheDocument();
  });
});
