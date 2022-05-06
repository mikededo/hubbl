import { AppProvider, ToastContext } from '@hubbl/data-access/contexts';
import { createTheme, ThemeProvider } from '@mui/material';
import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { CalendarEventFormFields } from '../types';
import CalendarEventDialog from './CalendarEventDialog';
import { UseEventDialogResult } from './useCalendarEventDialog';

// Test me 1h 15m

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
jest.useFakeTimers().setSystemTime(new Date('2022/06/29'));

const MockComponent = ({
  defaultValues = {},
  dialogData,
  open,
  onSubmit
}: {
  defaultValues?: Partial<CalendarEventFormFields>;
  dialogData: UseEventDialogResult;
  open: boolean;
  onSubmit?: any;
}) => (
  <AppProvider>
    <ThemeProvider theme={createTheme()}>
      <ToastContext>
        <CalendarEventDialog
          open={open}
          title="Create an event"
          dialogData={dialogData}
          defaultValues={defaultValues}
          onSubmit={onSubmit}
        />
      </ToastContext>
    </ThemeProvider>
  </AppProvider>
);

const EmptyDialogData: UseEventDialogResult = {
  eventTemplates: [],
  eventTypes: [],
  gymZones: [],
  trainers: []
};

const DialogData: UseEventDialogResult = {
  eventTemplates: [
    {
      id: 4,
      name: 'Template',
      type: { id: 3, name: 'Type' }
    }
  ],
  eventTypes: [{ id: 3, name: 'Type' }],
  gymZones: [{ id: 1, name: 'Gym zone' }],
  trainers: [{ id: 2, firstName: 'Trainer', lastName: 'Name' }]
} as any;

describe('<CalendarEventDialog />', () => {
  describe('open', () => {
    it('it should not render if not open', () => {
      render(<MockComponent dialogData={EmptyDialogData} open={false} />);

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('should render if open', async () => {
      await act(async () => {
        render(<MockComponent dialogData={EmptyDialogData} open />);
      });

      expect(screen.queryByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('Create an event')).toBeInTheDocument();
      expect(screen.queryByText('Save')).not.toBeInTheDocument();
    });
  });

  describe('form', () => {
    it('should render the event form', async () => {
      await act(async () => {
        render(<MockComponent dialogData={{}} open />);
      });

      expect(screen.getByText('Calendar event name')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('New name')).toBeInTheDocument();
      expect(screen.getByText('Description')).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText('New calendar event description')
      ).toBeInTheDocument();
      expect(screen.getByText('Gym zone')).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText('Select a gym zone')
      ).toBeInTheDocument();
      expect(screen.getByText('Trainer')).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText('Select a trainer')
      ).toBeInTheDocument();
      expect(screen.getByText('Template (optional)')).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText('Select a template')
      ).toBeInTheDocument();
      expect(screen.getByText('Template (optional)')).toBeInTheDocument();
      expect(screen.getByText('Date')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('dd/mm/yyyy')).toBeInTheDocument();
      expect(screen.getByText('Properties')).toBeInTheDocument();
      expect(
        screen.getByTitle('calendar-event-mask-required')
      ).toBeInTheDocument();
      expect(
        screen.getByTitle('calendar-event-covid-passport')
      ).toBeInTheDocument();
      expect(screen.getByText('Start time')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('09:00')).toBeInTheDocument();
      expect(screen.getByText('End time')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('10:00')).toBeInTheDocument();
      expect(screen.getByText('Capacity')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('200')).toBeInTheDocument();
      expect(screen.getByText('Event type')).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText('Select an event type')
      ).toBeInTheDocument();
      expect(screen.getByText('Difficulty')).toBeInTheDocument();
      expect(
        screen.getByTitle('calendar-event-difficulty')
      ).toBeInTheDocument();
    });

    it('should render with the default values', async () => {
      const defaultValues: Partial<CalendarEventFormFields> = {
        name: 'Name',
        description: 'Calendar event description',
        gymZone: 1,
        trainer: 2,
        template: '',
        startTime: '10:00',
        endTime: '10:30',
        maskRequired: false,
        covidPassport: false,
        capacity: 25,
        type: 3,
        difficulty: 2
      };

      await act(async () => {
        render(
          <MockComponent
            dialogData={DialogData}
            defaultValues={defaultValues}
            open
          />
        );
      });

      expect(screen.getByPlaceholderText('New name')).toHaveValue(
        defaultValues.name
      );
      expect(
        screen.getByPlaceholderText('New calendar event description')
      ).toHaveValue(defaultValues.description);
      expect(screen.getByPlaceholderText('Select a gym zone')).toHaveValue(
        `${defaultValues.gymZone}`
      );
      expect(screen.getByPlaceholderText('Select a trainer')).toHaveValue(
        `${defaultValues.trainer}`
      );
      expect(screen.getByPlaceholderText('Select a template')).toHaveValue('');
      expect(screen.getByPlaceholderText('dd/mm/yyyy')).toHaveValue(
        '29/06/2022'
      );
      expect(
        screen.getByTitle('calendar-event-mask-required').firstChild
      ).not.toBeChecked();
      expect(
        screen.getByTitle('calendar-event-covid-passport').firstChild
      ).not.toBeChecked();
      expect(screen.getByPlaceholderText('09:00')).toHaveValue('10:00');
      expect(screen.getByPlaceholderText('10:00')).toHaveValue('10:30');
      expect(screen.getByPlaceholderText('200')).toHaveValue(25);
      expect(screen.getByPlaceholderText('Select an event type')).toHaveValue(
        `${defaultValues.type}`
      );
    });

    it('should call onSubmit if all fields are valid', async () => {
      const onSubmitSpy = jest.fn();

      await act(async () => {
        render(
          <MockComponent dialogData={DialogData} onSubmit={onSubmitSpy} open />
        );
      });

      await act(async () => {
        fireEvent.input(screen.getByPlaceholderText('New name'), {
          target: { name: 'name', value: 'Name' }
        });
        fireEvent.input(
          screen.getByPlaceholderText('New calendar event description'),
          {
            target: { name: 'description', value: 'Calendar event description' }
          }
        );
        fireEvent.input(screen.getByPlaceholderText('200'), {
          target: { name: 'capacity', value: '25' }
        });
        userEvent.type(screen.getByPlaceholderText('09:00'), '11:00');
        userEvent.type(screen.getByPlaceholderText('10:00'), '12:00');
      });
      await act(async () => {
        userEvent.click(screen.getByText('Save'));
      });

      expect(onSubmitSpy).toHaveBeenCalledTimes(1);
      expect(onSubmitSpy).toHaveBeenCalledWith({
        name: 'Name',
        description: 'Calendar event description',
        gymZone: 1,
        trainer: 2,
        template: '',
        date: new Date(),
        capacity: 25,
        maskRequired: true,
        covidPassport: true,
        startTime: '11:00',
        endTime: '12:00',
        type: 3,
        difficulty: 3
      });
    });
  });
});
