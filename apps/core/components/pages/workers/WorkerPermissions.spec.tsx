import { render } from '@testing-library/react';
import WorkerPermissions from './WorkerPermissions';

const worker = {
  updateVirtualGyms: true,
  createGymZones: true,
  updateGymZones: true,
  deleteGymZones: true,
  createTrainers: true,
  updateTrainers: true,
  deleteTrainers: true,
  createClients: true,
  updateClients: true,
  deleteClients: true,
  createEventTypes: true,
  updateEventTypes: true,
  deleteEventTypes: true,
  createEventTemplates: true,
  updateEventTemplates: true,
  deleteEventTemplates: true,
  createEvents: true,
  updateEvents: true,
  deleteEvents: true,
  createEventAppointments: true,
  updateEventAppointments: true,
  deleteEventAppointments: true,
  createCalendarAppointments: true,
  updateCalendarAppointments: true,
  deleteCalendarAppointments: true
};

describe('<WorkerPermissions />', () => {
  it('should render properly', () => {
    const utils = render(<WorkerPermissions worker={worker as any} />);

    expect(utils.getByText('Virtual gyms')).toBeInTheDocument();
    expect(utils.getByText('Gym zones')).toBeInTheDocument();
    expect(utils.getByText('Trainers')).toBeInTheDocument();
    expect(utils.getByText('Clients')).toBeInTheDocument();
    expect(utils.getByText('Event types')).toBeInTheDocument();
    expect(utils.getByText('Event templates')).toBeInTheDocument();
    expect(utils.getByText('Events')).toBeInTheDocument();
    expect(utils.getByText('Event appointments')).toBeInTheDocument();
    expect(utils.getByText('Calendar appointments')).toBeInTheDocument();
  });
});
