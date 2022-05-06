import React from 'react';

import * as swr from 'swr';

import * as ctx from '@hubbl/data-access/contexts';
import {
  AppContextValue,
  AppProvider,
  ToastContext
} from '@hubbl/data-access/contexts';
import { render } from '@testing-library/react';

import {
  OnErrorResult,
  useCalendarEventDialog
} from './useCalendarEventDialog';

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

const Wrapper = ({ children }: { children: React.ReactNode }): JSX.Element => (
  <AppProvider>
    <ToastContext>{children}</ToastContext>
  </AppProvider>
);

describe('useCalendarEventDialog', () => {
  const fetcher = jest.fn();
  const swrSpy = jest.spyOn(swr, 'default');
  const onError = jest.fn();

  beforeEach(() => {
    jest.resetAllMocks();

    (ctx.useAppContext as jest.Mock<AppContextValue>).mockReturnValue({
      token: { parsed: {} },
      API: { fetcher }
    } as any);
    (ctx.useToastContext as jest.Mock).mockReturnValue({ onError });
  });

  const onErrorChecks = () => {
    const Component = (): JSX.Element => {
      const result = useCalendarEventDialog({ virtualGym: 1 });

      expect(result).toStrictEqual(OnErrorResult);

      return <div />;
    };

    render(
      <Wrapper>
        <Component />
      </Wrapper>
    );
  };

  it('should not call fetcher if token is not defined', () => {
    (ctx.useAppContext as jest.Mock<AppContextValue>).mockReturnValue({
      token: {},
      API: { fetcher }
    } as any);
    swrSpy.mockImplementation(() => ({} as any));

    const Component = (): JSX.Element => {
      useCalendarEventDialog({ virtualGym: 1 });

      return <div />;
    };

    render(
      <Wrapper>
        <Component />
      </Wrapper>
    );

    expect(fetcher).not.toHaveBeenCalled();
  });

  it('should not call fetcher if shouldRun is set to false', () => {
    (ctx.useAppContext as jest.Mock<AppContextValue>).mockReturnValue({
      token: {},
      API: { fetcher }
    } as any);
    swrSpy.mockImplementation(() => ({} as any));

    const Component = (): JSX.Element => {
      useCalendarEventDialog({ virtualGym: 1, shouldRun: false });

      return <div />;
    };

    render(
      <Wrapper>
        <Component />
      </Wrapper>
    );

    expect(fetcher).not.toHaveBeenCalled();
  });

  it('should return OnErrorResult if event types fails', () => {
    swrSpy.mockImplementation((key) => {
      if (key === '/event-types') {
        return { error: 'Event types error' } as any;
      }

      return {} as any;
    });

    onErrorChecks();

    expect(onError).toHaveBeenCalledWith('Event types error');
  });

  it('should return OnErrorResult if event templates fails', () => {
    swrSpy.mockImplementation((key) => {
      if (key === '/event-templates') {
        return { error: 'Event templates error' } as any;
      }

      return {} as any;
    });

    onErrorChecks();

    expect(onError).toHaveBeenCalledWith('Event templates error');
  });

  it('should return OnErrorResult if gym zones fails', () => {
    swrSpy.mockImplementation((key) => {
      if (key === '/virtual-gyms/1/gym-zones') {
        return { error: 'Gym zones error' } as any;
      }

      return {} as any;
    });

    onErrorChecks();

    expect(onError).toHaveBeenCalledWith('Gym zones error');
  });

  it('should return OnErrorResult if trainers fails', () => {
    swrSpy.mockImplementation((key) => {
      if (key === '/persons/trainers') {
        return { error: 'Trainers error' } as any;
      }

      return {} as any;
    });

    onErrorChecks();

    expect(onError).toHaveBeenCalledWith('Trainers error');
  });

  it('should return the fetched data', () => {
    swrSpy.mockImplementation(() => ({ data: [] } as any));

    const Component = (): JSX.Element => {
      const result = useCalendarEventDialog({ virtualGym: 1 });

      expect(result).toStrictEqual({
        eventTypes: [],
        eventTemplates: [],
        gymZones: [],
        trainers: []
      });

      return <div />;
    };

    render(
      <Wrapper>
        <Component />
      </Wrapper>
    );
  });
});
