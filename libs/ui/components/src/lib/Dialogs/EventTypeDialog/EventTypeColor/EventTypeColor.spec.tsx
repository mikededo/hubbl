import { FormProvider, useForm } from 'react-hook-form';

import { AppPalette } from '@hubbl/shared/types';
import { render, screen } from '@testing-library/react';

import { EventTypeFormFields } from '../../types';
import EventTypeColor from './EventTypeColor';

const Component = () => (
  <FormProvider {...useForm<EventTypeFormFields>()}>
    <EventTypeColor />
  </FormProvider>
);

describe('<EventTypeColor />', () => {
  it('should render properly', () => {
    const { container } = render(<Component />);

    expect(container).toBeInTheDocument();
    expect(screen.getByText('Event type color')).toBeInTheDocument();
    Object.values(AppPalette).forEach((color) => {
      expect(screen.getByTitle(color)).toBeInTheDocument();
    });
  });
});
