import { createTheme, ThemeProvider } from '@mui/material';
import { act, fireEvent, render, screen } from '@testing-library/react';

import SideToggler from './SideToggler';

describe('<SideToggler />', () => {
  it('should render properly', () => {
    const { container } = render(
      <ThemeProvider theme={createTheme()}>
        <SideToggler showLabel="Show toggler" hideLabel="Hide toggler" />
      </ThemeProvider>
    );
    expect(container).toBeInTheDocument();
  });

  it('should hide the list', async () => {
    render(
      <ThemeProvider theme={createTheme()}>
        <SideToggler showLabel="Show toggler" hideLabel="Hide toggler" />
      </ThemeProvider>
    );

    expect(screen.getByLabelText('hide-side-menu'));

    await act(async () => {
      fireEvent.click(screen.getByLabelText('hide-side-menu'));
    });

    expect(screen.getByLabelText('show-side-menu'));
  });
});
