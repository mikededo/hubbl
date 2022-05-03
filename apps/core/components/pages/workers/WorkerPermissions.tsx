import { WorkerDTO } from '@hubbl/shared/models/dto';

import WorkerPermissionItem from './WorkerPermissionItem';

type WorkerPermissionsProps = {
  worker: WorkerDTO<number>;
};

const WorkerPermissions = ({ worker }: WorkerPermissionsProps): JSX.Element => (
  <>
    <WorkerPermissionItem
      name="Virtual gyms"
      create={false}
      update={worker.updateVirtualGyms}
      remove={false}
    />

    <WorkerPermissionItem
      name="Gym zones"
      create={worker.createGymZones}
      update={worker.updateGymZones}
      remove={worker.deleteGymZones}
    />

    <WorkerPermissionItem
      name="Trainers"
      create={worker.createTrainers}
      update={worker.updateTrainers}
      remove={worker.deleteTrainers}
    />

    <WorkerPermissionItem
      name="Clients"
      create={worker.createClients}
      update={worker.updateClients}
      remove={worker.deleteClients}
    />

    <WorkerPermissionItem
      name="Event types"
      create={worker.createEventTypes}
      update={worker.updateEventTypes}
      remove={worker.deleteEventTypes}
    />

    <WorkerPermissionItem
      name="Event templates"
      create={worker.createEventTemplates}
      update={worker.updateEventTemplates}
      remove={worker.deleteEventTemplates}
    />

    <WorkerPermissionItem
      name="Events"
      create={worker.createEvents}
      update={worker.updateEvents}
      remove={worker.deleteEvents}
    />

    <WorkerPermissionItem
      name="Event appointments"
      create={worker.createEventAppointments}
      update={worker.updateEventAppointments}
      remove={worker.deleteEventAppointments}
    />

    <WorkerPermissionItem
      name="Calendar appointments"
      create={worker.createCalendarAppointments}
      update={worker.updateCalendarAppointments}
      remove={worker.deleteCalendarAppointments}
    />
  </>
);

export default WorkerPermissions;
