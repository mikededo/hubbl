import { ThemeProvider } from '@mui/material';
import { createTheme } from '@mui/system';
import { render } from '@testing-library/react';

import CarouselItem from './CarouselItem';

describe('<CarouselItem />', () => {
  it('should render properly', () => {
    const utils = render(
      <ThemeProvider theme={createTheme()}>
        <CarouselItem iteration={0} width={25}>
          Content
        </CarouselItem>
      </ThemeProvider>
    );

    expect(utils.container).toBeInTheDocument();
    expect(utils.getByText('Content')).toBeInTheDocument();
  });
});
