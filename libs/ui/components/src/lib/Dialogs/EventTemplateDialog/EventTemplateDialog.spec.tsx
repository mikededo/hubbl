import { act } from 'react-dom/test-utils';
import * as swr from 'swr';

import * as ctx from '@hubbl/data-access/contexts';
import {
  AppContextValue,
  AppProvider,
  ToastContext
} from '@hubbl/data-access/contexts';
import { createTheme, ThemeProvider } from '@mui/material';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { EventTemplateFormFields } from '../types';
import EventTemplateDialog from './EventTemplateDialog';

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
jest.mock('axios');

const MockComponent = ({
  defaultValues,
  open,
  onSubmit
}: {
  defaultValues?: EventTemplateFormFields;
  open: boolean;
  onSubmit?: any;
}) => (
  <AppProvider>
    <ThemeProvider theme={createTheme()}>
      <ToastContext>
        <EventTemplateDialog
          title="Create event template"
          defaultValues={defaultValues}
          open={open}
          onSubmit={onSubmit}
        />
      </ToastContext>
    </ThemeProvider>
  </AppProvider>
);

describe('<EventTemplateDialog />', () => {
  const fetcher = jest.fn();
  const swrSpy = jest.spyOn(swr, 'default');
  const onError = jest.fn();

  const response = {
    data: [
      { id: 1, name: 'One' },
      { id: 2, name: 'Two' }
    ],
    error: null
  };

  beforeEach(() => {
    jest.resetAllMocks();

    (ctx.useAppContext as jest.Mock<AppContextValue>).mockReturnValue({
      token: { parsed: {} },
      API: { fetcher }
    } as any);
    (ctx.useToastContext as jest.Mock).mockReturnValue({ onError });
    swrSpy.mockImplementation(() => response as any);
  });

  describe('open', () => {
    it('should not render if not open', () => {
      render(<MockComponent open={false} />);

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('should render if open', async () => {
      await act(async () => {
        render(<MockComponent open />);
      });

      expect(screen.queryByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('Create event template')).toBeInTheDocument();
      expect(swrSpy).toHaveBeenCalled();
    });
  });

  describe('form', () => {
    it('should render the event template form', async () => {
      await act(async () => {
        render(<MockComponent open />);
      });

      expect(screen.getByText('Event template name')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('New name')).toBeInTheDocument();
      expect(screen.getByText('Description')).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText('New event template description')
      ).toBeInTheDocument();
      expect(screen.getByText('Mask required')).toBeInTheDocument();
      expect(
        screen.getByTitle('event-template-mask-required')
      ).toBeInTheDocument();
      expect(screen.getByText('Covid passport')).toBeInTheDocument();
      expect(
        screen.getByTitle('event-template-covid-passport')
      ).toBeInTheDocument();
      expect(screen.getByText('Capacity')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('200')).toBeInTheDocument();
      expect(screen.getByText('Event type (optional)')).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText('Select an event type (optional)')
      ).toBeInTheDocument();
      expect(screen.getByText('Difficulty')).toBeInTheDocument();
      expect(screen.getByTitle('event-template-difficulty'));
    });

    it('should render with the default values', async () => {
      const defaultValues: EventTemplateFormFields = {
        name: 'Name',
        description: 'Event template description',
        maskRequired: false,
        covidPassport: false,
        capacity: 150,
        difficulty: 3,
        eventType: 1
      };

      await act(async () => {
        render(<MockComponent defaultValues={defaultValues} open />);
      });

      expect(screen.getByPlaceholderText('New name')).toHaveValue(
        defaultValues.name
      );
      expect(
        screen.getByPlaceholderText('New event template description')
      ).toHaveValue(defaultValues.description);
      expect(
        screen.getByTitle('event-template-mask-required').firstChild
      ).not.toBeChecked();
      expect(
        screen.getByTitle('event-template-covid-passport').firstChild
      ).not.toBeChecked();
      expect(screen.getByPlaceholderText('200')).toHaveValue(
        defaultValues.capacity
      );
    });

    it('should call onSubmit if all fields are valid', async () => {
      const onSubmitSpy = jest.fn();

      await act(async () => {
        render(<MockComponent onSubmit={onSubmitSpy} open />);
      });

      await act(async () => {
        fireEvent.input(screen.getByPlaceholderText('New name'), {
          target: { name: 'name', value: 'Name' }
        });
        fireEvent.input(
          screen.getByPlaceholderText('New event template description'),
          {
            target: { name: 'description', value: 'Event description' }
          }
        );
        fireEvent.input(screen.getByPlaceholderText('200'), {
          target: { name: 'capacity', value: '25' }
        });
      });
      await act(async () => {
        userEvent.click(screen.getByText('Save'));
      });

      expect(onSubmitSpy).toHaveBeenCalledTimes(1);
      expect(onSubmitSpy).toHaveBeenCalledWith({
        name: 'Name',
        description: 'Event description',
        capacity: 25,
        maskRequired: true,
        covidPassport: true,
        difficulty: 3,
        eventType: 1
      });
    });
  });

  it('should call onError', async () => {
    swrSpy
      .mockClear()
      .mockImplementation(
        () => ({ data: undefined, error: 'An error' } as any)
      );

    await act(async () => {
      render(<MockComponent open />);
    });

    expect(onError).toHaveBeenCalledTimes(1);
    expect(onError).toHaveBeenCalledWith('An error occurred.');
  });
});
