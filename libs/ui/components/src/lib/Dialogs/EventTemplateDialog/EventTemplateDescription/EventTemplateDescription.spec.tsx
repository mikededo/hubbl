import { FormProvider, useForm } from 'react-hook-form';

import { render, screen } from '@testing-library/react';

import { EventTemplateFormFields } from '../../types';
import EventTemplateDescription from './EventTemplateDescription';

const Component = () => (
  <FormProvider {...useForm<EventTemplateFormFields>()}>
    <EventTemplateDescription />
  </FormProvider>
);

describe('<EventTemplateDescription />', () => {
  it('should render properly', () => {
    const { container } = render(<Component />);

    expect(container).toBeInTheDocument();
    expect(screen.getByTitle('event-template-description')).toBeInTheDocument();
  });
});
