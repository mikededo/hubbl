import { render } from '@testing-library/react';

import CalendarWeek from './CalendarWeek';

describe('<CalendarWeek />', () => {
  it('should render properly', () => {
    const { container } = render(<CalendarWeek />);

    expect(container).toBeInTheDocument();
  });
});
