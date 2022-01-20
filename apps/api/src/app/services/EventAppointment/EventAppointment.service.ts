import { EventAppointment } from '@hubbl/shared/models/entities';

import BaseService from '../Base';
import { RepositoryAccessor } from '../util';

export default class EventAppointmentService extends BaseService<EventAppointment> {
  constructor(repoAccessor: RepositoryAccessor<EventAppointment>) {
    super(EventAppointment, repoAccessor);
  }
}
