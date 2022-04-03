import { render } from '@testing-library/react';

import CalendarSpotHeader from './CalendarSpotHeader';

describe('<CalendarSpotHeader />', () => {
  it('should render properly', () => {
    const { container } = render(<CalendarSpotHeader />);

    expect(container).toBeInTheDocument();
  });
});
