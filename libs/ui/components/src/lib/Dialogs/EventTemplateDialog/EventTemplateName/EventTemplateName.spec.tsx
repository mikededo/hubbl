import { FormProvider, useForm } from 'react-hook-form';

import { render, screen } from '@testing-library/react';

import { EventTemplateFormFields } from '../../types';
import EventTemplateName from './EventTemplateName';

const Component = () => (
  <FormProvider {...useForm<EventTemplateFormFields>()}>
    <EventTemplateName />
  </FormProvider>
);

describe('<EventTemplateName />', () => {
  it('should render properly', () => {
    const { container } = render(<Component />);

    expect(container).toBeInTheDocument();
    expect(screen.getByTitle('event-template-name')).toBeInTheDocument();
  });
});
