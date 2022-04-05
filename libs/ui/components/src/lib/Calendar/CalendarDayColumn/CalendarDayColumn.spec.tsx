import { render } from '@testing-library/react';

import CalendarDayColumn from './CalendarDayColumn';

describe('<CalendarDayColumn />', () => {
  it('should render properly', () => {
    const { container } = render(<CalendarDayColumn />);

    expect(container).toBeInTheDocument();
  });
});
