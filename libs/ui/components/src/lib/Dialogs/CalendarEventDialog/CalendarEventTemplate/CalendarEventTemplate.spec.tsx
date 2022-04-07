import { FormProvider, useForm } from 'react-hook-form';

import { fireEvent, render, screen } from '@testing-library/react';

import { CalendarEventFormFields } from '../../types';
import CalendarEventTemplate from './CalendarEventTemplate';
import { createTheme, ThemeProvider } from '@mui/material';
import { EventTemplateDTO } from '@hubbl/shared/models/dto';

const MockComponent = ({
  defaultValues,
  eventTemplates
}: {
  defaultValues?: Partial<CalendarEventFormFields>;
  eventTemplates?: Partial<EventTemplateDTO>[];
}) => {
  const { control, ...rest } = useForm<CalendarEventFormFields>({
    defaultValues: { template: defaultValues?.template ?? '' }
  });

  return (
    <ThemeProvider theme={createTheme()}>
      <FormProvider {...{ control, ...rest }}>
        <CalendarEventTemplate templates={eventTemplates as any} />
      </FormProvider>
    </ThemeProvider>
  );
};

describe('<CalendarEventTemplate />', () => {
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
        eventTemplates={[
          { id: 1, name: 'EventTemplateOne' },
          { id: 2, name: 'EventTemplateTwo' },
          { id: 3, name: 'EventTemplateThree' },
          { id: 4, name: 'EventTemplateFour' }
        ]}
      />
    );
    fireEvent.mouseDown(screen.getByRole('button'));

    expect(
      screen.getByRole('option', { name: 'EventTemplateOne' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('option', { name: 'EventTemplateTwo' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('option', { name: 'EventTemplateThree' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('option', { name: 'EventTemplateFour' })
    ).toBeInTheDocument();
  });

  describe('defaultValues', () => {
    it('should use default value', () => {
      render(
        <MockComponent
          defaultValues={{ template: 2 }}
          eventTemplates={[
            { id: 1, name: 'EventTemplateOne' },
            { id: 2, name: 'EventTemplateTwo' }
          ]}
        />
      );

      expect(screen.getByText('EventTemplateTwo')).toBeInTheDocument();
    });
  });

  describe('disabled', () => {
    it('should disable the field', () => {
      render(<MockComponent />);

      expect(screen.getByPlaceholderText('Select a template')).toBeDisabled();
    });
  });
});
