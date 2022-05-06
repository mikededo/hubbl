import * as swr from 'swr';

import * as ctx from '@hubbl/data-access/contexts';
import {
  AppContextValue,
  AppProvider,
  LoadingContext,
  ToastContext
} from '@hubbl/data-access/contexts';
import { TrainerDTO } from '@hubbl/shared/models/dto';
import { Gender } from '@hubbl/shared/types';
import { createTheme, ThemeProvider } from '@mui/material';
import {
  act,
  fireEvent,
  render,
  screen,
  waitForElementToBeRemoved
} from '@testing-library/react';

import DashboardTrainers from './DashboardTrainers';

jest.mock('@hubbl/data-access/contexts', () => {
  const actual = jest.requireActual('@hubbl/data-access/contexts');

  return { ...actual, useAppContext: jest.fn(), useToastContext: jest.fn() };
});
jest.mock('axios');

const response = [
  {
    id: 1,
    firstName: 'One',
    lastName: 'Trainer',
    gender: Gender.OTHER
  },
  {
    id: 2,
    firstName: 'Two',
    lastName: 'Trainer',
    gender: Gender.OTHER
  },
  {
    id: 3,
    firstName: 'Three',
    lastName: 'Trainer',
    gender: Gender.OTHER
  },
  {
    id: 4,
    firstName: 'Four',
    lastName: 'Trainer',
    gender: Gender.OTHER
  },
  {
    id: 5,
    firstName: 'Five',
    lastName: 'Trainer',
    gender: Gender.OTHER
  }
] as TrainerDTO<number>[];

const tags = Array(3)
  .fill(undefined)
  .map((_, i) => ({ id: i, name: `Tag-${i}` }));

const renderComponent = () =>
  render(
    <LoadingContext>
      <ThemeProvider theme={createTheme()}>
        <ToastContext>
          <AppProvider>
            <DashboardTrainers />
          </AppProvider>
        </ToastContext>
      </ThemeProvider>
    </LoadingContext>
  );

const fillTrainer = async () => {
  await act(async () => {
    fireEvent.click(screen.getByTitle('add-trainer'));
  });
  await act(async () => {
    fireEvent.input(screen.getByPlaceholderText('John'), {
      target: { name: 'firstName', value: 'Test' }
    });
    fireEvent.input(screen.getByPlaceholderText('Doe'), {
      target: { name: 'lastName', value: 'Trainer' }
    });
    fireEvent.input(screen.getByPlaceholderText('john@doe.com'), {
      target: { name: 'email', value: 'test@trainer.com' }
    });
  });

  await act(async () => {
    fireEvent.click(screen.getByText('Save'));
  });
};

describe('<DashboardTrainers />', () => {
  const fetcher = jest.fn();
  const poster = jest.fn();

  const onSuccess = jest.fn();
  const onError = jest.fn();

  beforeEach(() => {
    jest.resetAllMocks();

    (ctx.useAppContext as jest.Mock<AppContextValue>).mockReturnValue({
      token: {
        parsed: { id: 1, email: 'some@email.com', user: 'owner' },
        value: 'token'
      },
      helpers: { hasAccess: () => true },
      user: { firstName: 'Test', lastName: 'User', gym: { id: 1 } },
      API: { fetcher, poster }
    } as any);
    (ctx.useToastContext as jest.Mock).mockReturnValue({ onError, onSuccess });
    jest.spyOn(swr, 'default').mockImplementation((key, f) => {
      if (key === '/dashboards/1') {
        return { data: { trainers: response } } as never;
      } else if (key === '/tags/trainer') {
        return { data: tags } as any;
      }

      return {} as any;
    });
  });

  it('should render properly', async () => {
    jest.spyOn(swr, 'default').mockImplementation(() => ({} as any));

    let container: any;
    await act(async () => {
      container = renderComponent();
    });

    expect(container).toBeDefined();
  });

  it('should render without data', async () => {
    await act(async () => {
      renderComponent();
    });

    // Find trainers
    response.forEach(({ firstName, lastName }) => {
      expect(screen.getByText(`${firstName} ${lastName}`)).toBeInTheDocument();
    });
    // Find placeholder
    expect(screen.getByTitle('add-trainer')).toBeInTheDocument();
  });

  it('should not show the button if user does not have permissions', async () => {
    (ctx.useAppContext as jest.Mock<AppContextValue>).mockReturnValue({
      token: {
        parsed: { id: 1, email: 'some@email.com', user: 'worker' },
        value: 'token'
      },
      user: { firstName: 'Test', lastName: 'User', gym: { id: 1 } },
      helpers: { hasAccess: () => false },
      API: { fetcher, poster }
    } as any);

    await act(async () => {
      renderComponent();
    });

    expect(screen.queryByTitle('add-trainer')).not.toBeInTheDocument();
  });

  it('should post a new trainer and call mutate', async () => {
    const mutateSpy = jest.fn();
    jest.spyOn(swr, 'default').mockImplementation((key) => {
      if (key === '/dashboards/1') {
        return { data: { trainers: [] }, mutate: mutateSpy } as never;
      } else if (key === '/tags/trainer') {
        return { data: tags } as any;
      }

      return {} as never;
    });
    poster.mockResolvedValue({ trainer: { ...response[0], id: 10 } });

    await act(async () => {
      renderComponent();
    });
    await fillTrainer();

    expect(poster).toHaveBeenCalledTimes(1);
    expect(poster).toHaveBeenCalledWith('/persons/trainer', {
      firstName: 'Test',
      lastName: 'Trainer',
      gender: Gender.OTHER,
      email: 'test@trainer.com',
      gym: 1,
      tags: []
    });

    expect(mutateSpy).toHaveBeenCalledTimes(1);
    expect(mutateSpy).toHaveBeenCalledWith(
      { trainers: [{ ...response[0], id: 10 }] },
      false
    );
    expect(onSuccess).toHaveBeenCalledTimes(1);
    expect(onSuccess).toHaveBeenCalledWith('Trainer created!');
  });

  it('should call on error if poster fails', async () => {
    const mutateSpy = jest.fn();
    jest.spyOn(swr, 'default').mockImplementation((key) => {
      if (key === '/dashboards/1') {
        return { data: { trainers: [] }, mutate: mutateSpy } as never;
      } else if (key === '/tags/trainer') {
        return { data: tags } as any;
      }

      return {} as never;
    });
    poster.mockRejectedValue('Error thrown');

    await act(async () => {
      renderComponent();
    });
    await fillTrainer();

    expect(poster).toHaveBeenCalledTimes(1);
    expect(mutateSpy).not.toHaveBeenCalled();
    expect(onError).toHaveBeenCalledTimes(1);
    expect(onError).toHaveBeenCalledWith('Error thrown');
  });

  it('should open and close the dialog', async () => {
    await act(async () => {
      renderComponent();
    });
    await act(async () => {
      fireEvent.click(screen.getByTitle('add-trainer'));
    });
    await act(async () => {
      fireEvent.click(screen.getByTitle('close-dialog'));
    });
    await waitForElementToBeRemoved(screen.queryByRole('dialog'));
  });
});
