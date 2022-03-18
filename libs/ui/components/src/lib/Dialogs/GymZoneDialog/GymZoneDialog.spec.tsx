import { act } from 'react-dom/test-utils';

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { GymZoneFormFields } from '../types';
import GymZoneDialog from './GymZoneDialog';

describe('<GymZoneDialog />', () => {
  describe('open', () => {
    it('should not render if not open', () => {
      render(<GymZoneDialog title="Create gym zone" open={false} />);

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('should render if open', () => {
      render(<GymZoneDialog title="Create gym zone" open />);

      expect(screen.queryByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('Create gym zone')).toBeInTheDocument();
    });
  });

  describe('form', () => {
    it('should render the gym zone form', async () => {
      await act(async () => {
        render(<GymZoneDialog title="Create gym zone" open />);
      });

      expect(screen.getByText('Gym zone name')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('New name')).toBeInTheDocument();
      expect(screen.getByText('Description')).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText('New gym zone description')
      ).toBeInTheDocument();
      expect(screen.getByText('Class zone')).toBeInTheDocument();
      expect(screen.getByTitle('gym-zone-class-type')).toBeInTheDocument();
      expect(screen.getByText('Mask required')).toBeInTheDocument();
      expect(screen.getByTitle('gym-zone-mask-required')).toBeInTheDocument();
      expect(screen.getByText('Covid passport')).toBeInTheDocument();
      expect(screen.getByTitle('gym-zone-covid-passport')).toBeInTheDocument();
      expect(screen.getByText('Capacity')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('200')).toBeInTheDocument();
      expect(screen.getByText('Open time')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('09:00')).toBeInTheDocument();
      expect(screen.getByText('Close time')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('23:00')).toBeInTheDocument();
    });

    it('should render with the default values', async () => {
      const defaultValues: GymZoneFormFields = {
        name: 'Name',
        description: 'Gym zone description',
        isClassType: true,
        maskRequired: false,
        covidPassport: false,
        capacity: 150,
        openTime: '09:00',
        closeTime: '23:00'
      };

      await act(async () => {
        render(
          <GymZoneDialog
            title="Create gym zone"
            defaultValues={defaultValues}
            open
          />
        );
      });

      expect(screen.getByPlaceholderText('New name')).toHaveValue(
        defaultValues.name
      );
      expect(
        screen.getByPlaceholderText('New gym zone description')
      ).toHaveValue(defaultValues.description);
      expect(screen.getByTitle('gym-zone-class-type').firstChild).toBeChecked();
      expect(
        screen.getByTitle('gym-zone-mask-required').firstChild
      ).not.toBeChecked();
      expect(
        screen.getByTitle('gym-zone-covid-passport').firstChild
      ).not.toBeChecked();
      expect(screen.getByPlaceholderText('09:00')).toHaveValue(
        defaultValues.openTime
      );
      expect(screen.getByPlaceholderText('23:00')).toHaveValue(
        defaultValues.closeTime
      );
      expect(screen.getByPlaceholderText('200')).toHaveValue(
        defaultValues.capacity
      );
    });

    it('should call onSubmit if all fields are valid', async () => {
      const onSubmitSpy = jest.fn();

      await act(async () => {
        render(
          <GymZoneDialog title="Create gym zone" onSubmit={onSubmitSpy} open />
        );
      });

      await act(async () => {
        fireEvent.input(screen.getByPlaceholderText('New name'), {
          target: { name: 'name', value: 'Name' }
        });
        fireEvent.input(
          screen.getByPlaceholderText('New gym zone description'),
          {
            target: { name: 'description', value: 'Gym description' }
          }
        );
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
