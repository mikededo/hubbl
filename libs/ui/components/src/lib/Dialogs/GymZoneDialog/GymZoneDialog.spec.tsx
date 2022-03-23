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

import { GymZoneFormFields } from '../types';
import GymZoneDialog from './GymZoneDialog';

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
  defaultValues?: GymZoneFormFields;
  open: boolean;
  onSubmit?: any;
}) => (
  <AppProvider>
    <ThemeProvider theme={createTheme()}>
      <ToastContext>
        <GymZoneDialog
          title="Create gym zone"
          defaultValues={defaultValues}
          open={open}
          onSubmit={onSubmit}
        />
      </ToastContext>
    </ThemeProvider>
  </AppProvider>
);

describe('<GymZoneDialog />', () => {
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
      expect(screen.getByText('Create gym zone')).toBeInTheDocument();
      expect(swrSpy).toHaveBeenCalled();
    });
  });

  describe('form', () => {
    it('should render the gym zone form', async () => {
      await act(async () => {
        render(<MockComponent open />);
      });

      expect(screen.getByText('Gym zone name')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('New name')).toBeInTheDocument();
      expect(screen.getByText('Description')).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText('New gym zone description')
      ).toBeInTheDocument();
      expect(screen.getByText('Class zone')).toBeInTheDocument();
      expect(screen.getByTitle('gym-zone-class-type')).toBeInTheDocument();
      expect(screen.getByText('Mask required')).toBeInTheDocument();
      expect(screen.getByTitle('gym-zone-mask-required')).toBeInTheDocument();
      expect(screen.getByText('Covid passport')).toBeInTheDocument();
      expect(screen.getByTitle('gym-zone-covid-passport')).toBeInTheDocument();
      expect(screen.getByText('Capacity')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('200')).toBeInTheDocument();
      expect(screen.getByText('Open time')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('09:00')).toBeInTheDocument();
      expect(screen.getByText('Close time')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('23:00')).toBeInTheDocument();
    });

    it('should render with the default values', async () => {
      const defaultValues: GymZoneFormFields = {
        name: 'Name',
        description: 'Gym zone description',
        isClassType: true,
        maskRequired: false,
        covidPassport: false,
        capacity: 150,
        openTime: '09:00',
        closeTime: '23:00',
        virtualGym: 1
      };

      await act(async () => {
        render(<MockComponent defaultValues={defaultValues} open />);
      });

      expect(screen.getByPlaceholderText('New name')).toHaveValue(
        defaultValues.name
      );
      expect(
        screen.getByPlaceholderText('New gym zone description')
      ).toHaveValue(defaultValues.description);
      expect(screen.getByTitle('gym-zone-class-type').firstChild).toBeChecked();
      expect(
        screen.getByTitle('gym-zone-mask-required').firstChild
      ).not.toBeChecked();
      expect(
        screen.getByTitle('gym-zone-covid-passport').firstChild
      ).not.toBeChecked();
      expect(screen.getByPlaceholderText('09:00')).toHaveValue(
        defaultValues.openTime
      );
      expect(screen.getByPlaceholderText('23:00')).toHaveValue(
        defaultValues.closeTime
      );
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
          screen.getByPlaceholderText('New gym zone description'),
          {
            target: { name: 'description', value: 'Gym description' }
          }
        );
        fireEvent.input(screen.getByPlaceholderText('200'), {
          target: { name: 'capacity', value: '25' }
        });
        userEvent.type(screen.getByPlaceholderText('09:00'), '10:00');
        userEvent.type(screen.getByPlaceholderText('23:00'), '22:00');
      });
      await act(async () => {
        userEvent.click(screen.getByText('Save'));
      });

      expect(onSubmitSpy).toHaveBeenCalledTimes(1);
      expect(onSubmitSpy).toHaveBeenCalledWith({
        name: 'Name',
        description: 'Gym description',
        capacity: 25,
        isClassType: false,
        maskRequired: true,
        covidPassport: true,
        openTime: '10:00',
        closeTime: '22:00',
        virtualGym: 1
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
