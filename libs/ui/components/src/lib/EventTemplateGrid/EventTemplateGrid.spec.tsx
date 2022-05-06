import { AppPalette } from '@hubbl/shared/types';
import { fireEvent, render, screen } from '@testing-library/react';

import EventTemplateGrid from './EventTemplateGrid';

const templateAttrs = {
  maskRequired: true,
  covidPassport: true,
  type: {
    id: 1,
    name: 'EventType',
    description: 'Event type description',
    labelColor: AppPalette.EMERALD
  }
};

const templates = [
  {
    id: 1,
    name: 'One',
    description: 'Event template description',
    ...templateAttrs
  },
  {
    id: 2,
    name: 'Two',
    description: 'Event template description',
    ...templateAttrs
  },
  {
    id: 3,
    name: 'Three',
    description: 'Event template description',
    ...templateAttrs
  },
  {
    id: 4,
    name: 'Four',
    description: 'Event template description',
    ...templateAttrs
  }
];

describe('<EventTemplateGrid />', () => {
  it('should render properly', () => {
    const { container } = render(
      <EventTemplateGrid eventTemplates={templates as any} />
    );

    expect(container).toBeInTheDocument();

    // Header
    expect(screen.getByText('Event templates')).toBeInTheDocument();
    // Events
    templates.forEach(({ name }) => {
      expect(screen.getByText(name)).toBeInTheDocument();
    });
  });

  describe('onAddClick', () => {
    it('should call onAddEventTemplate if add button clicked', () => {
      const onAddSpy = jest.fn();

      render(
        <EventTemplateGrid
          eventTemplates={templates as any}
          onAddEventTemplate={onAddSpy}
        />
      );
      fireEvent.click(screen.getByTitle('add-event-template'));

      expect(onAddSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('onEventTypeClick', () => {
    it('should call onEventTypeClick if no href is passed', () => {
      const onClickSpy = jest.fn();

      render(
        <EventTemplateGrid
          eventTemplates={templates as any}
          onEventTemplateClick={onClickSpy}
        />
      );
      fireEvent.click(screen.getByTitle(`event-template-${templates[0].id}`));

      expect(onClickSpy).toHaveBeenCalledTimes(1);
      expect(onClickSpy).toHaveBeenCalledWith(templates[0].id);
    });
  });
});
