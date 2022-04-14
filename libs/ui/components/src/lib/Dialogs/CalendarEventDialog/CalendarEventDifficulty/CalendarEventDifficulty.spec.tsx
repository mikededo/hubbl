import { FormProvider, useForm } from 'react-hook-form';

import { render, screen } from '@testing-library/react';

import { EventTemplateFormFields } from '../../types';
import CalendarEventDifficulty from './CalendarEventDifficulty';

const Component = ({ watch }: { watch: any }) => (
  <FormProvider {...useForm<EventTemplateFormFields>()}>
    <CalendarEventDifficulty watch={watch as any} />
  </FormProvider>
);

describe('<CalendarEventDifficulty />', () => {
  it('should render properly', () => {
    const watch = () => null;
    render(<Component watch={watch} />);

    expect(screen.getByText('Difficulty')).toBeInTheDocument();
    expect(screen.getByRole('slider')).toBeInTheDocument();
    expect(screen.getByTitle('calendar-event-difficulty')).toBeInTheDocument();
  });

  it('should render disabled', () => {
    const watch = () => 1;
    render(<Component watch={watch} />);

    const element = screen.getByTitle('calendar-event-difficulty');
    expect(
      element.children[element.children.length - 1].firstChild
    ).toBeDisabled();
  });
});
