import * as ctx from '@hubbl/data-access/contexts';
import { Gender } from '@hubbl/shared/types';
import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ClientDialog from './ClientDialog';

jest.mock('@hubbl/data-access/contexts', () => {
  const actual = jest.requireActual('@hubbl/data-access/contexts');
  const app = jest.fn();
  const toast = jest.fn();

  return {
    ...actual,
    useAppContext: app,
    useToastContext: toast
  };
});

describe('<ClientDialog />', () => {
  const fetcher = jest.fn();
  const onError = jest.fn();

  beforeEach(() => {
    jest.resetAllMocks();

    (ctx.useAppContext as jest.Mock).mockReturnValue({
      token: { parsed: {} },
      API: { fetcher }
    } as any);
    (ctx.useToastContext as jest.Mock).mockReturnValue({ onError });
  });

  describe('open', () => {
    it('should not render if not open', () => {
      render(<ClientDialog title="Create a client" />);

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('should render if open', () => {
      render(<ClientDialog title="Create a client" open />);

      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('Create a client')).toBeInTheDocument();
    });
  });

  describe('form', () => {
    it('should render the client form', async () => {
      await act(async () => {
        render(<ClientDialog title="Create client" open />);
      });

      expect(screen.getByText('First name')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('John')).toBeInTheDocument();
      expect(screen.getByText('Last name')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Doe')).toBeInTheDocument();
      expect(screen.getByText('Email')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('john@doe.com')).toBeInTheDocument();
      expect(screen.getByText('Gender')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Other')).toBeInTheDocument();
    });

    it('should render with the default values', async () => {
      const defaultValues = {
        firstName: 'Test',
        lastName: 'Client',
        email: 'test@client.com',
        gender: Gender.WOMAN,
        covidPassport: false
      };

      await act(async () => {
        render(
          <ClientDialog
            title="Create a client"
            defaultValues={defaultValues}
            open
          />
        );
      });

      expect(screen.getByPlaceholderText('John')).toHaveValue(
        defaultValues.firstName
      );
      expect(screen.getByPlaceholderText('Doe')).toHaveValue(
        defaultValues.lastName
      );
      expect(screen.getByPlaceholderText('john@doe.com')).toHaveValue(
        defaultValues.email
      );
      expect(screen.getByPlaceholderText('Other')).toHaveValue(
        defaultValues.gender
      );
      expect(
        screen.getByTitle('client-covid-passport').firstChild
      ).not.toBeChecked();
    });

    it('should call onSubmit if all fields are valid', async () => {
      const onSubmitSpy = jest.fn();

      await act(async () => {
        render(
          <ClientDialog title="Create a client" onSubmit={onSubmitSpy} open />
        );
      });
      await act(async () => {
        fireEvent.input(screen.getByPlaceholderText('John'), {
          target: { name: 'firstName', value: 'Test' }
        });
        fireEvent.input(screen.getByPlaceholderText('Doe'), {
          target: { name: 'lastName', value: 'Doe' }
        });
        fireEvent.input(screen.getByPlaceholderText('john@doe.com'), {
          target: { name: 'email', value: 'test@client.com' }
        });
      });
      await act(async () => {
        userEvent.click(screen.getByText('Save'));
      });

      expect(onSubmitSpy).toHaveBeenCalledTimes(1);
      expect(onSubmitSpy).toHaveBeenCalledWith({
        firstName: 'Test',
        lastName: 'Doe',
        email: 'test@client.com',
        gender: Gender.OTHER,
        covidPassport: true
      });
    });
  });

  describe('onDelete', () => {
    it('should call onDelete', async () => {
      const onDeleteSpy = jest.fn();

      await act(async () => {
        render(
          <ClientDialog title="Edit a client" onDelete={onDeleteSpy} open />
        );
      });
      fireEvent.click(screen.getByText('Delete'));

      expect(screen.getByText('Delete')).toBeInTheDocument();
      expect(onDeleteSpy).toHaveBeenCalledTimes(1);
    });
  });
});
