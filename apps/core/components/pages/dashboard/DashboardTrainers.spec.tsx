import * as swr from 'swr';

import * as ctx from '@hubbl/data-access/contexts';
import {
  AppContextValue,
  AppProvider,
  LoadingContext,
  ToastContext
} from '@hubbl/data-access/contexts';
import { TrainerDTO } from '@hubbl/shared/models/dto';
import { createTheme, ThemeProvider } from '@mui/material';
import { render, screen, act } from '@testing-library/react';

import DashboardTrainers from './DashboardTrainers';
import { Gender } from '@hubbl/shared/types';

jest.mock('@hubbl/data-access/contexts', () => {
  const actual = jest.requireActual('@hubbl/data-access/contexts');

  return { ...actual, useAppContext: jest.fn() };
});
jest.mock('axios');

const response = [
  {
    id: 1,
    firstName: 'One',
    lastName: 'Trainer',
    gender: Gender.OTHER,
    workerCode: 'SomeCode'
  },
  {
    id: 2,
    firstName: 'Two',
    lastName: 'Trainer',
    gender: Gender.OTHER,
    workerCode: 'SomeCode'
  },
  {
    id: 3,
    firstName: 'Three',
    lastName: 'Trainer',
    gender: Gender.OTHER,
    workerCode: 'SomeCode'
  },
  {
    id: 4,
    firstName: 'Four',
    lastName: 'Trainer',
    gender: Gender.OTHER,
    workerCode: 'SomeCode'
  },
  {
    id: 5,
    firstName: 'Five',
    lastName: 'Trainer',
    gender: Gender.OTHER,
    workerCode: 'SomeCode'
  },
] as TrainerDTO<number>[];

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

describe('<DashboardTrainers />', () => {
  const fetcher = jest.fn();

  beforeEach(() => {
    jest.resetAllMocks();

    (ctx.useAppContext as jest.Mock<AppContextValue>).mockReturnValue({
      token: {
        parsed: { id: 1, email: 'some@email.com', user: 'owner' },
        value: 'token'
      },
      user: { firstName: 'Test', lastName: 'User', gym: { id: 1 } },
      API: { fetcher }
    } as any);
  });

  it('should render the list of event templates', async () => {
    jest.spyOn(swr, 'default').mockImplementation((cb, f, opt) => {
      expect(f).toBe(fetcher);
      if (cb) {
        expect(cb).toBe(`/dashboards/1`);
      }
      expect(opt).toStrictEqual({ revalidateOnFocus: false });

      return { data: { trainers: response } } as never;
    });

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
});
