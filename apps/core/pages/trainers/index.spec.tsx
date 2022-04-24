import * as swr from 'swr';

import * as ctx from '@hubbl/data-access/contexts';
import { Gender } from '@hubbl/shared/types';
import { createTheme, ThemeProvider } from '@mui/material';
import { act, fireEvent, render, screen } from '@testing-library/react';

import Trainers from './index';

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

const trainers = Array(15)
  .fill(undefined)
  .map((_, i) => ({
    id: i,
    firstName: `Trainer-${i}`,
    lastName: `Test-${i}`,
    email: `trainer-${i}@test.com`,
    gender: Gender[i % 2 === 0 ? 'WOMAN' : 'OTHER'],
    tags: []
  }));

const trainersTwo = Array(15)
  .fill(undefined)
  .map((_, i) => ({
    id: i,
    firstName: `Trainer-Two-${i}`,
    lastName: `Test-${i}`,
    email: `trainer-${i}@test.com`,
    gender: Gender[i % 2 === 0 ? 'WOMAN' : 'OTHER'],
    tags: []
  }));

const tags = Array(3)
  .fill(undefined)
  .map((_, i) => ({ id: i, name: `Tag-${i}` }));

describe('Trainers page', () => {
  const mutateSpy = jest.fn();
  const swrSpy = jest.spyOn(swr, 'default');

  const fetcher = jest.fn();
  const poster = jest.fn();

  const onError = jest.fn();
  const onSuccess = jest.fn();

  beforeEach(() => {
    jest.resetAllMocks();

    (ctx.useAppContext as jest.Mock).mockReturnValue({
      token: { parsed: {} },
      user: { gym: { id: 1 } },
      todayEvents: [],
      API: { fetcher, poster }
    });
    (ctx.useToastContext as jest.Mock).mockReturnValue({
      onError,
      onSuccess
    });
    swrSpy.mockImplementation((key) => {
      if (key === '/persons/trainers?skip=0') {
        return { data: trainers, mutate: mutateSpy } as any;
      } else if (key === '/persons/trainers?skip=15') {
        return { data: trainersTwo } as any;
      } else if (key === '/tags/trainer') {
        return { data: tags } as any;
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
      render(<Trainers />);
    });

    expect(fetcher).not.toHaveBeenCalled();
  });

  it('should have the getLayout prop defined', () => {
    expect(Trainers.getLayout).toBeDefined();

    const { container } = render(
      <ThemeProvider theme={createTheme()}>
        {Trainers.getLayout(<div />)}
      </ThemeProvider>
    );
    expect(container).toBeInTheDocument();
  });

  it('should render properly', async () => {
    await act(async () => {
      render(<Trainers />);
    });

    // Trainers list
    trainers.forEach((trainer) => {
      expect(screen.getByText(trainer.firstName)).toBeInTheDocument();
    });
    // Pagination
    expect(screen.getByLabelText('prev-page')).toBeInTheDocument();
    expect(screen.getByLabelText('next-page')).toBeInTheDocument();
  });

  it('it should iterate through the pages', async () => {
    await act(async () => {
      render(<Trainers />);
    });
    trainers.forEach((trainer) => {
      expect(screen.getByText(trainer.firstName)).toBeInTheDocument();
    });

    await act(async () => {
      fireEvent.click(screen.getByLabelText('next-page'));
    });
    trainersTwo.forEach((trainer) => {
      expect(screen.getByText(trainer.firstName)).toBeInTheDocument();
    });

    await act(async () => {
      fireEvent.click(screen.getByLabelText('prev-page'));
    });
    trainers.forEach((trainer) => {
      expect(screen.getByText(trainer.firstName)).toBeInTheDocument();
    });
  });

  describe('post trainer', () => {
    const fillTrainer = async (withTags = false) => {
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

      if (withTags) {
        fireEvent.mouseDown(
          screen
            .getAllByRole('button')
            .filter((element) => element.id === 'mui-component-select-tags')[0]
        );
        /* Extracted from mui select library */
        act(() => {
          const options = screen.getAllByRole('option');
          fireEvent.mouseDown(options[0]);
          options[0].click();
        });
      }

      await act(async () => {
        fireEvent.click(screen.getByText('Save'));
      });
    };

    it('should post a new trainer and not call mutate', async () => {
      poster.mockResolvedValue({ trainer: { ...trainers[0], id: 10 } });

      await act(async () => {
        render(<Trainers />);
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
      // It should not call mutate as trainers length === 15
      expect(mutateSpy).not.toHaveBeenCalledTimes(1);
      expect(onSuccess).toHaveBeenCalledTimes(1);
      expect(onSuccess).toHaveBeenCalledWith('Trainer created!');
    });

    it('should post a new trainer and call mutate', async () => {
      swrSpy.mockImplementation((key) => {
        if (key === '/persons/trainers?skip=0') {
          return { data: [], mutate: mutateSpy } as any;
        } else if (key === '/persons/trainers?skip=15') {
          return { data: trainersTwo } as any;
        } else if (key === '/tags/trainer') {
          return { data: tags } as any;
        }

        return {} as any;
      });
      poster.mockResolvedValue({ trainer: { ...trainers[0], id: 10 } });

      await act(async () => {
        render(<Trainers />);
      });
      await fillTrainer(true);

      expect(poster).toHaveBeenCalledTimes(1);
      expect(poster).toHaveBeenCalledWith('/persons/trainer', {
        firstName: 'Test',
        lastName: 'Trainer',
        gender: Gender.OTHER,
        email: 'test@trainer.com',
        gym: 1,
        tags: [{ gym: 1, id: 0, name: 'Tag-0' }]
      });
      // It should not call mutate as trainers length === 15
      expect(mutateSpy).toHaveBeenCalledTimes(1);
      expect(mutateSpy).toHaveBeenCalledWith(
        [{ ...trainers[0], id: 10 }],
        false
      );
      expect(onSuccess).toHaveBeenCalledTimes(1);
      expect(onSuccess).toHaveBeenCalledWith('Trainer created!');
    });

    it('should call onError on poster error', async () => {
      poster.mockRejectedValue('Error thrown');

      await act(async () => {
        render(<Trainers />);
      });
      await fillTrainer();

      expect(poster).toHaveBeenCalledTimes(1);
      expect(mutateSpy).not.toHaveBeenCalled();
      expect(onError).toHaveBeenCalledTimes(1);
      expect(onError).toHaveBeenCalledWith('Error thrown');
    });
  });

  it('should open and close the dialog', async () => {
    await act(async () => {
      render(<Trainers />);
    });
    await act(async () => {
      fireEvent.click(screen.getByTitle('add-trainer'));
    });
    await act(async () => {
      fireEvent.click(screen.getByTitle('close-dialog'));
    });
  });
});
