import { FormProvider, useForm } from 'react-hook-form';

import { render, screen } from '@testing-library/react';

import { EventTemplateFormFields } from '../../types';
import EventTemplateLocation from './EventTemplateProperties';

const Component = () => (
  <FormProvider {...useForm<EventTemplateFormFields>()}>
    <EventTemplateLocation />
  </FormProvider>
);

describe('<EventTemplateLocation />', () => {
  it('should render properly', () => {
    const { container } = render(<Component />);

    expect(container).toBeInTheDocument();
    expect(screen.getByTitle('event-template-mask-required')).toBeInTheDocument();
    expect(screen.getByTitle('event-template-covid-passport')).toBeInTheDocument();
  });
});
