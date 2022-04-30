import { createTheme, ThemeProvider } from '@mui/material';
import { render } from '@testing-library/react';

import ClientSideNav from './ClientSideNav';

describe('<ClientSideNav />', () => {
  it('should render properly', () => {
    // The component is not furtherly tested, as it does not
    // add more complexity other than what the SideNav component
    // does, which has already the required tests
    const { container } = render(
      <ThemeProvider theme={createTheme()}>
        <ClientSideNav header="Test header" selected="dashboard" />
      </ThemeProvider>
    );

    expect(container).toBeInTheDocument();
  });
});
