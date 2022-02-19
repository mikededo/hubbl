import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import { FetchAppointmentInterval } from '@hubbl/shared/models/body-validators';
import { CalendarAppointmentDTO, DTOGroups } from '@hubbl/shared/models/dto';
import {
  CalendarAppointment,
  CalendarDate,
  GymZone
} from '@hubbl/shared/models/entities';

import { queries } from '../../../constants';
import { AvailableTimesAppointmentsResult } from '../../../constants/queries';
import {
  CalendarAppointmentService,
  ClientService,
  GymZoneService,
  OwnerService,
  PersonService,
  WorkerService
} from '../../../services';
import BaseController from '../../Base';
import {
  createdByOwnerOrWorker,
  deletedByClient,
  deletedByOwnerOrWorker,
  ParsedToken,
  updatedByOwnerOrWorker,
  userAccessToCalendar
} from '../../helpers';

type MaxConcurrentQueryProps = Pick<
  CalendarAppointmentDTO,
  'calendar' | 'date' | 'startTime' | 'endTime'
>;

abstract class BaseCalendarAppointmentController extends BaseController {
  protected service: CalendarAppointmentService = undefined;
  protected gymZoneService: GymZoneService = undefined;

  protected ownerService: OwnerService = undefined;
  protected workerService: WorkerService = undefined;
  protected clientService: ClientService = undefined;

  constructor(private operation: 'create' | 'cancel' | 'delete') {
    super();
  }

  protected async onFail(res: Response, error: any): Promise<Response> {
    return super.onFail(res, error, this.operation);
  }

  protected async maxConcurrentQuery({
    date,
    calendar,
    startTime,
    endTime
  }: MaxConcurrentQueryProps): Promise<queries.MaxConcurentEventsResult> {
    return this.service.manager.query(queries.MAX_CONCURRENT_EVENTS_DAY, [
      date.year,
      date.month,
      date.day,
      startTime,
      endTime,
      calendar
    ]);
  }

  protected isPastEvent(appointment: CalendarAppointmentDTO): boolean {
    const appointmentDate = new Date(
      appointment.date.year,
      appointment.date.month - 1,
      appointment.date.day
    );
    const splittedStartTime = appointment.startTime.split(':');
    appointmentDate.setHours(+splittedStartTime[0]);
    appointmentDate.setMinutes(+splittedStartTime[1]);
    appointmentDate.setSeconds(+splittedStartTime[2]);

    return appointmentDate < new Date();
  }

  protected async clientValidation(
    res: Response,
    appointment: CalendarAppointmentDTO,
    gymZone: GymZone
  ): Promise<Response> | undefined {
    try {
      // Check if the client exists
      const client = await this.clientService.findOne({
        id: appointment.client
      });
      if (!client) {
        return this.forbidden(res, 'Person does not exist.');
      }

      // Check if event requires covid passport
      if (gymZone.covidPassport && !client.covidPassport) {
        return this.forbidden(
          res,
          'Client does not have the covid passport and the gym zone requires it.'
        );
      }

      if (
        await this.service.count({
          client: appointment.client,
          startTime: appointment.startTime,
          endTime: appointment.endTime,
          date: appointment.date,
          cancelled: false
        })
      ) {
        return this.forbidden(
          res,
          'Client has already an appointment at this time interval.'
        );
      }
    } catch (e) {
      return this.onFail(res, e);
    }
  }

  protected checkServices() {
    if (!this.service) {
      this.service = new CalendarAppointmentService(getRepository);
    }

    if (!this.gymZoneService) {
      this.gymZoneService = new GymZoneService(getRepository);
    }

    if (!this.ownerService) {
      this.ownerService = new OwnerService(getRepository);
    }

    if (!this.workerService) {
      this.workerService = new WorkerService(getRepository);
    }

    if (!this.clientService) {
      this.clientService = new ClientService(getRepository);
    }
  }
}

class ICalendarApointmentFetchController extends BaseController {
  protected service: CalendarAppointmentService = undefined;
  protected personService: PersonService = undefined;
  protected gymZoneService: GymZoneService = undefined;

  private isPastDate(date: CalendarDate): boolean {
    return new Date(date.year, date.month - 1, date.day) < new Date();
  }

  protected async run(req: Request, res: Response): Promise<Response> {
    if (!this.service) {
      this.service = new CalendarAppointmentService(getRepository);
    }

    if (!this.personService) {
      this.personService = new PersonService(getRepository);
    }

    if (!this.gymZoneService) {
      this.gymZoneService = new GymZoneService(getRepository);
    }

    const { token } = res.locals;
    const calendarId = +req.params.id;

    // Check if person making the request exists
    const person = await userAccessToCalendar({
      controller: this,
      personService: this.personService,
      gymZoneService: this.gymZoneService,
      res,
      personId: token.id,
      calendarId
    });
    if (person) {
      return person;
    }

    let validatedBody: FetchAppointmentInterval;
    try {
      validatedBody = await FetchAppointmentInterval.validate(req.body);
    } catch (e) {
      return this.clientError(res, e);
    }

    // Check if date is past
    if (this.isPastDate(validatedBody.date)) {
      return this.clientError(res, 'Can not search for past dates.');
    }

    try {
      const rawTimes: AvailableTimesAppointmentsResult =
        await this.service.manager.query(queries.AVAILABLE_TIMES_APPOINTMENTS, [
          validatedBody.date.year,
          validatedBody.date.month,
          validatedBody.date.day,
          calendarId,
          `${validatedBody.interval} minutes`
        ]);

      return this.ok(
        res,
        rawTimes.map(({ available }) => available)
      );
    } catch (e) {
      return this.onFail(res, e, 'fetch');
    }
  }
}

const fetchInstance = new ICalendarApointmentFetchController();

export const CalendarFetchController = fetchInstance;

class ICalendarAppointmentCreateController extends BaseCalendarAppointmentController {
  constructor() {
    super('create');
  }

  /**
   * Validates the appointment date, the gym zone and if the appoinment
   * fits the gym zone schedule, and if the total capacity of the gym zone
   * has beenr reached.
   */
  private async appointmentValidation(
    res: Response,
    appointment: CalendarAppointmentDTO
  ): Promise<Response | GymZone> {
    // Validate the date of the appointment
    if (appointment.startTime >= appointment.endTime) {
      return this.forbidden(
        res,
        'End time of the appointment must be after the appointment.'
      );
    }

    if (this.isPastEvent(appointment)) {
      return this.forbidden(res, 'Can not create a past appointment');
    }

    // Get the gym zone
    let gymZone: GymZone;
    try {
      gymZone = await this.gymZoneService.findOne({
        options: { where: { calendar: appointment.calendar } }
      });
    } catch (e) {
      return this.onFail(res, e);
    }

    // Check if fits gym zone schedule
    if (
      appointment.startTime < gymZone.openTime ||
      appointment.endTime > gymZone.closeTime
    ) {
      return this.forbidden(
        res,
        'Can not create an appointment if gym zone is closed.'
      );
    }

    try {
      // Check gym zone capacity for the wanted interval
      const { max } = (await this.maxConcurrentQuery(appointment))[0];

      if (+max >= gymZone.capacity) {
        return this.forbidden(
          res,
          'Gym zone is full at the selected interval.'
        );
      }
    } catch (e) {
      return this.onFail(res, e);
    }

    return gymZone;
  }

  /**
   * Validates the appointment recieved in the `body` and the client
   * to which the appointment is being assigned. If there's any error,
   * it will send the response and return a `Promise<Response>`. Otherwise,
   * it will return the `CalendarAppointmentDTO`.
   */
  private async validOrRejected(
    res: Response,
    body: any
  ): Promise<Response | CalendarAppointmentDTO> {
    let dto: CalendarAppointmentDTO;

    try {
      dto = await CalendarAppointmentDTO.fromJson(body, DTOGroups.CREATE);
    } catch (e) {
      return this.clientError(res, e);
    }

    // Validate
    const maybeGymZone = await this.appointmentValidation(res, dto);
    if (!(maybeGymZone instanceof GymZone)) {
      return maybeGymZone;
    }

    // Validate client
    const clientValidation = await this.clientValidation(
      res,
      dto,
      maybeGymZone
    );

    if (clientValidation) {
      return clientValidation;
    }

    return dto;
  }

  private async createByOwnerOrWorker(
    req: Request,
    res: Response
  ): Promise<Response> {
    const maybeValidDto = await this.validOrRejected(res, req.body);

    if (!(maybeValidDto instanceof CalendarAppointmentDTO)) {
      return maybeValidDto;
    }

    return createdByOwnerOrWorker({
      // Use any to skip same prop names issues
      service: this.service as any,
      ownerService: this.ownerService,
      workerService: this.workerService,
      controller: this,
      res,
      fromClass: CalendarAppointmentDTO.fromClass,
      token: res.locals.token as ParsedToken,
      dto: maybeValidDto,
      entityName: 'CalendarAppointment',
      workerCreatePermission: 'createCalendarAppointments'
    });
  }

  private async createByClient(req: Request, res: Response): Promise<Response> {
    // Get the id of the client from the token
    const { token } = res.locals;

    const maybeValidDto = await this.validOrRejected(res, {
      ...req.body,
      client: token.id
    });

    if (!(maybeValidDto instanceof CalendarAppointmentDTO)) {
      return maybeValidDto;
    }

    try {
      const appointment = await this.service.save(maybeValidDto.toClass());

      return this.created(res, CalendarAppointmentDTO.fromClass(appointment));
    } catch (e) {
      return this.onFail(res, e);
    }
  }

  protected run(req: Request, res: Response): Promise<any> {
    this.checkServices();

    const { token } = res.locals;

    if (token.user === 'client') {
      return this.createByClient(req, res);
    }

    return this.createByOwnerOrWorker(req, res);
  }
}

const createInstance = new ICalendarAppointmentCreateController();

export const CalendarCreateController = createInstance;

class ICalendarAppointmentCancelController extends BaseCalendarAppointmentController {
  private async cancelByOwnerOrWorker(
    req: Request,
    res: Response
  ): Promise<Response> {
    const appointmentId = +req.params.id;
    const calendarId = +req.params.cId;

    // Check if the appointment exists
    let appointment: CalendarAppointment;
    try {
      appointment = await this.service.findOne({
        id: appointmentId,
        options: { where: { calendar: calendarId }, loadRelationIds: true }
      });

      if (!appointment) {
        return this.forbidden(res, 'The appointment does not exist.');
      } else if (appointment.cancelled) {
        return this.forbidden(res, 'The appointment is already cancelled.');
      }
    } catch (e) {
      return this.onFail(res, e);
    }

    return updatedByOwnerOrWorker({
      service: this.service as any,
      ownerService: this.ownerService,
      workerService: this.workerService,
      controller: this,
      res,
      token: res.locals.token as ParsedToken,
      dto: CalendarAppointmentDTO.fromClass({
        ...appointment,
        cancelled: true
      }),
      entityName: 'CalendarAppointment',
      countArgs: { id: appointmentId },
      workerUpdatePermission: 'updateCalendarAppointments'
    });
  }

  private async cancelByClient(req: Request, res: Response): Promise<Response> {
    const appointmentId = +req.params.id;
    const calendarId = +req.params.cId;
    const { token } = res.locals;

    try {
      // Check if the client exists
      const client = await this.clientService.findOne({
        id: token.id
      });
      if (!client) {
        return this.forbidden(res, 'Person does not exist.');
      }
    } catch (e) {
      return this.onFail(res, e);
    }

    // Check if the appointment exists
    let appointment: CalendarAppointment;
    try {
      appointment = await this.service.findOne({
        id: appointmentId,
        options: {
          where: { calendar: calendarId, client: token.id },
          loadRelationIds: true
        }
      });

      if (!appointment) {
        return this.forbidden(res, 'The appointment does not exist.');
      } else if (appointment.cancelled) {
        return this.forbidden(res, 'The appointment is already cancelled.');
      }
    } catch (e) {
      return this.onFail(res, e);
    }

    try {
      await this.service.update(appointmentId, {
        ...appointment,
        cancelled: true
      });

      return this.ok(res);
    } catch (e) {
      return this.onFail(res, e);
    }
  }

  protected async run(req: Request, res: Response): Promise<Response> {
    this.checkServices();

    const { token } = res.locals;

    if (token.user === 'client') {
      return this.cancelByClient(req, res);
    }

    return this.cancelByOwnerOrWorker(req, res);
  }
}

const cancelInstance = new ICalendarAppointmentCancelController('cancel');

export const CalendarCancelController = cancelInstance;

class ICalendarAppointmentDeleteController extends BaseCalendarAppointmentController {
  constructor() {
    super('delete');
  }

  private async deleteByOwnerOrWorker(
    req: Request,
    res: Response
  ): Promise<Response> {
    const id = +req.params.id;
    const calendarId = +req.params.cId;

    return deletedByOwnerOrWorker({
      // Use any to skip same prop names issues
      service: this.service as any,
      ownerService: this.ownerService,
      workerService: this.workerService,
      controller: this,
      res,
      token: res.locals.token as ParsedToken,
      entityId: id,
      entityName: 'CalendarAppointment',
      countArgs: { id, calendar: calendarId },
      workerDeletePermission: 'deleteCalendarAppointments'
    });
  }

  private async deleteByClient(req: Request, res: Response): Promise<Response> {
    const appointmentId = +req.params.id;
    const calendarId = +req.params.cId;
    const { token } = res.locals;

    return deletedByClient({
      service: this.service,
      clientService: this.clientService,
      controller: this,
      res,
      entityId: appointmentId,
      clientId: token.id,
      countArgs: { calendar: calendarId, client: token.id, id: appointmentId },
      entityName: 'CalendarAppointment'
    });
  }

  protected run(req: Request, res: Response): Promise<any> {
    this.checkServices();

    const { token } = res.locals;

    if (token.user === 'client') {
      return this.deleteByClient(req, res);
    }

    return this.deleteByOwnerOrWorker(req, res);
  }
}

const deleteInstance = new ICalendarAppointmentDeleteController();

export const CalendarDeleteController = deleteInstance;
