import * as swr from 'swr';

import * as ctx from '@hubbl/data-access/contexts';
import {
  AppProvider,
  LoadingContext,
  ToastContext
} from '@hubbl/data-access/contexts';
import { AppPalette } from '@hubbl/shared/types';
import { createTheme, ThemeProvider } from '@mui/material';
import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Events from './index';

jest.mock('@hubbl/data-access/api');
jest.mock('@hubbl/data-access/contexts', () => {
  const actual = jest.requireActual('@hubbl/data-access/contexts');
  const app = jest.fn();
  const toast = jest.fn();
  const load = jest.fn();

  return {
    ...actual,
    useAppContext: app,
    useToastContext: toast,
    useLoadingContext: load
  };
});
jest.mock('jsonwebtoken', () => {
  const actual = jest.requireActual('jsonwebtoken');

  return { ...actual, decode: jest.fn() };
});

const eventTypesResponse = {
  data: [
    {
      id: 1,
      name: 'TypeOne',
      description: 'Event type one description',
      labelColor: AppPalette.EMERALD
    },
    {
      id: 2,
      name: 'TypeTwo',
      description: 'Event type two description',
      labelColor: AppPalette.INDIGO
    },
    {
      id: 3,
      name: 'TypeThree',
      description: 'Event type three description',
      labelColor: AppPalette.PURPLE
    },
    {
      id: 4,
      name: 'TypeFour',
      description: 'Event type four description',
      labelColor: AppPalette.ORANGE
    },
    {
      id: 5,
      name: 'TypeFive',
      description: 'Event type five description',
      labelColor: AppPalette.PINK
    }
  ]
};

const eventTemplatesResponse = {
  data: [
    {
      id: 1,
      name: 'TemplateOne',
      description: 'Event template one description',
      difficulty: 5,
      type: {
        ...eventTypesResponse.data[0],
        // Use another name to avoid getByText name coalision
        name: 'EventTypeTemplateOne'
      }
    },
    {
      id: 2,
      name: 'TemplateTwo',
      description: 'Event template two description',
      difficulty: 5,
      type: {
        ...eventTypesResponse.data[1],
        name: 'EventTypeTemplateTwo'
      }
    },
    {
      id: 3,
      name: 'TemplateThree',
      description: 'Event template three description',
      difficulty: 5,
      type: {
        ...eventTypesResponse.data[2],
        name: 'EventTypeTemplateThree'
      }
    },
    {
      id: 4,
      name: 'TemplateFour',
      description: 'Event template four description',
      difficulty: 5,
      type: {
        ...eventTypesResponse.data[3],
        name: 'EventTypeTemplateFour'
      }
    },
    {
      id: 5,
      name: 'TemplateFive',
      description: 'Event template five description',
      difficulty: 5,
      type: {
        ...eventTypesResponse.data[4],
        name: 'EventTypeTemplateFive'
      }
    }
  ]
};

const renderPage = () =>
  render(
    <LoadingContext>
      <AppProvider>
        <ThemeProvider theme={createTheme()}>
          <ToastContext>
            <Events />
          </ToastContext>
        </ThemeProvider>
      </AppProvider>
    </LoadingContext>
  );

describe('Events page', () => {
  const swrSpy = jest.spyOn(swr, 'default');

  it('should have the getLayout prop defined', () => {
    expect(Events.getLayout).toBeDefined();

    const { container } = render(
      <ThemeProvider theme={createTheme()}>
        {Events.getLayout(<div />)}
      </ThemeProvider>
    );
    expect(container).toBeInTheDocument();
  });

  const mockSwr = () => {
    swrSpy.mockClear().mockImplementation((key) => {
      if (key === '/event-types') {
        return eventTypesResponse as any;
      } else if (key === '/event-templates') {
        return eventTemplatesResponse as any;
      }

      return {};
    });
  };

  describe('Event types', () => {
    const fetcher = jest.fn();
    const poster = jest.fn();
    const onError = jest.fn();
    const onSuccess = jest.fn();

    beforeEach(() => {
      jest.resetAllMocks();

      const pop = jest.fn();
      const push = jest.fn();

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
      (ctx.useLoadingContext as jest.Mock).mockReturnValue({
        loading: false,
        onPopLoading: pop,
        onPushLoading: push
      });
    });

    const fillEventTypesForm = async () => {
      await act(async () => {
        fireEvent.click(screen.getByTitle('add-event-type'));
      });
      await act(async () => {
        fireEvent.input(screen.getByPlaceholderText('New name'), {
          target: { name: 'name', value: 'Name' }
        });
        fireEvent.input(
          screen.getByPlaceholderText('New event type description'),
          { target: { name: 'description', value: 'Description' } }
        );
      });
      await act(async () => {
        userEvent.click(screen.getByTitle(AppPalette.GREEN));
      });
      await act(async () => {
        fireEvent.submit(screen.getByText('Save'));
      });
    };

    it('should render the list of event types', async () => {
      mockSwr();

      await act(async () => {
        renderPage();
      });

      expect(screen.getByText('Event types')).toBeInTheDocument();
      eventTypesResponse.data.forEach(({ name }) => {
        expect(screen.getByText(name)).toBeInTheDocument();
      });
      expect(screen.getByTitle('add-event-type')).toBeInTheDocument();
    });

    it('should not call fetcher if token is null', async () => {
      (ctx.useAppContext as jest.Mock).mockClear().mockReturnValue({
        token: { parsed: undefined },
        todayEvents: [],
        API: { fetcher }
      });
      swrSpy.mockImplementation(() => ({} as any));

      await act(async () => {
        renderPage();
      });

      expect(fetcher).not.toHaveBeenCalled();
    });

    it('should call onError if fetching event types fails', async () => {
      swrSpy.mockImplementation((key) => {
        if (key === '/event-types') {
          return { error: 'Error thrown' } as any;
        } else if (key === '/event-templates') {
          return eventTemplatesResponse as any;
        }

        return {};
      });

      await act(async () => {
        renderPage();
      });

      expect(onError).toHaveBeenCalledTimes(1);
      expect(onError).toHaveBeenCalledWith('Error thrown');
    });

    it('should post a new event type', async () => {
      const mutateSpy = jest.fn().mockImplementation();
      swrSpy.mockImplementation((key) => {
        if (key === '/event-types') {
          return { ...eventTypesResponse, mutate: mutateSpy } as any;
        } else if (key === '/event-templates') {
          return eventTemplatesResponse as any;
        }

        return {};
      });
      poster.mockImplementation(() => ({
        ...eventTypesResponse.data[0],
        id: 10
      }));

      await act(async () => {
        renderPage();
      });
      await fillEventTypesForm();

      expect(poster).toHaveBeenCalledTimes(1);
      expect(poster).toHaveBeenCalledWith('/event-types', {
        name: 'Name',
        description: 'Description',
        labelColor: AppPalette.GREEN,
        gym: 1
      });
      expect(mutateSpy).toHaveBeenCalledTimes(1);
      expect(mutateSpy).toHaveBeenCalledWith(
        [...eventTypesResponse.data, { ...eventTypesResponse.data[0], id: 10 }],
        false
      );
      expect(onSuccess).toHaveBeenCalledTimes(1);
      expect(onSuccess).toHaveBeenCalledWith('Event type created!');
    });

    it('should call onError if posting event types fails', async () => {
      const mutateSpy = jest.fn().mockImplementation();
      swrSpy.mockImplementation((key) => {
        if (key === '/event-types') {
          return { ...eventTypesResponse, mutate: mutateSpy } as any;
        } else if (key === '/event-templates') {
          return eventTemplatesResponse as any;
        }

        return {};
      });
      poster.mockRejectedValue('Error thrown');

      await act(async () => {
        renderPage();
      });
      await fillEventTypesForm();

      expect(poster).toHaveBeenCalledTimes(1);
      expect(mutateSpy).toHaveBeenCalledTimes(0);
      expect(onError).toHaveBeenCalledTimes(1);
      expect(onError).toHaveBeenCalledWith('Error thrown');
    });

    it('should open and close the dialog', async () => {
      mockSwr();

      await act(async () => {
        renderPage();
      });
      await act(async () => {
        fireEvent.click(screen.getByTitle('add-event-type'));
      });
      await act(async () => {
        fireEvent.click(screen.getByTitle(`close-dialog`));
      });
    });
  });

  describe('Event templates', () => {
    const fetcher = jest.fn();
    const poster = jest.fn();
    const onError = jest.fn();
    const onSuccess = jest.fn();

    beforeEach(() => {
      jest.resetAllMocks();

      const pop = jest.fn();
      const push = jest.fn();

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
      (ctx.useLoadingContext as jest.Mock).mockReturnValue({
        loading: false,
        onPopLoading: pop,
        onPushLoading: push
      });
    });

    const fillEventTemplatesForm = async () => {
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

    it('should render the list of event templates', async () => {
      mockSwr();

      await act(async () => {
        renderPage();
      });

      expect(screen.getByText('Event templates')).toBeInTheDocument();
      eventTemplatesResponse.data.forEach(({ name }) => {
        expect(screen.getByText(name)).toBeInTheDocument();
      });
      expect(screen.getByTitle('add-event-template')).toBeInTheDocument();
    });

    it('should not call fetcher if token is null', async () => {
      (ctx.useAppContext as jest.Mock).mockClear().mockReturnValue({
        token: { parsed: undefined },
        todayEvents: [],
        API: { fetcher }
      });
      swrSpy.mockImplementation(() => ({} as any));

      await act(async () => {
        renderPage();
      });

      expect(fetcher).not.toHaveBeenCalled();
    });

    it('should call onError if fetching event templates fails', async () => {
      swrSpy.mockImplementation((key) => {
        if (key === '/event-types') {
          return eventTypesResponse as any;
        } else if (key === '/event-templates') {
          return { error: 'Error thrown' } as any;
        }

        return {};
      });

      await act(async () => {
        renderPage();
      });

      expect(onError).toHaveBeenCalledTimes(1);
      expect(onError).toHaveBeenCalledWith('Error thrown');
    });

    it('should post a new event template', async () => {
      const mutateSpy = jest.fn().mockImplementation();
      swrSpy.mockImplementation((key) => {
        if (key === '/event-types') {
          return eventTypesResponse as any;
        } else if (key === '/event-templates') {
          return { ...eventTemplatesResponse, mutate: mutateSpy } as any;
        }

        return {};
      });
      poster.mockImplementation(() => ({
        ...eventTemplatesResponse.data[0],
        id: 10
      }));

      await act(async () => {
        renderPage();
      });
      await fillEventTemplatesForm();

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
        [
          ...eventTemplatesResponse.data,
          {
            ...eventTemplatesResponse.data[0],
            type: { ...eventTypesResponse.data[0], name: 'TypeOne' },
            id: 10
          }
        ],
        false
      );
      expect(onSuccess).toHaveBeenCalledTimes(1);
      expect(onSuccess).toHaveBeenCalledWith('Event template created!');
    });

    it('should call onError if posting an event template fails', async () => {
      const mutateSpy = jest.fn().mockImplementation();
      swrSpy.mockImplementation((key) => {
        if (key === '/event-types') {
          return eventTypesResponse as any;
        } else if (key === '/event-templates') {
          return { ...eventTemplatesResponse, mutate: mutateSpy } as any;
        }

        return {};
      });
      poster.mockRejectedValue('Error thrown');

      await act(async () => {
        renderPage();
      });
      await fillEventTemplatesForm();

      expect(poster).toHaveBeenCalledTimes(1);
      expect(mutateSpy).toHaveBeenCalledTimes(0);
      expect(onError).toHaveBeenCalledTimes(1);
      expect(onError).toHaveBeenCalledWith('Error thrown');
    });

    it('should open and close the dialog', async () => {
      mockSwr();

      await act(async () => {
        renderPage();
      });
      await act(async () => {
        fireEvent.click(screen.getByTitle('add-event-type'));
      });
      await act(async () => {
        fireEvent.click(screen.getByTitle(`close-dialog`));
      });
    });
  });
});
