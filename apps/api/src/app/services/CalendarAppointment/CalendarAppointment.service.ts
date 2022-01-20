import { CalendarAppointment } from '@hubbl/shared/models/entities';

import BaseService from '../Base';
import { RepositoryAccessor } from '../util';

export default class CalendarAppointmentService extends BaseService<CalendarAppointment> {
  constructor(repoAccessor: RepositoryAccessor<CalendarAppointment>) {
    super(CalendarAppointment, repoAccessor);
  }
}
