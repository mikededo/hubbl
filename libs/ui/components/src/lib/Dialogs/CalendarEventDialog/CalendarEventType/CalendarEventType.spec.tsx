import { FormProvider, useForm } from 'react-hook-form';

import { EventTypeDTO } from '@hubbl/shared/models/dto';
import { createTheme, ThemeProvider } from '@mui/material';
import { fireEvent, render, screen } from '@testing-library/react';

import { CalendarEventFormFields } from '../../types';
import CalendarEventType from './CalendarEventType';

const MockComponent = ({
  defaultValues,
  eventTypes
}: {
  defaultValues?: Partial<CalendarEventFormFields>;
  eventTypes?: Partial<EventTypeDTO>[];
}) => {
  const { control, ...rest } = useForm<CalendarEventFormFields>({
    defaultValues: { type: defaultValues?.type ?? '' }
  });

  return (
    <ThemeProvider theme={createTheme()}>
      <FormProvider {...{ control, ...rest }}>
        <CalendarEventType eventTypes={eventTypes as any} />
      </FormProvider>
    </ThemeProvider>
  );
};

describe('<CalendarEventType />', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should render properly', () => {
    const { container } = render(<MockComponent />);

    expect(container).toBeInTheDocument();
  });

  it('should display the event types on clicking the select', () => {
    render(
      <MockComponent
        eventTypes={[
          { id: 1, name: 'EventTypeOne' },
          { id: 2, name: 'EventTypeTwo' },
          { id: 3, name: 'EventTypeThree' },
          { id: 4, name: 'EventTypeFour' }
        ]}
      />
    );
    fireEvent.mouseDown(screen.getByRole('button'));

    expect(screen.getByRole('option', { name: 'EventTypeOne' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'EventTypeTwo' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'EventTypeThree' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'EventTypeFour' })).toBeInTheDocument();
  });

  describe('defaultValues', () => {
    it('should use default value', () => {
      render(
        <MockComponent
          defaultValues={{ type: 2 }}
          eventTypes={[
            { id: 1, name: 'EventTypeOne' },
            { id: 2, name: 'EventTypeTwo' }
          ]}
        />
      );

      expect(screen.getByText('EventTypeTwo')).toBeInTheDocument();
    });
  });

  describe('disabled', () => {
    it('should disable the field', () => {
      render(<MockComponent />);

      expect(
        screen.getByPlaceholderText('Select an event type')
      ).toBeDisabled();
    });
  });
});
