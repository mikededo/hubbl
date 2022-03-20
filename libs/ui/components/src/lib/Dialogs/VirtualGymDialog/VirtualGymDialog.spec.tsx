import { act } from 'react-dom/test-utils';

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { VirtualGymFormFields } from '../types';
import VirtualGymDialog from './VirtualGymDialog';

describe('<VirtualGymDialog />', () => {
  describe('open', () => {
    it('should not render if not open', () => {
      render(<VirtualGymDialog title="Create virtual gym" open={false} />);

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('should render if open', () => {
      render(<VirtualGymDialog title="Create virtual gym" open />);

      expect(screen.queryByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('Create virtual gym')).toBeInTheDocument();
    });
  });

  describe('form', () => {
    it('should render the virtual gym form', async () => {
      await act(async () => {
        render(<VirtualGymDialog title="Create virtual gym" open />);
      });

      expect(screen.getByText('Virtual gym name')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('New name')).toBeInTheDocument();
      expect(screen.getByText('Description')).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText('New virtual gym description')
      ).toBeInTheDocument();
      expect(screen.getByText('Location')).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText('Somewhere, There, 90')
      ).toBeInTheDocument();
      expect(screen.getByText('Phone')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('000 000 000')).toBeInTheDocument();
      expect(screen.getByText('Capacity')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('200')).toBeInTheDocument();
      expect(screen.getByText('Open time')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('09:00')).toBeInTheDocument();
      expect(screen.getByText('Open time')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('23:00')).toBeInTheDocument();
    });

    it('should render with the default values', async () => {
      const defaultValues: VirtualGymFormFields = {
        name: 'Name',
        description: 'Virtual gym description',
        location: 'Some Location, Number',
        phone: '111 222 333',
        capacity: 150,
        openTime: '09:00',
        closeTime: '23:00'
      };

      await act(async () => {
        render(
          <VirtualGymDialog
            title="Create virtual gym"
            defaultValues={defaultValues}
            open
          />
        );
      });

      expect(screen.getByPlaceholderText('New name')).toHaveValue(
        defaultValues.name
      );
      expect(
        screen.getByPlaceholderText('New virtual gym description')
      ).toHaveValue(defaultValues.description);
      expect(screen.getByPlaceholderText('Somewhere, There, 90')).toHaveValue(
        defaultValues.location
      );
      expect(screen.getByPlaceholderText('000 000 000')).toHaveValue(
        defaultValues.phone
      );
      expect(screen.getByPlaceholderText('200')).toHaveValue(
        defaultValues.capacity
      );
      expect(screen.getByPlaceholderText('09:00')).toHaveValue(
        defaultValues.openTime
      );
      expect(screen.getByPlaceholderText('23:00')).toHaveValue(
        defaultValues.closeTime
      );
    });

    it('should call onSubmit if all fields are valid', async () => {
      const onSubmitSpy = jest.fn();

      await act(async () => {
        render(
          <VirtualGymDialog
            title="Create virtual gym"
            onSubmit={onSubmitSpy}
            open
          />
        );
      });

      await act(async () => {
        fireEvent.input(screen.getByPlaceholderText('New name'), {
          target: { name: 'name', value: 'Name' }
        });
        fireEvent.input(
          screen.getByPlaceholderText('New virtual gym description'),
          {
            target: { name: 'description', value: 'Gym description' }
          }
        );
        fireEvent.input(screen.getByPlaceholderText('Somewhere, There, 90'), {
          target: { name: 'location', value: 'Some, Location, 90' }
        });
        fireEvent.input(screen.getByPlaceholderText('000 000 000'), {
          target: { name: 'phone', value: '111 222 333' }
        });
        fireEvent.input(screen.getByPlaceholderText('200'), {
          target: { name: 'capacity', value: '25' }
        });
        userEvent.type(screen.getByPlaceholderText('09:00'), '10:00');
        userEvent.type(screen.getByPlaceholderText('23:00'), '22:00');
      });
      await act(async () => {
        userEvent.click(screen.getByText('Save'));
      });

      await waitFor(() => {
        expect(onSubmitSpy).toHaveBeenCalledTimes(1);
      });
    });
  });
});
