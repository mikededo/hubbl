import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import DashboardGymZones from './DashboardGymZones';

describe('<DashboardGymZones />', () => {
  const items = [
    {
      id: 1,
      name: 'NameOne',
      description: 'Description',
      openTime: '09:00:00',
      closeTime: '21:00:00',
      isClassType: false,
      covidPassport: true,
      maskRequired: true,
      capacity: 25
    },
    {
      id: 2,
      name: 'NameTwo',
      description: 'Description',
      openTime: '09:00:00',
      closeTime: '21:00:00',
      isClassType: false,
      covidPassport: true,
      maskRequired: true,
      capacity: 25
    },
    {
      id: 3,
      name: 'NameThree',
      description: 'Description',
      openTime: '09:00:00',
      closeTime: '21:00:00',
      isClassType: false,
      covidPassport: true,
      maskRequired: true,
      capacity: 25
    }
  ];

  it('should render properly', () => {
    const { container } = render(<DashboardGymZones items={items as any} />);

    expect(container).toBeInTheDocument();
  });

  describe('items', () => {
    it('should render the three gym zones and the button', () => {
      render(<DashboardGymZones items={items as any} />);

      items.forEach(({ name }) => {
        expect(screen.getByText(name.toUpperCase())).toBeInTheDocument();
      });
      expect(screen.queryByTitle('add-gym-zone')).not.toBeInTheDocument();
    });

    it('should only render 5 items', () => {
      render(
        <DashboardGymZones
          items={
            // Override the id to avoid ESLint error log
            [...items, ...items].map((item, i) => ({ ...item, id: i })) as any
          }
        />
      );

      expect(screen.getAllByText(items[0].name.toUpperCase()).length).toBe(2);
      expect(screen.getAllByText(items[1].name.toUpperCase()).length).toBe(2);
      expect(screen.getAllByText(items[2].name.toUpperCase()).length).toBe(1);
    });
  });

  describe('onAddClick', () => {
    it('should call onAddGymZone if placeholder clicked', () => {
      const onAddSpy = jest.fn();

      render(
        <DashboardGymZones items={items as any} onAddGymZone={onAddSpy} />
      );
      userEvent.click(screen.getByText('Click me to create a new gym zone!'));

      expect(onAddSpy).toHaveBeenCalledTimes(1);
    });
  });
});
