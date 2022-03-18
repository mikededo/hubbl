import { act, fireEvent, render, screen } from '@testing-library/react';

import Base from './Base';

describe('<Base />', () => {
  it('should render properly', () => {
    const { container } = render(<Base title="Modal title" />);

    expect(container).toBeInTheDocument();
  });

  describe('open', () => {
    it('shows the modal if open', () => {
      render(<Base title="Modal title" open />);

      expect(screen.getByText('Modal title')).toBeInTheDocument();
    });
  });

  describe('onClose', () => {
    it('should all onClose on clicking away', async () => {
      const onCloseSpy = jest.fn();

      render(<Base title="Modal title" onClose={onCloseSpy} open />);
      await act(async () => {
        const element = screen.getByRole('dialog').parentElement as HTMLElement;

        fireEvent.mouseDown(element);
        fireEvent.mouseUp(element);
        element.click();
      });

      expect(onCloseSpy).toHaveBeenCalledTimes(1);
    });
  });
});
