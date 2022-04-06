import { render, screen } from '@testing-library/react';

import CalendarEventDescription from './CalendarEventDescription';

describe('<CalendarEventDescription />', () => {
  it('should render properly', () => {
    const { container } = render(<CalendarEventDescription />);

    expect(container).toBeInTheDocument();
    expect(screen.getByTitle('calendar-event-description')).toBeInTheDocument();
  });
});
