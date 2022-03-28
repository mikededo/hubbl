import { AppPalette } from '@hubbl/shared/types';
import { render, screen } from '@testing-library/react';

import EventTemplateListItem from './EventTemplateListItem';

const eventTemplate = {
  id: 1,
  name: 'Template',
  description: 'Event template description',
  maskRequired: true,
  covidPassport: true,
  type: {
    id: 1,
    name: 'EventType',
    description: 'Event type description',
    labelColor: AppPalette.EMERALD
  }
};

describe('<EventTemplateListItem />', () => {
  it('should render properly', () => {
    const { container } = render(
      <EventTemplateListItem eventTemplate={eventTemplate as any} />
    );

    expect(container).toBeInTheDocument();

    // Find fields
    expect(screen.getByText(eventTemplate.name)).toBeInTheDocument();
    expect(screen.getByText(eventTemplate.name)).toBeInTheDocument();
    expect(screen.getByText(eventTemplate.type.name)).toBeInTheDocument();
    expect(screen.getByTitle(`${eventTemplate.id}-color`)).toHaveStyle(
      `background-color: ${eventTemplate.type.labelColor}`
    );
    // Icons
    expect(screen.getByTitle('mask-required')).toBeInTheDocument();
    expect(screen.getByTitle('passport-required')).toBeInTheDocument();
  });

  it.each([
    { ...eventTemplate, difficulty: 1 },
    { ...eventTemplate, difficulty: 2 },
    { ...eventTemplate, difficulty: 3 },
    { ...eventTemplate, difficulty: 4 },
    { ...eventTemplate, difficulty: 5 }
  ])('should render properly for difficulty $difficulty', (eventTemplate) => {
    const { container } = render(
      <EventTemplateListItem eventTemplate={eventTemplate as any} />
    );

    expect(container).toBeInTheDocument();
  });

  it('should render the opposite colours', () => {
    const { container } = render(
      <EventTemplateListItem
        eventTemplate={
          { ...eventTemplate, maskRequired: false, covidPassport: false } as any
        }
      />
    );

    expect(container).toBeInTheDocument();

    // Find fields
    expect(screen.getByText(eventTemplate.name)).toBeInTheDocument();
    expect(screen.getByText(eventTemplate.name)).toBeInTheDocument();
    expect(screen.getByText(eventTemplate.type.name)).toBeInTheDocument();
    expect(screen.getByTitle(`${eventTemplate.id}-color`)).toHaveStyle(
      `background-color: ${eventTemplate.type.labelColor}`
    );
    // Icons
    expect(screen.getByTitle('mask-not-required')).toBeInTheDocument();
    expect(screen.getByTitle('passport-not-required')).toBeInTheDocument();
  });
});
