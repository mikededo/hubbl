import * as ctx from '@hubbl/data-access/contexts';
import { Gender } from '@hubbl/shared/types';
import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import WorkerDialog from './WorkerDialog';

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

const permissions = {
  updateVirtualGyms: false,
  createGymZones: false,
  updateGymZones: false,
  deleteGymZones: false,
  createTrainers: false,
  updateTrainers: false,
  deleteTrainers: false,
  updateClients: false,
  deleteClients: false,
  createTags: false,
  updateTags: false,
  deleteTags: false,
  createClients: false,
  createEventTemplates: false,
  updateEventTemplates: false,
  deleteEventTemplates: false,
  createEventTypes: false,
  updateEventTypes: false,
  deleteEventTypes: false,
  createEvents: false,
  updateEvents: false,
  deleteEvents: false,
  updateEventAppointments: false,
  deleteEventAppointments: false,
  createEventAppointments: false,
  createCalendarAppointments: false,
  updateCalendarAppointments: false,
  deleteCalendarAppointments: false
};

describe('<WorkerDialog />', () => {
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
      render(<WorkerDialog title="Create a worker" code="AABBCCDD" />);

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('should render if open', () => {
      render(<WorkerDialog title="Create a worker" code="AABBCCDD" open />);

      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('Create a worker')).toBeInTheDocument();
      expect(
        screen.getByText(
          'The password of the worker will be the gym code, which is: AABBCCDD'
        )
      ).toBeInTheDocument();
      expect(screen.queryByText('Save')).not.toBeInTheDocument();
    });
  });

  describe('form', () => {
    it('should render the worker form', async () => {
      await act(async () => {
        render(<WorkerDialog title="Create worker" code="AABBCCDD" open />);
      });

      expect(screen.getByText('First name')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('John')).toBeInTheDocument();
      expect(screen.getByText('Last name')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Doe')).toBeInTheDocument();
      expect(screen.getByText('Email')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('john@doe.com')).toBeInTheDocument();
      expect(screen.getByText('Phone')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('000 000 000')).toBeInTheDocument();
      expect(screen.getByText('Gender')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Other')).toBeInTheDocument();
      expect(screen.getByText('Permissions')).toBeInTheDocument();
    });

    it('should render with the default values', async () => {
      const defaultValues = {
        firstName: 'Test',
        lastName: 'Worker',
        email: 'test@worker.com',
        phone: '123 123 123',
        gender: Gender.WOMAN,
        ...permissions
      };

      await act(async () => {
        render(
          <WorkerDialog
            title="Create a worker"
            code="AABBCCDD"
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
      expect(screen.getByPlaceholderText('000 000 000')).toHaveValue(
        defaultValues.phone
      );
      expect(screen.getByPlaceholderText('Other')).toHaveValue(
        defaultValues.gender
      );
      // Permissions are already checked in the other component
    });

    it('should call onSubmit if all fields are valid', async () => {
      const onSubmitSpy = jest.fn();

      await act(async () => {
        render(
          <WorkerDialog
            title="Create a worker"
            code="AABBCCDD"
            onSubmit={onSubmitSpy}
            open
          />
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
          target: { name: 'email', value: 'test@worker.com' }
        });
        fireEvent.input(screen.getByPlaceholderText('000 000 000'), {
          target: { name: 'phone', value: '123 123 123' }
        });
      });
      await act(async () => {
        userEvent.click(screen.getByText('Save'));
      });

      expect(onSubmitSpy).toHaveBeenCalledTimes(1);
      expect(onSubmitSpy).toHaveBeenCalledWith({
        firstName: 'Test',
        lastName: 'Doe',
        email: 'test@worker.com',
        phone: '123 123 123',
        gender: Gender.OTHER,
        ...permissions
      });
    });
  });

  describe('onDelete', () => {
    it('should call onDelete', async () => {
      const onDeleteSpy = jest.fn();

      await act(async () => {
        render(
          <WorkerDialog title="Edit a worker" onDelete={onDeleteSpy} open />
        );
      });
      fireEvent.click(screen.getByTitle('delete'));

      expect(screen.getByTitle('delete')).toBeInTheDocument();
      expect(onDeleteSpy).toHaveBeenCalledTimes(1);
    });
  });
});
