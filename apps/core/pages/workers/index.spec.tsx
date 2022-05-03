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

const workers = Array(15)
  .fill(undefined)
  .map((_, i) => ({
    id: i,
    firstName: `Worker-${i}`,
    lastName: `Test-${i}`,
    email: `worker-${i}@test.com`,
    phone: `${i}`.repeat(9),
    gender: Gender[i % 2 === 0 ? 'WOMAN' : 'OTHER']
  }));

const workersTwo = Array(15)
  .fill(undefined)
  .map((_, i) => ({
    id: i,
    firstName: `Worker-Two-${i}`,
    lastName: `Test-${i}`,
    email: `worker-${i}@test.com`,
    phone: `${i}`.repeat(9),
    gender: Gender[i % 2 === 0 ? 'WOMAN' : 'OTHER']
  }));

describe('Workers page', () => {
  const mutateSpy = jest.fn();
  const swrSpy = jest.spyOn(swr, 'default');

  const fetcher = jest.fn();

  const onError = jest.fn();
  const onSuccess = jest.fn();

  beforeEach(() => {
    jest.resetAllMocks();

    (ctx.useAppContext as jest.Mock).mockReturnValue({
      token: { parsed: {} },
      user: { gym: { id: 1 } },
      todayEvents: [],
      API: { fetcher }
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
});
