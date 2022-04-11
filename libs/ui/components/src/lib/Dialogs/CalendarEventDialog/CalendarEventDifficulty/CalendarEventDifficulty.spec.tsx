import { FormProvider, useForm } from 'react-hook-form';

import { render, screen } from '@testing-library/react';

import { EventTemplateFormFields } from '../../types';
import CalendarEventDifficulty from './CalendarEventDifficulty';

const Component = () => (
  <FormProvider {...useForm<EventTemplateFormFields>()}>
    <CalendarEventDifficulty />
  </FormProvider>
);

describe('<CalendarEventDifficulty />', () => {
  it('should find data index', () => {
    render(<Component />);

    expect(screen.getByText('Difficulty')).toBeInTheDocument();
    expect(screen.getByRole('slider')).toBeInTheDocument();
    expect(screen.getByTitle('calendar-event-difficulty')).toBeInTheDocument();
  });
});
