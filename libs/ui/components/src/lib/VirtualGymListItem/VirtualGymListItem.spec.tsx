import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import VirtualGymListItem from './VirtualGymListItem';

describe('<VirtualGymListItem />', () => {
  const gymZoneAttrs = {
    description: 'Description',
    openTime: '09:00:00',
    closeTime: '21:00:00',
    isClassType: false,
    covidPassport: true,
    maskRequired: true,
    capacity: 25
  };

  const filledVirtualGym = {
    id: 1,
    name: 'VirtualGymOne',
    gymZones: [
      { id: 1, name: 'OneOne', ...gymZoneAttrs },
      { id: 2, name: 'TwoOne', ...gymZoneAttrs },
      { id: 3, name: 'ThreeOne', ...gymZoneAttrs },
      { id: 4, name: 'FourOne', ...gymZoneAttrs },
      { id: 5, name: 'FiveOne', ...gymZoneAttrs },
      { id: 6, name: 'SixOne', ...gymZoneAttrs }
    ]
  };
  const emptyVirtualGym = {
    id: 2,
    name: 'VirtualGymTwo',
    gymZones: []
  };

  describe('virtualGyms', () => {
    it('should render a virtual gym with no gym zones', () => {
      const { container } = render(
        <VirtualGymListItem virtualGym={emptyVirtualGym as any} />
      );

      expect(container).toBeInTheDocument();

      const header = screen.getByText(emptyVirtualGym.name.toUpperCase());
      expect(header).toBeInTheDocument();
      expect(header.closest('a')).toHaveAttribute(
        'href',
        `/virtual-gyms/${emptyVirtualGym.id}`
      );
    });

    it('should render a virtual gym with gym zones', () => {
      const { container } = render(
        <VirtualGymListItem
          virtualGym={filledVirtualGym as any}
        />
      );

      expect(container).toBeInTheDocument();

      const header = screen.getByText(filledVirtualGym.name.toUpperCase());
      expect(header).toBeInTheDocument();
      expect(header.closest('a')).toHaveAttribute(
        'href',
        `/virtual-gyms/${filledVirtualGym.id}`
      );
      filledVirtualGym.gymZones.forEach(({ name }) => {
        expect(screen.getByText(name.toUpperCase())).toBeInTheDocument();
      });

      // Ensure there's the button all all the children
      expect(screen.getByTestId('gym-zone-carousel').childElementCount).toBe(
        filledVirtualGym.gymZones.length
      );
    });

    it('should iterate the carousel', async () => {
      render(
        <VirtualGymListItem
          virtualGym={
            {
              ...filledVirtualGym,
              gymZones: filledVirtualGym.gymZones.slice(0, 1)
            } as any
          }
        />
      );

      const prev = screen.getByLabelText('carousel-prev');
      const next = screen.getByLabelText('carousel-next');

      expect(prev).toBeDisabled();
      expect(next).not.toBeDisabled();

      await act(async () => {
        userEvent.click(next);
      });

      expect(prev).not.toBeDisabled();
      expect(next).toBeDisabled();

      await act(async () => {
        userEvent.click(prev);
      });

      expect(prev).toBeDisabled();
      expect(next).not.toBeDisabled();
    });
  });

  describe('onAddVirtualGym', () => {
    it('should call onAddVirtualGym', () => {
      const onClickSpy = jest.fn();

      render(
        <VirtualGymListItem
          virtualGym={emptyVirtualGym as any}
          onAddGymZone={onClickSpy}
        />
      );
      fireEvent.click(screen.getByTitle(`add-gym-zone-${emptyVirtualGym.id}`));

      expect(onClickSpy).toHaveBeenCalled();
      expect(onClickSpy).toHaveBeenCalledWith(emptyVirtualGym.id);
    });
  });
});
