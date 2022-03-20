import { fireEvent, render, screen } from '@testing-library/react';

import DashboardVirtualGym from './DashboardVirtualGym';

describe('<DashboardVirtualGym />', () => {
  const virtualGym = {
    id: 10,
    name: 'Name',
    description: 'Description',
    openTime: '09:00:00',
    closeTime: '21:00:00',
    location: 'Location'
  };

  it('should render properly', () => {
    const { container } = render(
      <DashboardVirtualGym virtualGym={virtualGym as any} />
    );

    expect(container).toBeInTheDocument();
  });

  it('should render the gym fields', () => {
    render(<DashboardVirtualGym virtualGym={virtualGym as any} />);

    expect(screen.getByText(virtualGym.name.toUpperCase())).toBeInTheDocument();
    expect(screen.getByText(virtualGym.description)).toBeInTheDocument();
    expect(
      screen.getByText(`${virtualGym.openTime} - ${virtualGym.closeTime}`)
    ).toBeInTheDocument();
    expect(screen.getByText(virtualGym.location)).toBeInTheDocument();
  });

  describe('onClick', () => {
    it('should call onClick if passed', () => {
      const onClickSpy = jest.fn();
      render(
        <DashboardVirtualGym
          virtualGym={virtualGym as any}
          onClick={onClickSpy}
        />
      );

      fireEvent.click(screen.getByRole('button'));

      expect(onClickSpy).toHaveBeenCalledTimes(1);
    });

    it('should not call onClick if not passed', () => {
      const onClickSpy = jest.fn();
      render(<DashboardVirtualGym virtualGym={virtualGym as any} />);

      fireEvent.click(screen.getByRole('button'));

      expect(onClickSpy).not.toHaveBeenCalled();
    });
  });
});
