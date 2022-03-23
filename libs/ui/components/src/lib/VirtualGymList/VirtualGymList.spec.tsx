import { render, fireEvent, screen } from '@testing-library/react';

import VirtualGymList from './VirtualGymList';

describe('<VirtualGymList />', () => {
  const virtualGyms = [
    { id: 1, name: 'VirtualGymOne', gymZones: [] },
    { id: 2, name: 'VirtualGymTwo', gymZones: [] },
    { id: 3, name: 'VirtualGymThree', gymZones: [] }
  ];

  describe('virtualGyms', () => {
    it('should render the list of virtual gyms', () => {
      const { container } = render(
        <VirtualGymList virtualGyms={virtualGyms as any} />
      );

      expect(container).toBeInTheDocument();

      virtualGyms.forEach(({ id, name }) => {
        expect(screen.getByText(name.toUpperCase())).toBeInTheDocument();
        expect(screen.getByTitle(`add-gym-zone-${id}`)).toBeInTheDocument();
      });

      expect(screen.getByTitle('add-virtual-gym')).toBeInTheDocument();
    });
  });

  describe('onAddVirtualGym', () => {
    it('should call onAddVirtualGym', () => {
      const onAddSpy = jest.fn();

      render(<VirtualGymList virtualGyms={[]} onAddVirtualGym={onAddSpy} />);
      fireEvent.click(screen.getByTitle('add-virtual-gym'));

      expect(onAddSpy).toHaveBeenCalled();
    });
  });

  describe('onAddGymZone', () => {
    it('should call onAddGymZone', () => {
      const onAddSpy = jest.fn();

      render(
        <VirtualGymList
          virtualGyms={virtualGyms as any}
          onAddGymZone={onAddSpy}
        />
      );
      fireEvent.click(screen.getByTitle(`add-gym-zone-${virtualGyms[0].id}`));

      expect(onAddSpy).toHaveBeenCalled();
      expect(onAddSpy).toHaveBeenCalledWith(virtualGyms[0].id);
    });
  });
});
