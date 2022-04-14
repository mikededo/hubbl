import { FormProvider, useForm } from 'react-hook-form';

import { act, fireEvent, render, screen } from '@testing-library/react';

import { CalendarEventFormFields } from '../../types';
import CalendarEventTemplate from './CalendarEventTemplate';
import { createTheme, ThemeProvider } from '@mui/material';
import { EventTemplateDTO } from '@hubbl/shared/models/dto';

const MockComponent = ({
  defaultValues,
  eventTemplates,
  setValueSpy = undefined
}: {
  defaultValues?: Partial<CalendarEventFormFields>;
  eventTemplates?: Partial<EventTemplateDTO>[];
  setValueSpy?: () => void;
}) => {
  const { control, ...rest } = useForm<CalendarEventFormFields>({
    defaultValues: { template: defaultValues?.template ?? '' }
  });

  if (setValueSpy) {
    rest.setValue = setValueSpy;
  }

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

  it('should display the templates on clicking the select', () => {
    render(
      <MockComponent
        eventTemplates={
          [
            { id: 1, name: 'EventTemplateOne', type: { id: 1 } },
            { id: 2, name: 'EventTemplateTwo', type: { id: 1 } },
            { id: 3, name: 'EventTemplateThree', type: { id: 1 } },
            { id: 4, name: 'EventTemplateFour', type: { id: 1 } }
          ] as any
        }
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

  it('should not reset values if selected template does not exist', async () => {
    const MockComponent = ({
      setValueSpy,
      watchSpy
    }: {
      setValueSpy: any;
      watchSpy: any;
    }) => {
      const { control, ...rest } = useForm<CalendarEventFormFields>({
        defaultValues: { template: 1 }
      });

      rest.setValue = setValueSpy;
      rest.watch = watchSpy;

      return (
        <ThemeProvider theme={createTheme()}>
          <FormProvider {...{ control, ...rest }}>
            <CalendarEventTemplate templates={[]} />
          </FormProvider>
        </ThemeProvider>
      );
    };

    const setValueSpy = jest.fn();
    const watchSpy = jest.fn().mockReturnValue(1);

    await act(async () => {
      render(<MockComponent setValueSpy={setValueSpy} watchSpy={watchSpy} />);
    });

    expect(watchSpy).toHaveBeenCalledWith('template');
    expect(setValueSpy).not.toHaveBeenCalled();
  });

  describe('defaultValues', () => {
    it('should use default value', () => {
      const setValueSpy = jest.fn();

      render(
        <MockComponent
          defaultValues={{ template: 2 }}
          eventTemplates={
            [
              { id: 1, name: 'EventTemplateOne', type: { id: 1 } },
              {
                id: 2,
                name: 'EventTemplateTwo',
                description: 'Event template description',
                maskRequired: true,
                covidPassport: true,
                capacity: 25,
                difficulty: 4,
                type: { id: 1 }
              }
            ] as any
          }
          setValueSpy={setValueSpy}
        />
      );

      expect(screen.getByText('EventTemplateTwo')).toBeInTheDocument();
      expect(setValueSpy).toHaveBeenCalledTimes(7);

      expect(setValueSpy).toHaveBeenNthCalledWith(
        1,
        'name',
        'EventTemplateTwo'
      );
      expect(setValueSpy).toHaveBeenNthCalledWith(
        2,
        'description',
        'Event template description'
      );
      expect(setValueSpy).toHaveBeenNthCalledWith(3, 'capacity', 25);
      expect(setValueSpy).toHaveBeenNthCalledWith(4, 'maskRequired', true);
      expect(setValueSpy).toHaveBeenNthCalledWith(5, 'covidPassport', true);
      expect(setValueSpy).toHaveBeenNthCalledWith(6, 'type', 1);
      expect(setValueSpy).toHaveBeenNthCalledWith(7, 'difficulty', 4);
    });
  });

  describe('disabled', () => {
    it('should disable the field', () => {
      render(<MockComponent />);

      expect(screen.getByPlaceholderText('Select a template')).toBeDisabled();
    });
  });
});
