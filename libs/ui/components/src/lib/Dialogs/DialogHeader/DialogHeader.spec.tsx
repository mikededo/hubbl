import { fireEvent, render, screen } from '@testing-library/react';

import DialogHeader from './DialogHeader';

describe('<DialogHeader />', () => {
  it('should render properly', () => {
    const { container } = render(<DialogHeader title="Header" />);

    expect(container).toBeInTheDocument();
  });

  describe('title', () => {
    it('should render the header', () => {
      render(<DialogHeader title="Header" />);

      expect(screen.getByText('Header')).toBeInTheDocument();
    });
  });

  describe('onClose', () => {
    it('should call onClose if button pressed', () => {
      const onCloseSpy = jest.fn();

      render(<DialogHeader title="Header" onClose={onCloseSpy} />);
      fireEvent.click(screen.getByTitle('close-dialog'));

      expect(onCloseSpy).toHaveBeenCalled();
    });

    it('should not render the button if onClick is not passed', () => {
      render(<DialogHeader title="Header" />);

      expect(screen.queryByTitle('close-dialog')).not.toBeInTheDocument();
    });
  });
});
