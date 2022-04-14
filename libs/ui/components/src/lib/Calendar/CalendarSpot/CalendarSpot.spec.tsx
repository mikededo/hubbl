import { screen, fireEvent, render } from '@testing-library/react';

import CalendarSpot from './CalendarSpot';

describe('<CalendarSpot />', () => {
  it('should render properly', () => {
    const { container } = render(<CalendarSpot />);

    expect(container).toBeInTheDocument();
  });

  describe('onClick', () => {
    it('should call onClick if spot is clicked', () => {
      const onClickSpy = jest.fn();

      render(<CalendarSpot onClick={onClickSpy} />);
      fireEvent.click(screen.getByTestId('calendar-spot'));

      expect(onClickSpy).toHaveBeenCalledTimes(1);
    });
  });
});
