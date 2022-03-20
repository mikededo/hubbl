import { fireEvent, render, screen } from '@testing-library/react';

import DashboardGymZone from './DashboardGymZone';

describe('<DashboardGymZone />', () => {
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
    const { container } = render(<DashboardGymZone gymZone={gymZone as any} />);

    expect(container).toBeInTheDocument();
  });

  describe('gymZone', () => {
    it('should render the gym fields', () => {
      render(<DashboardGymZone gymZone={gymZone as any} />);

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
        <DashboardGymZone
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

  describe('onClick', () => {
    it('should call onClick if passed', () => {
      const onClickSpy = jest.fn();
      render(
        <DashboardGymZone gymZone={gymZone as any} onClick={onClickSpy} />
      );

      fireEvent.click(screen.getByRole('button'));

      expect(onClickSpy).toHaveBeenCalledTimes(1);
    });

    it('should not call onClick if not passed', () => {
      const onClickSpy = jest.fn();
      render(<DashboardGymZone gymZone={gymZone as any} />);

      fireEvent.click(screen.getByRole('button'));

      expect(onClickSpy).not.toHaveBeenCalled();
    });
  });
});
