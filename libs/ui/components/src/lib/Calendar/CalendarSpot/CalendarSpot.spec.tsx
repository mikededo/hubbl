import { render } from '@testing-library/react';

import CalendarSpot from './CalendarSpot';

describe('<CalendarSpot />', () => {
  it('should render properly', () => {
    const { container } = render(<CalendarSpot />);

    expect(container).toBeInTheDocument();
  });
});
