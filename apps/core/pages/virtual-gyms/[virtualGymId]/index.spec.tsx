import * as swr from 'swr';

import * as ctx from '@hubbl/data-access/contexts';
import {
  AppProvider,
  LoadingContext,
  ToastContext
} from '@hubbl/data-access/contexts';
import { createTheme, ThemeProvider } from '@mui/material';
import { act, fireEvent, render, screen } from '@testing-library/react';

import VirtualGym from './index';
import userEvent from '@testing-library/user-event';

jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '',
      query: { virtualGymId: 1 },
      asPath: '',
      push: jest.fn(),
      events: { on: jest.fn(), off: jest.fn() },
      beforePopState: jest.fn(() => null),
      prefetch: jest.fn(() => null)
    };
  }
}));

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

const virtualGymResponse = {
  data: {
    id: 1,
    name: 'VirtualGymOne',
    gymZones: [
      { id: 1, name: 'GymZoneOne', isClassType: false },
      { id: 2, name: 'GymZoneTwo', isClassType: true },
      { id: 3, name: 'GymZoneThree', isClassType: true },
      { id: 4, name: 'GymZoneFour', isClassType: false },
      { id: 5, name: 'GymZoneFive', isClassType: false },
      { id: 6, name: 'GymZoneSix', isClassType: true }
    ]
  },
  error: null
};

const virtualGymsResponse = {
  data: [
    { id: 1, name: 'VirtualGymOne' },
    { id: 1, name: 'VirtualGymTwo' },
    { id: 1, name: 'VirtualGymThree' },
    { id: 1, name: 'VirtualGymFour' }
  ],
  error: null
};

const renderPage = () =>
  render(
    <AppProvider>
      <LoadingContext>
        <ThemeProvider theme={createTheme()}>
          <ToastContext>
            <VirtualGym />
          </ToastContext>
        </ThemeProvider>
      </LoadingContext>
    </AppProvider>
  );

describe('Virtual gym page', () => {
  const fetcher = jest.fn();
  const poster = jest.fn();

  const swrSpy = jest.spyOn(swr, 'default');
  const mutateSpy = jest.fn();

  const onErrorSpy = jest.fn();
  const onSuccessSpy = jest.fn();

  beforeEach(() => {
    jest.resetAllMocks();

    const pop = jest.fn();
    const push = jest.fn();

    (ctx.useAppContext as jest.Mock).mockReturnValue({
      user: { gym: { id: 1 } },
      token: { parsed: {} },
      API: { fetcher, poster }
    } as any);
    (ctx.useToastContext as jest.Mock).mockReturnValue({
      onError: onErrorSpy,
      onSuccess: onSuccessSpy
    });
    (ctx.useLoadingContext as jest.Mock).mockReturnValue({
      loading: false,
      onPopLoading: pop,
      onPushLoading: push
    });
    swrSpy.mockImplementation((key) => {
      if (key === '/virtual-gyms/1') {
        return { ...virtualGymResponse, mutate: mutateSpy } as any;
      } else if (key === '/virtual-gyms?level=0') {
        // Fetch called inside gym zones dialog
        return virtualGymsResponse as any;
      } else if (key === '/virtual-gyms/1/gym-zones') {
        // Posting a new gym zone
        return { ...virtualGymResponse.data[0], id: 10 };
      }

      return {};
    });
  });

  const fillGymZoneForm = async () => {
    // Fill the form
    await act(async () => {
      fireEvent.input(screen.getByPlaceholderText('New name'), {
        target: { name: 'name', value: 'Name' }
      });
      fireEvent.input(screen.getByPlaceholderText('New gym zone description'), {
        target: { name: 'description', value: 'Gym description' }
      });
      fireEvent.input(screen.getByPlaceholderText('200'), {
        target: { name: 'capacity', value: '25' }
      });
      userEvent.type(screen.getByPlaceholderText('09:00'), '10:00');
      userEvent.type(screen.getByPlaceholderText('23:00'), '22:00');
    });
    await act(async () => {
      userEvent.click(screen.getByText('Save'));
    });
  };

  const postGymZone = async (isClassType: boolean) => {
    poster.mockResolvedValueOnce({
      ...virtualGymResponse.data.gymZones[0],
      id: 10
    });

    await act(async () => {
      renderPage();
    });
    await act(async () => {
      fireEvent.click(
        screen.getByTitle(`add-${isClassType ? '' : 'non-'}class-gym-zone`)
      );
    });

    await fillGymZoneForm();

    expect(poster).toHaveBeenCalledTimes(1);
    expect(poster).toHaveBeenCalledWith(`/virtual-gyms/1/gym-zones`, {
      name: 'Name',
      description: 'Gym description',
      capacity: 25,
      isClassType,
      maskRequired: true,
      covidPassport: true,
      openTime: '10:00',
      closeTime: '22:00',
      virtualGym: 1,
      gym: 1
    });
    expect(mutateSpy).toHaveBeenCalledTimes(1);
    expect(mutateSpy).toHaveBeenCalledWith(
      {
        ...virtualGymResponse.data,
        gymZones: [
          ...virtualGymResponse.data.gymZones,
          { ...virtualGymResponse.data.gymZones[0], id: 10 }
        ]
      },
      false
    );
    expect(onSuccessSpy).toHaveBeenCalledTimes(1);
    expect(onSuccessSpy).toHaveBeenCalledWith('Gym zone created!');
  };

  it('should have the getLayout prop defined', () => {
    expect(VirtualGym.getLayout).toBeDefined();

    const { container } = render(
      <ThemeProvider theme={createTheme()}>
        {VirtualGym.getLayout(<div />)}
      </ThemeProvider>
    );
    expect(container).toBeInTheDocument();
  });

  it('should not call fetcher if token is null', async () => {
    (ctx.useAppContext as jest.Mock).mockReturnValue({
      token: { parsed: undefined },
      API: { fetcher }
    });
    swrSpy.mockImplementation(() => ({} as any));

    await act(async () => {
      renderPage();
    });

    expect(fetcher).not.toHaveBeenCalled();
  });

  it('should render the list of virtual gyms', async () => {
    await act(async () => {
      renderPage();
    });

    // Find gym zones
    virtualGymResponse.data.gymZones.forEach(({ name }) => {
      expect(screen.getByText(name.toUpperCase())).toBeInTheDocument();
    });
    // Find add buttons
    expect(screen.getAllByTitle('add-class-gym-zone').length).toBe(1);
    expect(screen.getAllByTitle('add-non-class-gym-zone').length).toBe(1);
  });

  it('should call onError if fetcher returns an error', async () => {
    swrSpy
      .mockClear()
      .mockImplementation(
        () => ({ data: undefined, error: 'Data error' } as any)
      );

    await act(async () => {
      renderPage();
    });

    expect(onErrorSpy).toHaveBeenCalled();
    expect(onErrorSpy).toHaveBeenCalledWith('Data error');
  });

  it("should call onPopLoading if data has been fetched and it's loading", async () => {
    const onPopLoadingSpy = jest.fn();
    (ctx.useLoadingContext as jest.Mock).mockReturnValue({
      onPopLoading: onPopLoadingSpy,
      loading: true
    });

    await act(async () => {
      renderPage();
    });

    expect(onPopLoadingSpy).toHaveBeenCalledTimes(1);
  });

  it('should open the gym zone dialog with checked class type', async () => {
    await act(async () => {
      renderPage();
    });
    await act(async () => {
      fireEvent.click(screen.getByTitle('add-class-gym-zone'));
    });

    expect(
      (await screen.findByTitle('gym-zone-class-type')).firstChild
    ).toBeChecked();

    await act(async () => {
      fireEvent.click(screen.getByTitle('close-dialog'));
    });
  });

  it('should open the gym zone dialog with unchecked class type', async () => {
    await act(async () => {
      renderPage();
    });
    await act(async () => {
      fireEvent.click(screen.getByTitle('add-non-class-gym-zone'));
    });

    expect(
      screen.getByTitle('gym-zone-class-type').firstChild
    ).not.toBeChecked();

    await act(async () => {
      fireEvent.click(screen.getByTitle('close-dialog'));
    });
  });

  it('should post a new class gym zone', async () => {
    await postGymZone(true);
  });

  it('should post a new non class gym zone', async () => {
    await postGymZone(false);
  });

  it('should call onError if gym zone creation fails', async () => {
    poster.mockClear().mockRejectedValue('Error thrown');

    await act(async () => {
      renderPage();
    });
    await act(async () => {
      fireEvent.click(screen.getByTitle('add-class-gym-zone'));
    });

    await fillGymZoneForm();

    expect(poster).toHaveBeenCalledTimes(1);
    expect(mutateSpy).toHaveBeenCalledTimes(0);
    expect(onErrorSpy).toHaveBeenCalledTimes(1);
    expect(onErrorSpy).toHaveBeenCalledWith('Error thrown');
  });
});
