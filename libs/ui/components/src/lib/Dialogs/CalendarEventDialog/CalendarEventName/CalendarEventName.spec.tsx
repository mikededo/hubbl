import { render, screen } from '@testing-library/react';

import CalendarEventName from './CalendarEventName';

describe('<CalendarEventName />', () => {
  it('should render properly', () => {
    const { container } = render(<CalendarEventName />);

    expect(container).toBeInTheDocument();
    expect(screen.getByTitle('calendar-event-name')).toBeInTheDocument();
  });
});
