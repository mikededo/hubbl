import { Stack, Typography } from '@mui/material';
import WorkerPermissionChecks from '../WorkerPermissionChecks';

const WorkerPermissions = (): JSX.Element => (
  <Stack gap={1.5}>
    <Typography variant="h6">Permissions</Typography>

    <Typography variant="subtitle1">
      Select which are the permissions the worker you are creating will have.
      You can change this anytime!
    </Typography>

    <Stack direction="column" width="100%">
      <WorkerPermissionChecks name="Virtual gyms" update="updateVirtualGyms" />

      <WorkerPermissionChecks
        name="Gym zones"
        create="createGymZones"
        update="updateGymZones"
        remove="deleteGymZones"
      />

      <WorkerPermissionChecks
        name="Trainers"
        create="createTrainers"
        update="updateTrainers"
        remove="deleteTrainers"
      />

      <WorkerPermissionChecks
        name="Trainer tags"
        create="createTags"
        update="updateTags"
        remove="deleteTags"
      />

      <WorkerPermissionChecks
        name="Clients"
        create="createClients"
        update="updateClients"
        remove="deleteClients"
      />

      <WorkerPermissionChecks
        name="Event types"
        create="createEventTypes"
        update="updateEventTypes"
        remove="deleteEventTypes"
      />

      <WorkerPermissionChecks
        name="Event templates"
        create="createEventTemplates"
        update="updateEventTemplates"
        remove="deleteEventTemplates"
      />

      <WorkerPermissionChecks
        name="Events"
        create="createEvents"
        update="updateEvents"
        remove="deleteEvents"
      />

      <WorkerPermissionChecks
        name="Event appointments"
        create="createEventAppointments"
        update="updateEventAppointments"
        remove="deleteEventAppointments"
      />

      <WorkerPermissionChecks
        name="Calendar appointments"
        create="createCalendarAppointments"
        update="updateCalendarAppointments"
        remove="deleteCalendarAppointments"
      />
    </Stack>
  </Stack>
);

export default WorkerPermissions;
