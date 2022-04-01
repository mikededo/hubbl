import { FormProvider, useForm } from 'react-hook-form';

import { render, screen } from '@testing-library/react';

import { EventTypeFormFields } from '../../types';
import EventTypeDescription from './EventTypeDescription';

const Component = () => (
  <FormProvider {...useForm<EventTypeFormFields>()}>
    <EventTypeDescription />
  </FormProvider>
);

describe('<EventTypeDescription />', () => {
  it('should render properly', () => {
    const { container } = render(<Component />);

    expect(container).toBeInTheDocument();
    expect(screen.getByTitle('event-type-description')).toBeInTheDocument();
  });
});
