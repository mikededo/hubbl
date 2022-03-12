import { render, screen } from '@testing-library/react';

import DashboardVirtualGyms from './DashboardVirtualGyms';

describe('<DashboardVirtualGyms />', () => {
  const items = [
    {
      name: 'NameOne',
      description: 'Description',
      openTime: '09:00:00',
      closeTime: '21:00:00',
      location: 'Location'
    },
    {
      name: 'NameTwo',
      description: 'Description',
      openTime: '09:00:00',
      closeTime: '21:00:00',
      location: 'Location'
    },
    {
      name: 'NameThree',
      description: 'Description',
      openTime: '09:00:00',
      closeTime: '21:00:00',
      location: 'Location'
    }
  ];

  it('should render properly', () => {
    const { container } = render(<DashboardVirtualGyms items={items as any} />);

    expect(container).toBeInTheDocument();
  });

  describe('items', () => {
    it('should render the three virtual gyms and the button', () => {
      render(<DashboardVirtualGyms items={items as any} />);

      items.forEach(({ name }) => {
        expect(screen.getByText(name.toUpperCase())).toBeInTheDocument();
      });
      expect(screen.getByTitle('add-virtual-gym')).toBeInTheDocument();
    });

    it('should only render 5 items', () => {
      render(<DashboardVirtualGyms items={[...items, ...items] as any} />);

      expect(screen.getAllByText(items[0].name.toUpperCase()).length).toBe(2);
      expect(screen.getAllByText(items[1].name.toUpperCase()).length).toBe(2);
      expect(screen.getAllByText(items[2].name.toUpperCase()).length).toBe(1);
    });
  });
});
