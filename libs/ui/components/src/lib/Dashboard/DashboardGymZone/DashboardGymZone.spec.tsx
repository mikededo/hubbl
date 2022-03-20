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
