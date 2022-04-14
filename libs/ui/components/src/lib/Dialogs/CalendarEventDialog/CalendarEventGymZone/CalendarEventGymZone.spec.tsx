import { FormProvider, useForm } from 'react-hook-form';

import { fireEvent, render, screen } from '@testing-library/react';

import { CalendarEventFormFields } from '../../types';
import CalendarEventGymZone from './CalendarEventGymZone';
import { createTheme, ThemeProvider } from '@mui/material';
import { GymZoneDTO } from '@hubbl/shared/models/dto';

const MockComponent = ({
  defaultValues,
  gymZones
}: {
  defaultValues?: Partial<CalendarEventFormFields>;
  gymZones?: Partial<GymZoneDTO>[];
}) => {
  const { control, ...rest } = useForm<CalendarEventFormFields>({
    defaultValues: { gymZone: defaultValues?.gymZone ?? '' }
  });

  return (
    <ThemeProvider theme={createTheme()}>
      <FormProvider {...{ control, ...rest }}>
        <CalendarEventGymZone gymZones={gymZones as any} />
      </FormProvider>
    </ThemeProvider>
  );
};

describe('<CalendarEventGymZone />', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should render properly', () => {
    const { container } = render(<MockComponent />);

    expect(container).toBeInTheDocument();
  });

  it('should display the gym zoness on clicking the select', () => {
    render(
      <MockComponent
        gymZones={[
          { id: 1, name: 'GymZoneOne' },
          { id: 2, name: 'GymZoneTwo' },
          { id: 3, name: 'GymZoneThree' },
          { id: 4, name: 'GymZoneFour' }
        ]}
      />
    );
    fireEvent.mouseDown(screen.getByRole('button'));

    expect(screen.getByRole('option', { name: 'GymZoneOne' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'GymZoneTwo' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'GymZoneThree' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'GymZoneFour' })).toBeInTheDocument();
  });

  describe('defaultValues', () => {
    it('should use default value', () => {
      render(
        <MockComponent
          defaultValues={{ gymZone: 2 }}
          gymZones={[
            { id: 1, name: 'GymZoneOne' },
            { id: 2, name: 'GymZoneTwo' }
          ]}
        />
      );

      expect(screen.getByText('GymZoneTwo')).toBeInTheDocument();
    });
  });

  describe('disabled', () => {
    it('should disable the field', () => {
      render(<MockComponent />);

      expect(
        screen.getByPlaceholderText('Select a gym zone')
      ).toBeDisabled();
    });
  });
});
