import { act, fireEvent, render, screen } from '@testing-library/react';

import CarouselGrid from './CarouselGrid';

const renderComponent = () =>
  render(
    <CarouselGrid header="Carousel" width={25}>
      <div>First</div>
      <div>Second</div>
      <div>Third</div>
      <div>Fourth</div>
      <div>Fifth</div>
      <div>Sixth</div>
    </CarouselGrid>
  );

describe('<CarouselGrid />', () => {
  it('should render properly', () => {
    const { container } = renderComponent();

    expect(container).toBeInTheDocument();
    expect(screen.getByText('Carousel')).toBeInTheDocument();

    // Find all children
    expect(screen.getByText('First')).toBeInTheDocument();
    expect(screen.getByText('Second')).toBeInTheDocument();
    expect(screen.getByText('Third')).toBeInTheDocument();
    expect(screen.getByText('Fourth')).toBeInTheDocument();
    expect(screen.getByText('Fifth')).toBeInTheDocument();
    expect(screen.getByText('Sixth')).toBeInTheDocument();
  });

  it('should iterate the carousel', async () => {
    renderComponent();

    const prev = screen.getByLabelText('carousel-prev');
    const next = screen.getByLabelText('carousel-next');

    expect(prev).toBeDisabled();
    expect(next).not.toBeDisabled();

    await act(async () => {
      fireEvent.click(next);
    });
    await act(async () => {
      fireEvent.click(next);
    });
    await act(async () => {
      fireEvent.click(next);
    });

    expect(prev).not.toBeDisabled();
    expect(next).toBeDisabled();

    await act(async () => {
      fireEvent.click(prev);
    });

    expect(prev).not.toBeDisabled();
    expect(next).not.toBeDisabled();
  });
});
