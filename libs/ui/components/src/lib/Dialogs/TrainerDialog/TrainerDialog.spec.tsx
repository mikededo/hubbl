import * as swr from 'swr';

import * as ctx from '@hubbl/data-access/contexts';
import { Gender } from '@hubbl/shared/types';
import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import TrainerDialog from './TrainerDialog';

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

describe('<TrainerDialog />', () => {
  const fetcher = jest.fn();
  const swrSpy = jest.spyOn(swr, 'default');
  const onError = jest.fn();

  const response = {
    data: [
      { id: 1, name: 'One' },
      { id: 2, name: 'Two' }
    ]
  };

  beforeEach(() => {
    jest.resetAllMocks();

    (ctx.useAppContext as jest.Mock).mockReturnValue({
      token: { parsed: {} },
      API: { fetcher }
    } as any);
    (ctx.useToastContext as jest.Mock).mockReturnValue({ onError });
    swrSpy.mockImplementation(() => response as any);
  });

  describe('open', () => {
    it('should not render if not open', () => {
      render(<TrainerDialog title="Create a trainer" />);

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('should render if open', () => {
      render(<TrainerDialog title="Create a trainer" open />);

      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('Create a trainer')).toBeInTheDocument();
       expect(screen.queryByText('Save')).not.toBeInTheDocument();
    });
  });

  describe('form', () => {
    it('should render the trainer form', async () => {
      await act(async () => {
        render(<TrainerDialog title="Create trainer" open />);
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
        lastName: 'Trainer',
        email: 'test@trainer.com',
        gender: Gender.WOMAN
      };

      await act(async () => {
        render(
          <TrainerDialog
            title="Create a trainer"
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
    });

    it('should call onSubmit if all fields are valid', async () => {
      const onSubmitSpy = jest.fn();

      await act(async () => {
        render(
          <TrainerDialog title="Create a trainer" onSubmit={onSubmitSpy} open />
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
          target: { name: 'email', value: 'test@trainer.com' }
        });
      });
      await act(async () => {
        userEvent.click(screen.getByText('Save'));
      });

      expect(onSubmitSpy).toHaveBeenCalledTimes(1);
      expect(onSubmitSpy).toHaveBeenCalledWith({
        firstName: 'Test',
        lastName: 'Doe',
        email: 'test@trainer.com',
        gender: Gender.OTHER,
        tags: []
      });
    });
  });

  describe('onDelete', () => {
    it('should call onDelete', async () => {
      const onDeleteSpy = jest.fn();

      await act(async () => {
        render(
          <TrainerDialog title="Edit a trainer" onDelete={onDeleteSpy} open />
        );
      });
      fireEvent.click(screen.getByText('Delete'));

      expect(screen.getByText('Delete')).toBeInTheDocument();
      expect(onDeleteSpy).toHaveBeenCalledTimes(1);
    });
  });

  it('should call onError', async () => {
    swrSpy
      .mockClear()
      .mockImplementation(
        () => ({ data: undefined, error: 'An error' } as any)
      );

    await act(async () => {
      render(<TrainerDialog title="Create a trainer" open />);
    });

    expect(onError).toHaveBeenCalledWith('An error occurred.');
  });
});
