import { FormProvider, useForm } from 'react-hook-form';

import { render, screen } from '@testing-library/react';

import { ClientFormFields } from '../../types';
import ClientPermissions from './WorkerPermissions';

const Component = () => (
  <FormProvider {...useForm<ClientFormFields>()}>
    <ClientPermissions />
  </FormProvider>
);

describe('<WorkerPermissions />', () => {
  it('should render properly', () => {
    const { container } = render(<Component />);

    expect(container).toBeInTheDocument();

    expect(screen.getByText('Virtual gyms')).toBeInTheDocument();
    expect(screen.getByTitle('worker-updateVirtualGyms')).toBeInTheDocument();

    expect(screen.getByText('Gym zones')).toBeInTheDocument();
    expect(screen.getByTitle('worker-createGymZones')).toBeInTheDocument();
    expect(screen.getByTitle('worker-updateGymZones')).toBeInTheDocument();
    expect(screen.getByTitle('worker-deleteGymZones')).toBeInTheDocument();

    expect(screen.getByText('Trainers')).toBeInTheDocument();
    expect(screen.getByTitle('worker-createTrainers')).toBeInTheDocument();
    expect(screen.getByTitle('worker-updateTrainers')).toBeInTheDocument();
    expect(screen.getByTitle('worker-deleteTrainers')).toBeInTheDocument();

    expect(screen.getByText('Trainer tags')).toBeInTheDocument();
    expect(screen.getByTitle('worker-createTags')).toBeInTheDocument();
    expect(screen.getByTitle('worker-updateTags')).toBeInTheDocument();
    expect(screen.getByTitle('worker-deleteTags')).toBeInTheDocument();

    expect(screen.getByText('Clients')).toBeInTheDocument();
    expect(screen.getByTitle('worker-createClients')).toBeInTheDocument();
    expect(screen.getByTitle('worker-updateClients')).toBeInTheDocument();
    expect(screen.getByTitle('worker-deleteClients')).toBeInTheDocument();

    expect(screen.getByText('Event types')).toBeInTheDocument();
    expect(screen.getByTitle('worker-createEventTypes')).toBeInTheDocument();
    expect(screen.getByTitle('worker-updateEventTypes')).toBeInTheDocument();
    expect(screen.getByTitle('worker-deleteEventTypes')).toBeInTheDocument();

    expect(screen.getByText('Event templates')).toBeInTheDocument();
    expect(
      screen.getByTitle('worker-createEventTemplates')
    ).toBeInTheDocument();
    expect(
      screen.getByTitle('worker-updateEventTemplates')
    ).toBeInTheDocument();
    expect(
      screen.getByTitle('worker-deleteEventTemplates')
    ).toBeInTheDocument();

    expect(screen.getByText('Events')).toBeInTheDocument();
    expect(screen.getByTitle('worker-createEvents')).toBeInTheDocument();
    expect(screen.getByTitle('worker-updateEvents')).toBeInTheDocument();
    expect(screen.getByTitle('worker-deleteEvents')).toBeInTheDocument();

    expect(screen.getByText('Event appointments')).toBeInTheDocument();
    expect(
      screen.getByTitle('worker-createEventAppointments')
    ).toBeInTheDocument();
    expect(
      screen.getByTitle('worker-updateEventAppointments')
    ).toBeInTheDocument();
    expect(
      screen.getByTitle('worker-deleteEventAppointments')
    ).toBeInTheDocument();

    expect(screen.getByText('Calendar appointments')).toBeInTheDocument();
    expect(
      screen.getByTitle('worker-createCalendarAppointments')
    ).toBeInTheDocument();
    expect(
      screen.getByTitle('worker-updateCalendarAppointments')
    ).toBeInTheDocument();
    expect(
      screen.getByTitle('worker-deleteCalendarAppointments')
    ).toBeInTheDocument();
  });
});
