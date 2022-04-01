import { AppPalette } from '@hubbl/shared/types';
import { act, screen, fireEvent, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import EventTypeDialog from './EventTypeDialog';

describe('<EventTypeDialog />', () => {
  describe('open', () => {
    it('should not render if not open', () => {
      render(<EventTypeDialog title="Create event type" open={false} />);

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('should render if open', () => {
      render(<EventTypeDialog title="Create event type" open />);

      expect(screen.queryByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('Create event type')).toBeInTheDocument();
    });

    it('should call onClose if close button pressed', () => {
      const onCloseSpy = jest.fn();

      render(
        <EventTypeDialog title="Create event type" onClose={onCloseSpy} open />
      );
      fireEvent.click(screen.getByTitle('close-dialog'));

      expect(onCloseSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('form', () => {
    it('should render the event type form', () => {
      render(<EventTypeDialog title="Create event type" open />);

      expect(screen.getByText('Event type name')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('New name')).toBeInTheDocument();
      expect(screen.getByText('Description')).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText('New event type description')
      ).toBeInTheDocument();
      expect(screen.getByText('Event type color')).toBeInTheDocument();
      Object.values(AppPalette).forEach((color) => {
        expect(screen.getByTitle(color)).toBeInTheDocument();
      });
      expect(screen.getByText('Save')).toBeInTheDocument();
    });

    it('should render with the default values', async () => {
      const defaultValues = {
        name: 'Event type name',
        description: 'Description',
        color: AppPalette.EMERALD
      };

      await act(async () => {
        render(
          <EventTypeDialog
            title="Create event type"
            defaultValues={defaultValues}
            open
          />
        );
      });

      expect(screen.getByPlaceholderText('New name')).toHaveValue(
        defaultValues.name
      );
      expect(
        screen.getByPlaceholderText('New event type description')
      ).toHaveValue(defaultValues.description);
      expect(screen.getByTitle(defaultValues.color)).toHaveAttribute(
        'aria-selected',
        'true'
      );
    });

    it('should call onSubmit if all fields are valid', async () => {
      const onSubmitSpy = jest.fn();
      render(
        <EventTypeDialog
          title="Create event type"
          onSubmit={onSubmitSpy}
          open
        />
      );

      await act(async () => {
        fireEvent.input(screen.getByPlaceholderText('New name'), {
          target: { name: 'name', value: 'Name' }
        });
        fireEvent.input(
          screen.getByPlaceholderText('New event type description'),
          {
            target: { name: 'description', value: 'Description' }
          }
        );
      });
      await act(async () => {
        userEvent.click(screen.getByTitle(AppPalette.PEARL));
      });
      await act(async () => {
        fireEvent.submit(screen.getByText('Save'));
      });

      expect(onSubmitSpy).toHaveBeenCalledTimes(1);
      expect(onSubmitSpy).toHaveBeenCalledWith({
        name: 'Name',
        description: 'Description',
        color: AppPalette.PEARL
      });
    });
  });
});
