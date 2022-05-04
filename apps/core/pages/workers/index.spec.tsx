import * as swr from 'swr';

import * as ctx from '@hubbl/data-access/contexts';
import { Gender } from '@hubbl/shared/types';
import { createTheme, ThemeProvider } from '@mui/material';
import { act, fireEvent, render, screen } from '@testing-library/react';

import Workers from './index';

jest.mock('@hubbl/data-access/api');
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
  createClients: false,
  updateClients: false,
  deleteClients: false,
  createTags: false,
  updateTags: false,
  deleteTags: false,
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

const workers = Array(15)
  .fill(undefined)
  .map((_, i) => ({
    id: i,
    firstName: `Worker-${i}`,
    lastName: `Test-${i}`,
    email: `worker-${i}@test.com`,
    password: `${i}`.repeat(9),
    phone: `${i}`.repeat(9),
    gender: Gender[i % 2 === 0 ? 'WOMAN' : 'OTHER'],
    ...permissions
  }));

const workersTwo = Array(15)
  .fill(undefined)
  .map((_, i) => ({
    id: i,
    firstName: `Worker-Two-${i}`,
    lastName: `Test-${i}`,
    email: `worker-${i}@test.com`,
    password: `${i}`.repeat(9),
    phone: `${i}`.repeat(9),
    gender: Gender[i % 2 === 0 ? 'WOMAN' : 'OTHER'],
    ...permissions
  }));

describe('Workers page', () => {
  const mutateSpy = jest.fn();
  const swrSpy = jest.spyOn(swr, 'default');

  const fetcher = jest.fn();
  const poster = jest.fn();
  const putter = jest.fn();

  const onError = jest.fn();
  const onSuccess = jest.fn();

  beforeEach(() => {
    jest.resetAllMocks();

    (ctx.useAppContext as jest.Mock).mockReturnValue({
      token: { parsed: {} },
      user: { gym: { id: 1, code: 'AABBCCDD' } },
      todayEvents: [],
      API: { fetcher, poster, putter }
    });
    (ctx.useToastContext as jest.Mock).mockReturnValue({
      onError,
      onSuccess
    });
    swrSpy.mockImplementation((key) => {
      if (key === '/persons/workers?skip=0') {
        return { data: workers, mutate: mutateSpy } as any;
      } else if (key === '/persons/workers?skip=15') {
        return { data: workersTwo } as any;
      }

      return {} as any;
    });
  });

  it('should not call fetcher if token is null', async () => {
    (ctx.useAppContext as jest.Mock).mockClear().mockReturnValue({
      token: { parsed: undefined },
      todayEvents: [],
      API: { fetcher }
    });
    swrSpy.mockImplementation(() => ({} as any));

    await act(async () => {
      render(<Workers />);
    });

    expect(fetcher).not.toHaveBeenCalled();
  });

  it('should have the getLayout prop defined', () => {
    expect(Workers.getLayout).toBeDefined();

    const { container } = render(
      <ThemeProvider theme={createTheme()}>
        {Workers.getLayout(<div />)}
      </ThemeProvider>
    );
    expect(container).toBeInTheDocument();
  });

  it('should render properly', async () => {
    swrSpy.mockImplementation(() => ({ error: 'Error thrown' } as any));
    await act(async () => {
      render(<Workers />);
    });

    expect(onError).toHaveBeenCalledTimes(1);
    expect(onError).toHaveBeenCalledWith('Error thrown');
  });

  it('should call onError if fetch fails', async () => {
    await act(async () => {
      render(<Workers />);
    });

    // Pagination
    expect(screen.getByLabelText('prev-page')).toBeInTheDocument();
    expect(screen.getByLabelText('next-page')).toBeInTheDocument();
  });

  it('it should iterate through the pages', async () => {
    await act(async () => {
      render(<Workers />);
    });
    workers.forEach((worker) => {
      expect(screen.getByText(worker.firstName)).toBeInTheDocument();
    });

    await act(async () => {
      fireEvent.click(screen.getByLabelText('next-page'));
    });
    workersTwo.forEach((worker) => {
      expect(screen.getByText(worker.firstName)).toBeInTheDocument();
    });

    await act(async () => {
      fireEvent.click(screen.getByLabelText('prev-page'));
    });
    workers.forEach((worker) => {
      expect(screen.getByText(worker.firstName)).toBeInTheDocument();
    });
  });

  it('should display worker information', async () => {
    await act(async () => {
      render(<Workers />);
    });
    await act(async () => {
      fireEvent.click(screen.getByText(workers[0].firstName));
    });

    // There should be the name of the worker twice
    const firstFullName = `${workers[0].firstName} ${workers[0].lastName}`;
    expect(screen.getByText(firstFullName)).toBeInTheDocument();

    // If clicking the same worker, it should keep displaying the same owner
    await act(async () => {
      fireEvent.click(screen.getByText(workers[0].firstName));
    });
    expect(screen.getByText(firstFullName)).toBeInTheDocument();

    // If another worker is clicked, it should change the displayed worker
    await act(async () => {
      fireEvent.click(screen.getByText(workers[1].firstName));
    });
    const secondFullName = `${workers[1].firstName} ${workers[1].lastName}`;
    expect(screen.queryByText(firstFullName)).not.toBeInTheDocument();
    expect(screen.getByText(secondFullName)).toBeInTheDocument();

    // Finally it should remove the selected worker
    await act(async () => {
      fireEvent.click(screen.getByLabelText('unselect-worker'));
    });
    expect(screen.queryByText(firstFullName)).not.toBeInTheDocument();
    expect(screen.queryByText(secondFullName)).not.toBeInTheDocument();
  });

  describe('post worker', () => {
    const fillWorker = async () => {
      await act(async () => {
        fireEvent.click(screen.getByTitle('add-worker'));
      });
      await act(async () => {
        fireEvent.input(screen.getByPlaceholderText('John'), {
          target: { name: 'firstName', value: 'Test' }
        });
        fireEvent.input(screen.getByPlaceholderText('Doe'), {
          target: { name: 'lastName', value: 'Worker' }
        });
        fireEvent.input(screen.getByPlaceholderText('john@doe.com'), {
          target: { name: 'email', value: 'test@worker.com' }
        });
        fireEvent.input(screen.getByPlaceholderText('000 000 000'), {
          target: { name: 'phone', value: '123 123 123' }
        });
      });

      await act(async () => {
        fireEvent.click(screen.getByText('Save'));
      });
    };

    const createCommonChecks = () => {
      expect(poster).toHaveBeenCalledTimes(1);
      expect(poster).toHaveBeenCalledWith('/persons/worker', {
        firstName: 'Test',
        lastName: 'Worker',
        gender: Gender.OTHER,
        email: 'test@worker.com',
        phone: '123 123 123',
        password: 'AABBCCDD', // It has to use the gym code
        gym: 1,
        ...permissions
      });
      expect(onSuccess).toHaveBeenCalledWith('Worker created!');
    };

    it('should post a new worker and not call mutate', async () => {
      poster.mockResolvedValue({ worker: { ...workers[0], id: 10 } });

      await act(async () => {
        render(<Workers />);
      });
      await fillWorker();

      createCommonChecks();
      // It should not call mutate as workers length === 15
      expect(mutateSpy).not.toHaveBeenCalledTimes(1);
    });

    it('should post a new worker and call mutate', async () => {
      swrSpy.mockImplementation((key) => {
        if (key === '/persons/workers?skip=0') {
          return { data: [], mutate: mutateSpy } as any;
        } else if (key === '/persons/workers?skip=15') {
          return { data: workersTwo } as any;
        }

        return {} as any;
      });
      poster.mockResolvedValue({ worker: { ...workers[0], id: 10 } });

      await act(async () => {
        render(<Workers />);
      });
      await fillWorker();

      createCommonChecks();
      // It should not call mutate as workers length === 15
      expect(mutateSpy).toHaveBeenCalledTimes(1);
      expect(mutateSpy).toHaveBeenCalledWith(
        [{ ...workers[0], id: 10 }],
        false
      );
    });

    it('should call onError on poster error', async () => {
      poster.mockRejectedValue('Error thrown');

      await act(async () => {
        render(<Workers />);
      });
      await fillWorker();

      expect(poster).toHaveBeenCalledTimes(1);
      expect(mutateSpy).not.toHaveBeenCalled();
      expect(onError).toHaveBeenCalledTimes(1);
      expect(onError).toHaveBeenCalledWith('Error thrown');
    });
  });

  describe('put worker', () => {
    const fillWorker = async () => {
      // Select a worker
      await act(async () => {
        fireEvent.click(screen.getByText(workers[0].firstName));
      });
      // Then click the edit button
      await act(async () => {
        fireEvent.click(screen.getByLabelText('edit-worker'));
      });
      await act(async () => {
        fireEvent.input(screen.getByPlaceholderText('John'), {
          target: { name: 'firstName', value: 'Updated' }
        });
      });

      await act(async () => {
        fireEvent.click(screen.getByText('Save'));
      });
    };

    it('should update a worker', async () => {
      await act(async () => {
        render(<Workers />);
      });
      await fillWorker();

      expect(putter).toHaveBeenCalledTimes(1);
      expect(putter).toHaveBeenCalledWith('/persons/worker', {
        id: workers[0].id,
        firstName: 'Updated',
        lastName: workers[0].lastName,
        gender: workers[0].gender,
        email: workers[0].email,
        password: workers[0].password,
        phone: workers[0].phone,
        gym: 1,
        ...permissions
      });
      expect(mutateSpy).toHaveBeenCalledTimes(1);
      expect(onSuccess).toHaveBeenCalledTimes(1);
      expect(onSuccess).toHaveBeenCalledWith('Worker updated successfully!');
    });

    it('should call onError on putter error', async () => {
      putter.mockRejectedValue({
        response: { data: { message: 'Error thrown' } }
      });

      await act(async () => {
        render(<Workers />);
      });
      await fillWorker();

      expect(putter).toHaveBeenCalledTimes(1);
      expect(mutateSpy).not.toHaveBeenCalled();
      expect(onError).toHaveBeenCalledTimes(1);
      expect(onError).toHaveBeenCalledWith('Error thrown');
    });
  });
});
