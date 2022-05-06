import * as swr from 'swr';

import * as ctx from '@hubbl/data-access/contexts';
import {
  AppContextValue,
  AppProvider,
  LoadingContext,
  ToastContext
} from '@hubbl/data-access/contexts';
import { EventTemplateDTO } from '@hubbl/shared/models/dto';
import { AppPalette } from '@hubbl/shared/types';
import { createTheme, ThemeProvider } from '@mui/material';
import { act, fireEvent, render, screen } from '@testing-library/react';

import DashboardEventTemplates from './DashboardEventTemplates';

jest.mock('@hubbl/data-access/contexts', () => {
  const actual = jest.requireActual('@hubbl/data-access/contexts');
  const app = jest.fn();
  const toast = jest.fn();

  return { ...actual, useAppContext: app, useToastContext: toast };
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

const eventTypesResponse = {
  data: [
    {
      id: 1,
      name: 'TypeOne',
      description: 'Event type one description',
      labelColor: AppPalette.EMERALD
    }
  ]
};

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
  const hasAccess = () => true;

  const fetcher = jest.fn();
  const poster = jest.fn();

  const onError = jest.fn();
  const onSuccess = jest.fn();

  beforeEach(() => {
    jest.resetAllMocks();

    (ctx.useToastContext as jest.Mock).mockReturnValue({ onError, onSuccess });
    (ctx.useAppContext as jest.Mock<AppContextValue>).mockReturnValue({
      token: {
        parsed: { id: 1, email: 'some@email.com', user: 'owner' },
        value: 'token'
      },
      user: { firstName: 'Test', lastName: 'User', gym: { id: 1 } },
      helpers: { hasAccess },
      API: { fetcher, poster }
    } as any);

    jest.spyOn(swr, 'default').mockImplementation((key) => {
      if (key === `/dashboards/1`) {
        return { data: { templates: response } } as any;
      }

      return {} as any;
    });
  });

  const fillEventTemplateForm = async () => {
    await act(async () => {
      fireEvent.click(screen.getByTitle('add-event-template'));
    });
    await act(async () => {
      fireEvent.input(screen.getByPlaceholderText('New name'), {
        target: { name: 'name', value: 'Name' }
      });
      fireEvent.input(
        screen.getByPlaceholderText('New event template description'),
        { target: { name: 'description', value: 'Description' } }
      );
      fireEvent.input(screen.getByPlaceholderText('200'), {
        target: { name: 'capacity', value: 25 }
      });
    });
    await act(async () => {
      fireEvent.submit(screen.getByText('Save'));
    });
  };

  it('should render properly if no data', async () => {
    jest.spyOn(swr, 'default').mockImplementation((key) => {
      if (key === `/dashboards/1`) {
        return { data: undefined } as any;
      }

      return {} as any;
    });

    await act(async () => {
      renderComponent();
    });
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

    expect(screen.queryByTitle('add-event-template')).not.toBeInTheDocument();
  });

  it('should open and close the dialog', async () => {
    await act(async () => {
      renderComponent();
    });
    await act(async () => {
      fireEvent.click(screen.getByTitle('add-event-template'));
    });
    await act(async () => {
      fireEvent.click(screen.getByTitle('close-dialog'));
    });
  });

  it('should post a new event template', async () => {
    const mutateSpy = jest.fn().mockImplementation();
    jest.spyOn(swr, 'default').mockImplementation((key) => {
      if (key === '/event-types') {
        return eventTypesResponse as any;
      } else if (key === `/dashboards/1`) {
        return { data: { templates: response }, mutate: mutateSpy } as any;
      }

      return {};
    });
    poster.mockImplementation(() => ({ id: 10 }));

    await act(async () => {
      renderComponent();
    });
    await fillEventTemplateForm();

    expect(poster).toHaveBeenCalledTimes(1);
    expect(poster).toHaveBeenCalledWith('/event-templates', {
      name: 'Name',
      description: 'Description',
      capacity: 25,
      maskRequired: true,
      covidPassport: true,
      difficulty: 3,
      type: 1,
      gym: 1
    });
    expect(mutateSpy).toHaveBeenCalledTimes(1);
    expect(mutateSpy).toHaveBeenCalledWith(
      { templates: [{ id: 10 }, ...response] },
      false
    );
    expect(onSuccess).toHaveBeenCalledTimes(1);
    expect(onSuccess).toHaveBeenCalledWith('Event template created!');
  });

  it('should call onError if posting event template fails', async () => {
    const mutateSpy = jest.fn().mockImplementation();
    jest.spyOn(swr, 'default').mockImplementation((key) => {
      if (key === '/event-types') {
        return eventTypesResponse as any;
      } else if (key === `/dashboards/1`) {
        return { data: { templates: response }, mutate: mutateSpy } as any;
      }

      return {};
    });
    poster.mockRejectedValue('Error thrown');

    await act(async () => {
      renderComponent();
    });
    await fillEventTemplateForm();

    expect(poster).toHaveBeenCalledTimes(1);
    expect(mutateSpy).not.toHaveBeenCalledTimes(1);
    expect(onError).toHaveBeenCalledTimes(1);
    expect(onError).toHaveBeenCalledWith('Error thrown');
  });
});
