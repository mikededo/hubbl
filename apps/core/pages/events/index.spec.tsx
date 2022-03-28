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

const eventTemplatesResponse = [
  {
    id: 1,
    name: 'TemplateOne',
    description: 'Event template one description',
    difficulty: 5,
    type: eventTypesResponse[0]
  },
  {
    id: 1,
    name: 'TemplateTwo',
    description: 'Event template two description',
    difficulty: 5,
    type: eventTypesResponse[1]
  },
  {
    id: 1,
    name: 'TemplateThree',
    description: 'Event template three description',
    difficulty: 5,
    type: eventTypesResponse[2]
  },
  {
    id: 1,
    name: 'TemplateFour',
    description: 'Event template four description',
    difficulty: 5,
    type: eventTypesResponse[3]
  },
  {
    id: 1,
    name: 'TemplateFive',
    description: 'Event template five description',
    difficulty: 5,
    type: eventTypesResponse[4]
  }
];

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
  it('should have the getLayout prop defined', () => {
    expect(Events.getLayout).toBeDefined();

    const { container } = render(
      <ThemeProvider theme={createTheme()}>
        {Events.getLayout(<div />)}
      </ThemeProvider>
    );
    expect(container).toBeInTheDocument();
  });

  describe('Event types', () => {
    const fetcher = jest.fn();
    const poster = jest.fn();
    const swrSpy = jest.spyOn(swr, 'default');
    const onError = jest.fn();

    beforeEach(() => {
      jest.resetAllMocks();

      const pop = jest.fn();
      const push = jest.fn();

      (ctx.useAppContext as jest.Mock).mockReturnValue({
        token: { parsed: {} },
        user: { gym: { id: 1 } },
        API: { fetcher, poster }
      });
      (ctx.useToastContext as jest.Mock).mockReturnValue({ onError });
      (ctx.useLoadingContext as jest.Mock).mockReturnValue({
        loading: false,
        onPopLoading: pop,
        onPushLoading: push
      });
    });

    it('should render the list of event types', async () => {
      swrSpy.mockImplementation((key) => {
        if (key === '/event-types') {
          return eventTypesResponse as any;
        } else if (key === '/event-templates') {
          return eventTemplatesResponse as any;
        }
      });

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
      });
      poster.mockImplementation(() => ({
        ...eventTypesResponse.data[0],
        id: 10
      }));

      await act(async () => {
        renderPage();
      });
      await act(async () => {
        fireEvent.click(screen.getByTitle('add-event-type'));
      });
      await act(async () => {
        fireEvent.input(screen.getByPlaceholderText('New name'), {
          target: { name: 'name', value: 'Name' }
        });
        fireEvent.input(
          screen.getByPlaceholderText('New event type description'),
          {
            target: { name: 'description', value: 'Description' }
          }
        );
      });
      await act(async () => {
        userEvent.click(screen.getByTitle(AppPalette.GREEN));
      });
      await act(async () => {
        fireEvent.submit(screen.getByText('Save'));
      });

      expect(mutateSpy).toHaveBeenCalledTimes(1);
      expect(poster).toHaveBeenCalledTimes(1);
    });

    it('should open and close the dialog', async () => {
      swrSpy.mockImplementation((key) => {
        if (key === '/event-types') {
          return eventTypesResponse as any;
        } else if (key === '/event-templates') {
          return eventTemplatesResponse as any;
        }
      });

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
    const swrSpy = jest.spyOn(swr, 'default');
    const onError = jest.fn();

    beforeEach(() => {
      jest.resetAllMocks();

      const pop = jest.fn();
      const push = jest.fn();

      (ctx.useAppContext as jest.Mock).mockReturnValue({
        token: { parsed: {} },
        user: { gym: { id: 1 } },
        API: { fetcher }
      });
      (ctx.useToastContext as jest.Mock).mockReturnValue({ onError });
      (ctx.useLoadingContext as jest.Mock).mockReturnValue({
        loading: false,
        onPopLoading: pop,
        onPushLoading: push
      });
    });

    it('should render the list of event templates', async () => {
      swrSpy.mockImplementation((key) => {
        if (key === '/event-types') {
          return eventTypesResponse as any;
        } else if (key === '/event-templates') {
          return eventTemplatesResponse as any;
        }
      });

      await act(async () => {
        renderPage();
      });

      expect(screen.getByText('Event templates')).toBeInTheDocument();
      eventTypesResponse.data.forEach(({ name }) => {
        expect(screen.getByText(name)).toBeInTheDocument();
      });
      expect(screen.getByTitle('add-event-template')).toBeInTheDocument();
    });

    it('should not call fetcher if token is null', async () => {
      (ctx.useAppContext as jest.Mock).mockClear().mockReturnValue({
        token: { parsed: undefined },
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
          return eventTypesResponse as any;
        } else if (key === '/event-templates') {
          return { error: 'Error thrown' } as any;
        }
      });

      await act(async () => {
        renderPage();
      });

      expect(onError).toHaveBeenCalledTimes(1);
      expect(onError).toHaveBeenCalledWith('Error thrown');
    });
  });
});
