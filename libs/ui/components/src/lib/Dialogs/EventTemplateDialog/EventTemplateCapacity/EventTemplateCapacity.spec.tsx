import { FormProvider, useForm } from 'react-hook-form';

import { render, screen } from '@testing-library/react';

import { EventTemplateFormFields } from '../../types';
import EventTemplateCapacity from './EventTemplateCapacity';

const Component = () => (
  <FormProvider {...useForm<EventTemplateFormFields>()}>
    <EventTemplateCapacity />
  </FormProvider>
);

describe('<EventTemplateCapacity />', () => {
  it('should render properly', () => {
    const { container } = render(<Component />);

    expect(container).toBeInTheDocument();
    expect(screen.getByTitle('event-template-capacity')).toBeInTheDocument();
  });
});
