import { Gender } from '@hubbl/shared/types';
import { act, fireEvent, render, screen } from '@testing-library/react';

import SettingsUserInfo from './SettingsUserInfo';

describe('<SettingsUserInfo />', () => {
  it('should render properly', () => {
    const { container } = render(<SettingsUserInfo />);
    expect(container).toBeInTheDocument();
  });

  it('should render all the fields', () => {
    render(<SettingsUserInfo />);

    expect(screen.getByPlaceholderText('John')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Doe')).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('john.doe@domain.com')
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Repeat the email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('000 000 000')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Other')).toBeInTheDocument();
    expect(screen.getByText('Save')).toBeInTheDocument();
  });

  describe('onSubmit', () => {
    it('should call onSubmit with all the data', async () => {
      const onSubmitSpy = jest.fn();

      await act(async () => {
        render(<SettingsUserInfo onSubmit={onSubmitSpy} />);
      });

      await act(async () => {
        fireEvent.input(screen.getByPlaceholderText('John'), {
          target: { name: 'firstName', value: 'FirstName' }
        });
        fireEvent.input(screen.getByPlaceholderText('Doe'), {
          target: { name: 'lastName', value: 'LastName' }
        });
        fireEvent.input(screen.getByPlaceholderText('john.doe@domain.com'), {
          target: { name: 'email', value: 'email@domain.com' }
        });
        fireEvent.input(screen.getByPlaceholderText('Repeat the email'), {
          target: { name: 'emailConfirmation', value: 'email@domain.com' }
        });
        fireEvent.input(screen.getByPlaceholderText('000 000 000'), {
          target: { name: 'phone', value: '000 000 000' }
        });
        fireEvent.mouseDown(screen.getByRole('button', { name: 'Other' }));
      });
      await act(async () => {
        fireEvent.click(screen.getByRole('option', { name: 'Woman' }));
      });
      await act(async () => {
        fireEvent.submit(screen.getByTitle('user-info-submit'));
      });

      expect(onSubmitSpy).toHaveBeenCalledTimes(1);
      expect(onSubmitSpy).toHaveBeenCalledWith({
        firstName: 'FirstName',
        lastName: 'LastName',
        email: 'email@domain.com',
        phone: '000 000 000',
        gender: Gender.WOMAN
      });
    });

    it('should not call onSubmit if not given', async () => {
      const onSubmitSpy = jest.fn();

      await act(async () => {
        render(
          <SettingsUserInfo
            defaultValues={{
              firstName: 'FirstName',
              lastName: 'LastName',
              email: 'email@domain.com',
              gender: Gender.OTHER,
              phone: '000 0000 000'
            }}
          />
        );
      });
      await act(async () => {
        fireEvent.submit(screen.getByText('Save'));
      });

      expect(onSubmitSpy).not.toHaveBeenCalled();
    });
  });

  describe('defaultVales', () => {
    it('should render with the defaultValues given', async () => {
      const onSubmitSpy = jest.fn();

      await act(async () => {
        render(
          <SettingsUserInfo
            defaultValues={{
              firstName: 'FirstName',
              lastName: 'LastName',
              email: 'email@domain.com',
              gender: Gender.WOMAN,
              phone: '111 111 111'
            }}
            onSubmit={onSubmitSpy}
          />
        );
      });

      expect(screen.getByDisplayValue('FirstName')).toBeInTheDocument();
      expect(screen.getByDisplayValue('LastName')).toBeInTheDocument();
      expect(screen.getAllByDisplayValue('email@domain.com').length).toBe(2);
      expect(screen.getByDisplayValue('111 111 111')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Woman' })).toBeInTheDocument();
    });
  });
});
