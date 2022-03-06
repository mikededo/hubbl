import { fireEvent, render, screen } from '@testing-library/react';
import { act } from 'react-dom/test-utils';

import SettingsPassword from './SettingsUserPassword';

describe('<SettingsPassword />', () => {
  it('should render properly', () => {
    const { container } = render(<SettingsPassword />);

    expect(container).toBeInTheDocument();
  });

  it('should change the visibility of the inputs', async () => {
    render(<SettingsPassword />);

    // Toggle first item
    expect(
      screen.getByPlaceholderText('At least 8 characters!')
    ).toHaveAttribute('type', 'password');
    await act(async () => {
      fireEvent.click(screen.getByLabelText('password visibility'));
    });
    expect(
      screen.getByPlaceholderText('At least 8 characters!')
    ).toHaveAttribute('type', 'text');

    // Toggle second item
    expect(screen.getByPlaceholderText('Repeat the password')).toHaveAttribute(
      'type',
      'password'
    );
    await act(async () => {
      fireEvent.click(
        screen.getByLabelText('confirmation password visibility')
      );
    });
    expect(screen.getByPlaceholderText('Repeat the password')).toHaveAttribute(
      'type',
      'text'
    );
  });

  describe('onSubmit', () => {
    it('should submit the password', async () => {
      const onSubmitSpy = jest.fn();

      await act(async () => {
        render(<SettingsPassword onSubmit={onSubmitSpy} />);
      });

      await act(async () => {
        fireEvent.input(screen.getByPlaceholderText('At least 8 characters!'), {
          target: { name: 'password', value: 'eightCharsPwd' }
        });
        fireEvent.input(screen.getByPlaceholderText('Repeat the password'), {
          target: { name: 'passwordConfirmation', value: 'eightCharsPwd' }
        });
      });
      await act(async () => {
        fireEvent.submit(screen.getByText('Update password'));
      });

      expect(onSubmitSpy).toHaveBeenCalledTimes(1);
      expect(onSubmitSpy).toHaveBeenCalledWith({ password: 'eightCharsPwd' });
    });
  });

  describe('loading', () => {
    it('should disable all fields and load the button', () => {
      render(<SettingsPassword loading />);

      expect(
        screen.getByPlaceholderText('At least 8 characters!')
      ).toBeDisabled();
      expect(screen.getByPlaceholderText('Repeat the password')).toBeDisabled();
      expect(screen.queryByText('Update password')).not.toBeInTheDocument();
    });
  });
});
