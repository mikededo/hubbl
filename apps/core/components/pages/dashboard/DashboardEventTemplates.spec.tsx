import * as swr from 'swr';

import * as ctx from '@hubbl/data-access/contexts';
import {
  AppContextValue,
  AppProvider,
  LoadingContext,
  ToastContext
} from '@hubbl/data-access/contexts';
import { EventTemplateDTO } from '@hubbl/shared/models/dto';
import { createTheme, ThemeProvider } from '@mui/material';
import { render, screen, act } from '@testing-library/react';

import DashboardEventTemplates from './DashboardEventTemplates';

jest.mock('@hubbl/data-access/contexts', () => {
  const actual = jest.requireActual('@hubbl/data-access/contexts');

  return { ...actual, useAppContext: jest.fn() };
});
jest.mock('axios');

const response = [
  {
    id: 1,
    name: 'One',
    description: 'One Description',
    capacity: 25,
    difficulty: 3,
    covidPassport: true,
    maskRequired: true
  },
  {
    id: 2,
    name: 'Two',
    description: 'Two Description',
    capacity: 25,
    difficulty: 3,
    covidPassport: true,
    maskRequired: true
  },
  {
    id: 3,
    name: 'Three',
    description: 'Three Description',
    capacity: 25,
    difficulty: 3,
    covidPassport: true,
    maskRequired: true
  },
  {
    id: 4,
    name: 'Four',
    description: 'Four Description',
    capacity: 25,
    difficulty: 3,
    covidPassport: true,
    maskRequired: true
  },
  {
    id: 5,
    name: 'Five',
    description: 'Five Description',
    capacity: 25,
    difficulty: 3,
    covidPassport: true,
    maskRequired: true
  }
] as EventTemplateDTO[];

const renderComponent = () =>
  render(
    <LoadingContext>
      <ThemeProvider theme={createTheme()}>
        <ToastContext>
          <AppProvider>
            <DashboardEventTemplates />
          </AppProvider>
        </ToastContext>
      </ThemeProvider>
    </LoadingContext>
  );

describe('<DashboardEventTemplates />', () => {
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

      return { data: { templates: response } } as never;
    });

    await act(async () => {
      renderComponent();
    });

    // Find eventtemplates
    response.forEach(({ name }) => {
      expect(screen.getByText(name)).toBeInTheDocument();
    });
    // Find placeholder
    expect(screen.getByTitle('add-event-template')).toBeInTheDocument();
  });
});
