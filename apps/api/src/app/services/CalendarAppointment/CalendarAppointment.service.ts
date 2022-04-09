import { CalendarAppointment } from '@hubbl/shared/models/entities';

import BaseService from '../Base';

export default class CalendarAppointmentService extends BaseService<CalendarAppointment> {
  constructor() {
    super(CalendarAppointment);
  }
}
