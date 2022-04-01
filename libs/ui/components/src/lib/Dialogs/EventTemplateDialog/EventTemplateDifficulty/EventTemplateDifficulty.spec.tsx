import { screen, render } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';
import { EventTemplateFormFields } from '../../types';
import EventTemplateDifficulty from './EventTemplateDifficulty';

const Component = () => (
  <FormProvider {...useForm<EventTemplateFormFields>()}>
    <EventTemplateDifficulty />
  </FormProvider>
);

describe('<EventTemplateDifficulty />', () => {
  it('should find data index', () => {
    render(<Component />);

    expect(screen.getByText('Difficulty')).toBeInTheDocument();
    expect(screen.getByRole('slider')).toBeInTheDocument();
    expect(screen.getByTitle('event-template-difficulty')).toBeInTheDocument();
  });
});
