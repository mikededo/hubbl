import * as swr from 'swr';

import * as ctx from '@hubbl/data-access/contexts';
import { AppProvider } from '@hubbl/data-access/contexts';
import { GymZoneIntervals } from '@hubbl/shared/types';
import { act, render, screen } from '@testing-library/react';

import { CalendarAppointmentFormFields } from '../types';
import CalendarAppointmentDialog from './CalendarAppointmentDialog';
import userEvent from '@testing-library/user-event';

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

const times = [
  '09:00:00',
  '09:15:00',
  '09:30:00',
  '09:45:00',
  '10:00:00',
  '10:15:00',
  '10:30:00',
  '10:45:00',
  '11:00:00',
  '11:15:00',
  '11:30:00',
  '11:45:00'
];

const MockComponent = ({
  defaultValues = {},
  open,
  onSubmit
}: {
  defaultValues?: Partial<CalendarAppointmentFormFields>;
  open: boolean;
  onSubmit?: any;
}) => (
  <AppProvider>
    <CalendarAppointmentDialog
      open={open}
      calendar={1}
      title="Create an appointment"
      defaultValues={defaultValues}
      onSubmit={onSubmit}
    />
  </AppProvider>
);

describe('<CalendarAppointmentDialog />', () => {
  const fetcher = jest.fn();

  const swrSpy = jest.spyOn(swr, 'default');

  beforeEach(() => {
    jest.clearAllMocks();

    (ctx.useAppContext as jest.Mock).mockReturnValue({
      token: { parsed: {} },
      API: { fetcher }
    });
    swrSpy.mockReturnValue({ data: times } as any);
  });

  it('should not all fethc if no token', async () => {
    (ctx.useAppContext as jest.Mock).mockReturnValue({
      token: { parsed: undefined },
      API: { fetcher }
    });

    render(<MockComponent open />);

    expect(fetcher).not.toHaveBeenCalled();
  });

  describe('open', () => {
    it('it should not render if not open', () => {
      render(<MockComponent open={false} />);

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      expect(fetcher).not.toHaveBeenCalled();
    });

    it('should render if open', async () => {
      swrSpy.mockReturnValue({} as any);
      await act(async () => {
        render(<MockComponent open />);
      });

      expect(screen.queryByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('Create an appointment')).toBeInTheDocument();
      expect(screen.queryByText('Create')).toBeInTheDocument();
      expect(
        screen.getByText(
          'Choose the date of the appointment you want to create. ' +
            'Select the interval of your workout, to finally select the start of your workout!'
        )
      );
    });
  });

  describe('form', () => {
    it('should render the appointment form', async () => {
      await act(async () => {
        render(<MockComponent open />);
      });

      expect(screen.getByText('Date')).toBeInTheDocument();
      expect(
        screen.getByTitle('calendar-appointment-date')
      ).toBeInTheDocument();
      expect(screen.getByText('Interval')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('01:00')).toBeInTheDocument();
      expect(screen.getByText('Start time')).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText('Select the start time')
      ).toBeInTheDocument();
      expect(screen.getByText('End time')).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText('Select the end time')
      ).toBeInTheDocument();
    });

    it('should render with the default values', async () => {
      jest.useFakeTimers().setSystemTime(new Date('2022/06/29'));
      await act(async () => {
        render(
          <MockComponent
            defaultValues={{
              startTime: '09:00',
              interval: GymZoneIntervals.HOUR
            }}
            open
          />
        );
      });

      expect(screen.getByPlaceholderText('01:00')).toHaveValue(
        `${GymZoneIntervals.HOUR}`
      );
      expect(screen.getByPlaceholderText('Select the start time')).toHaveValue(
        '09:00'
      );
      expect(screen.getByPlaceholderText('Select the end time')).toHaveValue(
        '10:00'
      );
      expect(screen.getByPlaceholderText('dd/mm/yyyy')).toHaveValue(
        '29/06/2022'
      );
    });

    it('should call onSubmit if all fields are valid', async () => {
      jest.useFakeTimers().setSystemTime(new Date('2022/06/29'));
      const onSubmitSpy = jest.fn();

      await act(async () => {
        render(
          <MockComponent
            defaultValues={{ startTime: '09:00' }}
            onSubmit={onSubmitSpy}
            open
          />
        );
      });
      await act(async () => {
        userEvent.click(screen.getByText('Create'));
      });

      expect(onSubmitSpy).toHaveBeenCalledTimes(1);
      expect(onSubmitSpy).toHaveBeenCalledWith({
        startTime: '09:00',
        endTime: '10:30',
        interval: GymZoneIntervals.HOURTHIRTY,
        date: new Date()
      });
    });
  });
});
