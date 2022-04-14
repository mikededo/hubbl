import { FormProvider, useForm } from 'react-hook-form';

import { fireEvent, render, screen } from '@testing-library/react';

import { EventTemplateFormFields } from '../../types';
import EventTemplateType from './EventTemplateType';
import { createTheme, ThemeProvider } from '@mui/material';
import { EventTypeDTO } from '@hubbl/shared/models/dto';

const MockComponent = ({
  defaultValues,
  eventTypes
}: {
  defaultValues?: Partial<EventTemplateFormFields>;
  eventTypes?: Partial<EventTypeDTO>[];
}) => {
  const { control, ...rest } = useForm<EventTemplateFormFields>({
    defaultValues: { eventType: defaultValues?.eventType ?? '' }
  });

  return (
    <ThemeProvider theme={createTheme()}>
      <FormProvider {...{ control, ...rest }}>
        <EventTemplateType eventTypes={eventTypes as any} />
      </FormProvider>
    </ThemeProvider>
  );
};

describe('<EventTemplateType />', () => {
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
          { id: 1, name: 'One' },
          { id: 2, name: 'Two' },
          { id: 3, name: 'Three' },
          { id: 4, name: 'Four' }
        ]}
      />
    );
    fireEvent.mouseDown(screen.getByRole('button'));

    expect(screen.getByRole('option', { name: 'One' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Two' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Three' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Four' })).toBeInTheDocument();
  });

  describe('defaultValues', () => {
    it('should use default value', () => {
      render(
        <MockComponent
          defaultValues={{ eventType: 2 }}
          eventTypes={[
            { id: 1, name: 'One' },
            { id: 2, name: 'Two' }
          ]}
        />
      );

      expect(screen.getByText('Two')).toBeInTheDocument();
    });
  });

  describe('disabled', () => {
    it('should disable the field', () => {
      render(<MockComponent />);

      expect(
        screen.getByPlaceholderText('Select an event type (optional)')
      ).toBeDisabled();
    });
  });
});
