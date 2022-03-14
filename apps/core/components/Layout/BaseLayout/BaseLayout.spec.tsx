import { createTheme, ThemeProvider } from '@mui/material';
import { render } from '@testing-library/react';

import BaseLayout from './BaseLayout';

describe('<BaseLayout />', () => {
  it('should render properly', () => {
    const { container } = render(
      <ThemeProvider theme={createTheme()}>
        <BaseLayout header="Test header" selected="dashboard">
          <div>Child</div>
        </BaseLayout>
      </ThemeProvider>
    );

    expect(container).toBeInTheDocument();
  });
});
