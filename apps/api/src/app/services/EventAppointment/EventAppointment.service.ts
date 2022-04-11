import { EventAppointment } from '@hubbl/shared/models/entities';

import BaseService from '../Base';

export default class EventAppointmentService extends BaseService<EventAppointment> {
  constructor() {
    super(EventAppointment);
  }
}
