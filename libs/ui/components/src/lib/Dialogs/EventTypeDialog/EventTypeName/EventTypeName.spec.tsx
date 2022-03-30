import { FormProvider, useForm } from 'react-hook-form';

import { render, screen } from '@testing-library/react';

import { EventTypeFormFields } from '../../types';
import EventTypeName from './EventTypeName';

const Component = () => (
  <FormProvider {...useForm<EventTypeFormFields>()}>
    <EventTypeName />
  </FormProvider>
);

describe('<EventTypeName />', () => {
  it('should render properly', () => {
    const { container } = render(<Component />);

    expect(container).toBeInTheDocument();
    expect(screen.getByTitle('event-type-name')).toBeInTheDocument();
  });
});
