import { FormProvider, useForm } from 'react-hook-form';

import { fireEvent, render, screen } from '@testing-library/react';

import { CalendarEventFormFields } from '../../types';
import CalendarEventTrainer from './CalendarEventTrainer';
import { createTheme, ThemeProvider } from '@mui/material';
import { TrainerDTO } from '@hubbl/shared/models/dto';

const MockComponent = ({
  defaultValues,
  trainers
}: {
  defaultValues?: Partial<CalendarEventFormFields>;
  trainers?: Partial<TrainerDTO<number>>[];
}) => {
  const { control, ...rest } = useForm<CalendarEventFormFields>({
    defaultValues: { trainer: defaultValues?.trainer ?? '' }
  });

  return (
    <ThemeProvider theme={createTheme()}>
      <FormProvider {...{ control, ...rest }}>
        <CalendarEventTrainer trainers={trainers as any} />
      </FormProvider>
    </ThemeProvider>
  );
};

describe('<CalendarEventTrainer />', () => {
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
        trainers={[
          { id: 1, firstName: 'Trainer', lastName: 'One' },
          { id: 2, firstName: 'Trainer', lastName: 'Two' },
          { id: 3, firstName: 'Trainer', lastName: 'Three' },
          { id: 4, firstName: 'Trainer', lastName: 'Four' }
        ]}
      />
    );
    fireEvent.mouseDown(screen.getByRole('button'));

    expect(
      screen.getByRole('option', { name: 'Trainer One' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('option', { name: 'Trainer Two' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('option', { name: 'Trainer Three' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('option', { name: 'Trainer Four' })
    ).toBeInTheDocument();
  });

  describe('defaultValues', () => {
    it('should use default value', () => {
      render(
        <MockComponent
          defaultValues={{ trainer: 2 }}
          trainers={[
            { id: 1, firstName: 'Trainer', lastName: 'One' },
            { id: 2, firstName: 'Trainer', lastName: 'Two' }
          ]}
        />
      );

      expect(screen.getByText('Trainer Two')).toBeInTheDocument();
    });
  });

  describe('disabled', () => {
    it('should disable the field', () => {
      render(<MockComponent />);

      expect(screen.getByPlaceholderText('Select a trainer')).toBeDisabled();
    });
  });
});
