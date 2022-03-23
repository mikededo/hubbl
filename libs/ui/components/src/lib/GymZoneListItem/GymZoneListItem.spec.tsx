import { alpha } from '@mui/material';
import { render, screen } from '@testing-library/react';

import GymZoneListItem from './GymZoneListItem';

describe('<GymZoneListItem />', () => {
  const gymZone = {
    id: 10,
    name: 'Name',
    description: 'Description',
    openTime: '09:00:00',
    closeTime: '21:00:00',
    isClassType: false,
    covidPassport: true,
    maskRequired: true,
    capacity: 25
  };

  it('should render properly', () => {
    const { container } = render(<GymZoneListItem gymZone={gymZone as any} />);

    expect(container).toBeInTheDocument();
  });

  describe('flat', () => {
    it('should render properly', () => {
      const { container } = render(
        <GymZoneListItem gymZone={gymZone as any} flat />
      );

      expect(container.firstChild).toHaveStyle(
        `boxShadow: 0 0 6px ${alpha('#777', 0.15)}`
      );
    });
  });

  describe('gymZone', () => {
    it('should render the gym fields', () => {
      render(<GymZoneListItem gymZone={gymZone as any} />);

      expect(screen.getByText(gymZone.name.toUpperCase())).toBeInTheDocument();
      expect(screen.getByText(gymZone.description)).toBeInTheDocument();
      expect(
        screen.getByText(`${gymZone.openTime} - ${gymZone.closeTime}`)
      ).toBeInTheDocument();
      expect(
        screen.getByText(`Maximum capacity: ${gymZone.capacity}`)
      ).toBeInTheDocument();

      // Find icons
      expect(screen.getByLabelText('Non class zone')).toBeInTheDocument();
      expect(screen.getByTitle('non-class-zone')).toBeInTheDocument();
      expect(screen.getByLabelText('Facial mask required')).toBeInTheDocument();
      expect(screen.getByTitle('mask-required')).toBeInTheDocument();
      expect(
        screen.getByLabelText('Covid passport required')
      ).toBeInTheDocument();
      expect(screen.getByTitle('passport-required')).toBeInTheDocument();
    });

    it('should render the opposite icon titles', () => {
      render(
        <GymZoneListItem
          gymZone={
            {
              ...gymZone,
              isClassType: true,
              covidPassport: false,
              maskRequired: false
            } as any
          }
        />
      );

      expect(screen.getByTitle('class-zone')).toBeInTheDocument();
      expect(screen.getByTitle('mask-not-required')).toBeInTheDocument();
      expect(screen.getByTitle('passport-not-required')).toBeInTheDocument();
    });
  });
});
