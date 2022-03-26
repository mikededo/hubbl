import { render } from '@testing-library/react';
import { AppPalette } from '@hubbl/shared/types';

import ColorCircle from './ColorCircle';

describe('<ColorCircle />', () => {
  it('should render properly', () => {
    const { container } = render(<ColorCircle color={AppPalette.RED} />);

    expect(container).toBeInTheDocument();
    expect(container.firstChild).toHaveStyle(
      `background-color: ${AppPalette.RED}`
    );
  });
});
