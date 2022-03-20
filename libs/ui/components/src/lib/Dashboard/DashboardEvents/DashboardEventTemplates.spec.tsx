import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import DashboardEventTemplates from './DashboardEventTemplates';

describe('<DashboardEventTemplates />', () => {
  const items = [
    {
      id: 1,
      name: 'Event One',
      date: { day: 29, month: 6, year: 2100 },
      startTime: '09:00',
      endTime: '10:00',
      maskRequired: true,
      covidPassport: true,
      appointmentCount: 15,
      capacity: 25
    },
    {
      id: 2,
      name: 'Event Two',
      date: { day: 29, month: 6, year: 2100 },
      startTime: '09:00',
      endTime: '10:00',
      maskRequired: true,
      covidPassport: true,
      appointmentCount: 15,
      capacity: 25
    },
    {
      id: 3,
      name: 'Event Three',
      date: { day: 29, month: 6, year: 2100 },
      startTime: '09:00',
      endTime: '10:00',
      maskRequired: true,
      covidPassport: true,
      appointmentCount: 15,
      capacity: 25
    }
  ];

  it('should render properly', () => {
    const { container } = render(
      <DashboardEventTemplates items={items as any} />
    );

    expect(container).toBeInTheDocument();
  });

  describe('items', () => {
    it('should render the three gym zones and the button', () => {
      render(<DashboardEventTemplates items={items as any} />);

      items.forEach(({ name }) => {
        expect(screen.getByText(name)).toBeInTheDocument();
      });
      expect(screen.getByTitle('add-event-template')).toBeInTheDocument();
    });

    it('should only render 5 items', () => {
      render(
        <DashboardEventTemplates
          items={
            // Override the id to avoid ESLint error log
            [...items, ...items].map((item, i) => ({ ...item, id: i })) as any
          }
        />
      );

      expect(screen.getAllByText(items[0].name).length).toBe(2);
      expect(screen.getAllByText(items[1].name).length).toBe(2);
      expect(screen.getAllByText(items[2].name).length).toBe(1);
    });
  });

  describe('onAddEventTemplate', () => {
    it('should call onAddEvent if placeholder clicked', () => {
      const onAddSpy = jest.fn();

      render(
        <DashboardEventTemplates
          items={items as any}
          onAddEventTemplate={onAddSpy}
        />
      );
      userEvent.click(
        screen.getByText('Click me to create a new event template!')
      );

      expect(onAddSpy).toHaveBeenCalledTimes(1);
    });
  });
});
