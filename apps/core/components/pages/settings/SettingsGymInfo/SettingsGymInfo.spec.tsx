import { AppPalette } from '@hubbl/shared/types';
import { act, fireEvent, render, screen } from '@testing-library/react';
import SettingsGymInfo from './SettingsGymInfo';

describe('<SettingsGymInfo />', () => {
  it('should render properly', () => {
    const { container } = render(<SettingsGymInfo />);

    expect(container).toBeInTheDocument();
  });

  it('should render all fields', () => {
    render(<SettingsGymInfo />);

    // Header
    const header = screen.getByText('Gym information');
    expect(header).toBeInTheDocument();
    expect(header.tagName.toLowerCase()).toBe('h6');
    // Gym name input
    expect(screen.getByText('Gym name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Your gym's name")).toBeInTheDocument();
    // Gym email input
    expect(screen.getByText('Gym email')).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('gym.name@info.com')
    ).toBeInTheDocument();
    // Gym phone input
    expect(screen.getByText('Gym phone')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('000 000 000')).toBeInTheDocument();
    // Gym color picker
    expect(screen.getByText('Gym color')).toBeInTheDocument();
    // Submit button
    expect(screen.getByRole('button', { name: 'Save' }));
  });

  describe('defaultValues', () => {
    it('should render with the defaultValues', async () => {
      await act(async () => {
        render(
          <SettingsGymInfo
            defaultValues={{
              name: 'GymName',
              email: 'gymname@domain.com',
              phone: '111 222 333',
              color: AppPalette.EMERALD
            }}
          />
        );
      });

      // Gym name input
      expect(screen.getByPlaceholderText("Your gym's name")).toHaveValue(
        'GymName'
      );
      // Gym email input
      expect(screen.getByPlaceholderText('gym.name@info.com')).toHaveValue(
        'gymname@domain.com'
      );
      // Gym phone input
      expect(screen.getByPlaceholderText('000 000 000')).toHaveValue(
        '111 222 333'
      );
      // Gym color picker
      const selected = screen
        .getAllByRole('option')
        .filter((e) => e.getAttribute('aria-selected') === 'true');

      expect(selected.length).toBe(1);
      expect(selected[0]).toHaveAttribute('title', AppPalette.EMERALD);
    });
  });

  describe('onSubmit', () => {
    it('should call onSubmit if all fields are valid', async () => {
      const onSubmitSpy = jest.fn();

      await act(async () => {
        render(<SettingsGymInfo onSubmit={onSubmitSpy} />);
      });

      await act(async () => {
        fireEvent.input(screen.getByPlaceholderText("Your gym's name"), {
          target: { name: 'name', value: 'GymName' }
        });
        fireEvent.input(screen.getByPlaceholderText('gym.name@info.com'), {
          target: { name: 'email', value: 'gym.name@domain.com' }
        });
        fireEvent.input(screen.getByPlaceholderText('000 000 000'), {
          target: { name: 'phone', value: '111 222 333' }
        });
      });
      await act(async () => {
        fireEvent.submit(screen.getByTitle('gym-info-submit'));
      });

      expect(onSubmitSpy).toHaveBeenCalledTimes(1);
      expect(onSubmitSpy).toHaveBeenCalledWith({
        name: 'GymName',
        email: 'gym.name@domain.com',
        phone: '111 222 333',
        color: AppPalette.BLUE
      });
    });

    it('should not call onSubmit if all fields are valid', async () => {
      const onSubmitSpy = jest.fn();

      await act(async () => {
        render(<SettingsGymInfo onSubmit={onSubmitSpy} />);
      });
      await act(async () => {
        fireEvent.submit(screen.getByTitle('gym-info-submit'));
      });

      expect(onSubmitSpy).not.toHaveBeenCalled();
    });
  });
});
