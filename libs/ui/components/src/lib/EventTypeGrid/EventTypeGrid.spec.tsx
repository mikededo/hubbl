import { ThemeProvider } from '@emotion/react';
import { AppPalette } from '@hubbl/shared/types';
import { createTheme } from '@mui/material';
import { fireEvent, render, screen } from '@testing-library/react';

import type { EventTypeGridProps } from './EventTypeGrid';
import EventTypeGrid from './EventTypeGrid';

type LinkProps = {
  children: React.ReactElement;
  href: string;
  passHref: boolean;
};

// Mock link so it does not call push when clicking a card
jest.mock('next/link', () => {
  const React = jest.requireActual('react');

  return ({ children, href }: LinkProps) =>
    React.cloneElement(children, { href: href });
});

const Component = ({
  eventTypes,
  onAddEventType,
  onEventTypeClick
}: Partial<EventTypeGridProps>) => (
  <ThemeProvider theme={createTheme()}>
    <EventTypeGrid
      eventTypes={eventTypes as any}
      onAddEventType={onAddEventType}
      onEventTypeClick={onEventTypeClick}
    />
  </ThemeProvider>
);

const eventTypes = [
  {
    id: 1,
    name: 'One',
    description: 'Event type one description',
    labelColor: AppPalette.EMERALD
  },
  {
    id: 2,
    name: 'Two',
    description: 'Event type two description',
    labelColor: AppPalette.INDIGO
  },
  {
    id: 3,
    name: 'Three',
    description: 'Event type three description',
    labelColor: AppPalette.PURPLE
  },
  {
    id: 4,
    name: 'Four',
    description: 'Event type four description',
    labelColor: AppPalette.ORANGE
  },
  {
    id: 5,
    name: 'Five',
    description: 'Event type five description',
    labelColor: AppPalette.PINK
  }
];

describe('<EventTypeGrid />', () => {
  it('should render properly', () => {
    const { container } = render(<Component eventTypes={eventTypes as any} />);

    expect(container).toBeInTheDocument();

    // Header
    expect(screen.getByText('Event types')).toBeInTheDocument();
    // Events
    eventTypes.forEach(({ name }) => {
      expect(screen.getByText(name)).toBeInTheDocument();
    });
  });

  describe('onAddClick', () => {
    it('should call onAddEventType if add button clicked', () => {
      const onAddSpy = jest.fn();

      render(
        <Component eventTypes={eventTypes as any} onAddEventType={onAddSpy} />
      );
      fireEvent.click(screen.getByTitle('add-event-type'));

      expect(onAddSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('onEventTypeClick', () => {
    it('should call onEventTypeClick if no href is passed', () => {
      const onClickSpy = jest.fn();

      render(
        <Component
          eventTypes={eventTypes as any}
          onEventTypeClick={onClickSpy}
        />
      );
      fireEvent.click(screen.getByTitle(`event-type-${eventTypes[0].id}`));

      expect(onClickSpy).toHaveBeenCalledTimes(1);
      expect(onClickSpy).toHaveBeenCalledWith(eventTypes[0].id);
    });
  });
});
