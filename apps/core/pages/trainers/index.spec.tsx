import * as swr from 'swr';
import * as ctx from '@hubbl/data-access/contexts';
import { Gender } from '@hubbl/shared/types';
import { act, fireEvent, screen, render } from '@testing-library/react';

import Trainers from './index';
import { createTheme, ThemeProvider } from '@mui/material';

jest.mock('@hubbl/data-access/api');
jest.mock('@hubbl/data-access/contexts', () => {
  const actual = jest.requireActual('@hubbl/data-access/contexts');
  const app = jest.fn();

  return {
    ...actual,
    useAppContext: app
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
    workerCode: `${i}-some-worker-code`,
    tags: []
  }));

describe('Trainers', () => {
  const swrSpy = jest.spyOn(swr, 'default');

  const fetcher = jest.fn();

  beforeEach(() => {
    jest.resetAllMocks();

    (ctx.useAppContext as jest.Mock).mockReturnValue({
      token: { parsed: {} },
      user: { gym: { id: 1 } },
      todayEvents: [],
      API: { fetcher }
    });
    swrSpy.mockReturnValue({ data: trainers } as any);
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
    expect(swrSpy).toHaveBeenNthCalledWith(
      1,
      '/persons/trainers?skip=0',
      fetcher
    );

    await act(async () => {
      fireEvent.click(screen.getByLabelText('next-page'));
    });
    expect(swrSpy).toHaveBeenNthCalledWith(
      2,
      '/persons/trainers?skip=15',
      fetcher
    );

    await act(async () => {
      fireEvent.click(screen.getByLabelText('prev-page'));
    });
    expect(swrSpy).toHaveBeenNthCalledWith(
      3,
      '/persons/trainers?skip=0',
      fetcher
    );
  });
});
