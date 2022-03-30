import { AppPalette } from '@hubbl/shared/types';
import { render, screen } from '@testing-library/react';

import EventTypeListItem from './EventTypeListItem';

const eventType = {
  id: 1,
  name: 'EventType',
  description: 'Event type description',
  labelColor: AppPalette.EMERALD
};

describe('<EventTypeListItem />', () => {
  it('should render properly', () => {
    const { container } = render(
      <EventTypeListItem eventType={eventType as any} />
    );

    expect(container).toBeInTheDocument();

    // Find fields
    expect(screen.getByText(eventType.name)).toBeInTheDocument();
    expect(screen.getByText(eventType.name)).toBeInTheDocument();
    expect(screen.getByTitle(`${eventType.id}-color`)).toHaveStyle(
      `background-color: ${eventType.labelColor}`
    );
  });
});
