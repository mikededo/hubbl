import { Request, Response } from 'express';
import * as log from 'npmlog';
import { getRepository } from 'typeorm';

import { CalendarAppointmentDTO, DTOGroups } from '@hubbl/shared/models/dto';
import { GymZone } from '@hubbl/shared/models/entities';

import { queries } from '../../../constants';
import {
  CalendarAppointmentService,
  ClientService,
  GymZoneService,
  OwnerService,
  WorkerService
} from '../../../services';
import BaseController from '../../Base';
import { createdByOwnerOrWorker, ParsedToken } from '../../helpers';

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

  constructor(private operation: 'create') {
    super();
  }

  protected maxConcurrentQuery({
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

  protected async onFail(res: Response, error: any): Promise<Response> {
    log.error(
      `Controller[${this.constructor.name}]`,
      `"${this.operation}" handler`,
      error.toString()
    );

    return this.fail(
      res,
      'Internal server error. If the error persists, contact our team'
    );
  }

  protected async baseAppointmentValidation(
    res: Response,
    appointment: CalendarAppointmentDTO
  ): Promise<Response> | undefined {
    if (appointment.startTime >= appointment.endTime) {
      return this.forbidden(
        res,
        'End time of the appointment must be after the appointment.'
      );
    }

    const appointmentDate = new Date(
      appointment.date.year,
      appointment.date.month - 1,
      appointment.date.day
    );
    const splittedStartTime = appointment.startTime.split(':');
    appointmentDate.setHours(+splittedStartTime[0]);
    appointmentDate.setMinutes(+splittedStartTime[1]);
    appointmentDate.setSeconds(+splittedStartTime[2]);

    if (appointmentDate < new Date()) {
      return this.forbidden(
        res,
        `Can not ${this.operation} an appointment to a past event`
      );
    }

    return undefined;
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

class ICalendarAppointmentCreateController extends BaseCalendarAppointmentController {
  constructor() {
    super('create');
  }

  protected async appointmentValidation(
    res: Response,
    appointment: CalendarAppointmentDTO
  ): Promise<Response | GymZone> {
    // Validate the date of the appointment
    const validation = await this.baseAppointmentValidation(res, appointment);

    if (validation) {
      return validation;
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
      const { max } = await this.maxConcurrentQuery(appointment);
      if (max >= gymZone.capacity) {
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

  private async createByOwnerOrWorker(
    req: Request,
    res: Response
  ): Promise<Response> {
    // Parse the appointment
    let dto: CalendarAppointmentDTO;

    try {
      dto = await CalendarAppointmentDTO.fromJson(req.body, DTOGroups.CREATE);
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

    return createdByOwnerOrWorker({
      // Use any to skip same prop names issues
      service: this.service as any,
      ownerService: this.ownerService,
      workerService: this.workerService,
      controller: this,
      res,
      fromClass: CalendarAppointmentDTO.fromClass,
      token: res.locals.token as ParsedToken,
      by: req.query.by as any,
      dto,
      entityName: 'CalendarAppointment',
      workerCreatePermission: 'createCalendarAppointments'
    });
  }

  protected run(req: Request, res: Response): Promise<any> {
    this.checkServices();

    if (req.query.by === 'client') {
      return;
    }

    return this.createByOwnerOrWorker(req, res);
  }
}

const createInstance = new ICalendarAppointmentCreateController();

export const CalendarCreateController = createInstance;
