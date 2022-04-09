import { Request, Response } from 'express';

import { DTOGroups, EventAppointmentDTO } from '@hubbl/shared/models/dto';
import { Event, EventAppointment } from '@hubbl/shared/models/entities';
import { ParsedToken } from '@hubbl/shared/types';

import { getRepository } from '../../../../config';
import {
  ClientService,
  EventAppointmentService,
  EventService,
  OwnerService,
  WorkerService
} from '../../../services';
import BaseController from '../../Base';
import {
  createdByOwnerOrWorker,
  deletedByClient,
  deletedByOwnerOrWorker,
  updatedByOwnerOrWorker
} from '../../helpers';

abstract class BaseEventAppointmentController extends BaseController {
  protected service: EventAppointmentService = undefined;
  protected eventService: EventService = undefined;

  protected ownerService: OwnerService = undefined;
  protected workerService: WorkerService = undefined;
  protected clientService: ClientService = undefined;

  protected async baseEventValidation(
    res: Response,
    id: number,
    operation: 'create' | 'cancel' | 'delete'
  ): Promise<Response | Event> {
    let event: Event;

    try {
      // Check if the event exists
      event = await this.eventService.findOne({
        where: { id },
        cache: true
      });

      if (!event) {
        return this.forbidden(
          res,
          `Event to ${operation} the appointment does not exist`
        );
      }
    } catch (e) {
      return this.onFail(res, e, operation);
    }

    // Check event date
    const eventDate = new Date(
      event.date.year,
      event.date.month - 1,
      event.date.day
    );
    const splittedStartTime = event.startTime.split(':');
    eventDate.setHours(+splittedStartTime[0]);
    eventDate.setMinutes(+splittedStartTime[1]);
    eventDate.setSeconds(+splittedStartTime[2]);

    if (eventDate < new Date()) {
      return this.forbidden(
        res,
        `Can not ${operation} an appointment to a past event`
      );
    }

    return event;
  }

  protected async clientValidation(
    res: Response,
    id: number,
    event: Event
  ): Promise<Response> | undefined {
    try {
      // Check if the client exists
      const client = await this.clientService.findOneBy({ personId: id });
      if (!client) {
        return this.forbidden(res, 'Person does not exist');
      }

      // Check if event requires covid passport
      if (event.covidPassport && !client.covidPassport) {
        return this.forbidden(
          res,
          'Client does not have the covid passport and the event requires it'
        );
      }

      if (
        await this.service.count({
          where: { client: id, event: event.id, cancelled: false }
        })
      ) {
        return this.forbidden(res, 'Client has already a place in the event');
      }
    } catch (e) {
      return this.onFail(res, e, 'create');
    }
  }

  protected checkServices() {
    if (!this.service) {
      this.service = new EventAppointmentService(getRepository);
    }

    if (!this.eventService) {
      this.eventService = new EventService(getRepository);
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

class IEventAppointmentCreateController extends BaseEventAppointmentController {
  /**
   * Checks the following, before creating an event
   * 1. Event exists in the system
   * 2. Event is not past
   * 3. Event's capacity is not exceeded
   */
  private async eventValidation(
    res: Response,
    id: number
  ): Promise<Response | Event> {
    const maybeEvent = await this.baseEventValidation(res, id, 'create');

    if (!(maybeEvent instanceof Event)) {
      return maybeEvent;
    }

    try {
      // Check capacity
      const appointmentCount = await this.service.count({
        where: { event: id }
      });
      if (appointmentCount >= maybeEvent.capacity) {
        return this.forbidden(res, 'No places left for the seleted event.');
      }
    } catch (e) {
      return this.onFail(res, e, 'create');
    }

    return maybeEvent;
  }

  /**
   * When the `token.user` is either worker or owner, the body will include the id
   * of the client, since whoever has made the request, will have had to select
   * the client.
   */
  private async createByOwnerOrWorker(
    req: Request,
    res: Response
  ): Promise<Response> {
    // Parse the appointment
    let dto: EventAppointmentDTO;

    try {
      dto = await EventAppointmentDTO.fromJson(req.body, DTOGroups.CREATE);
    } catch (e) {
      return this.clientError(res, e);
    }

    // Validate the event
    const maybeEvent = await this.eventValidation(res, dto.event);
    if (!(maybeEvent instanceof Event)) {
      return maybeEvent;
    }

    // Validate client
    const clientValidation = await this.clientValidation(
      res,
      dto.client,
      maybeEvent
    );

    if (clientValidation) {
      return clientValidation;
    }

    // Use the event start and end time
    dto.startTime = maybeEvent.startTime;
    dto.endTime = maybeEvent.endTime;

    return createdByOwnerOrWorker({
      service: this.service,
      ownerService: this.ownerService,
      workerService: this.workerService,
      controller: this,
      res,
      fromClass: EventAppointmentDTO.fromClass,
      token: res.locals.token as ParsedToken,
      dto,
      entityName: 'EventAppointment',
      workerCreatePermission: 'createEventAppointments'
    });
  }

  /**
   * When the `token.user` is client, it will mean that the client is making the
   * request, and the body will not have the client id set. Therefore, the id
   * has to be obtanied from the client token, in the auth headers.
   */
  private async createByClient(req: Request, res: Response): Promise<Response> {
    // Get the id of the client from the token
    const { token } = res.locals;

    // Parse the appointment
    let dto: EventAppointmentDTO;

    try {
      // Add the client id to the object being parsed
      dto = await EventAppointmentDTO.fromJson(
        { ...req.body, client: token.id },
        DTOGroups.CREATE
      );
    } catch (e) {
      return this.clientError(res, e);
    }

    // Validate the event
    const maybeEvent = await this.eventValidation(res, dto.event);
    if (!(maybeEvent instanceof Event)) {
      return maybeEvent;
    }

    // Validate client
    const clientValidation = await this.clientValidation(
      res,
      dto.client,
      maybeEvent
    );

    if (clientValidation) {
      return clientValidation;
    }

    // Use the event start and end time
    dto.startTime = maybeEvent.startTime;
    dto.endTime = maybeEvent.endTime;

    try {
      // Save the appointment
      const appointment = await this.service.save(dto.toClass());

      return this.created(res, EventAppointmentDTO.fromClass(appointment));
    } catch (e) {
      return this.onFail(res, e, 'create');
    }
  }

  protected async run(req: Request, res: Response): Promise<Response> {
    this.checkServices();

    const { token } = res.locals;

    if (token.user === 'client') {
      return this.createByClient(req, res);
    }

    return this.createByOwnerOrWorker(req, res);
  }
}

const createInstance = new IEventAppointmentCreateController();

export const EventCreateController = createInstance;

class IEventAppointmentCancelController extends BaseEventAppointmentController {
  private async cancelByOwnerOrWorker(
    req: Request,
    res: Response
  ): Promise<Response> {
    const appointmentId = +req.params.id;

    const maybeEvent = await this.baseEventValidation(
      res,
      +req.params.eId,
      'cancel'
    );

    if (!(maybeEvent instanceof Event)) {
      return maybeEvent;
    }

    const eventId = +req.params.eId;

    let appointment: EventAppointment;
    try {
      // Check if exists any appointment for the selected event and client
      appointment = await this.service.findOne({
        where: { id: appointmentId, event: eventId },
        loadRelationIds: true
      });

      if (!appointment) {
        return this.forbidden(res, 'The appointment does not exist.');
      } else if (appointment.cancelled) {
        return this.forbidden(res, 'The appointment is already cancelled.');
      }
    } catch (e) {
      return this.onFail(res, e, 'cancel');
    }

    return updatedByOwnerOrWorker({
      service: this.service,
      ownerService: this.ownerService,
      workerService: this.workerService,
      controller: this,
      res,
      token: res.locals.token as ParsedToken,
      dto: EventAppointmentDTO.fromClass({
        ...appointment,
        cancelled: true
      }),
      entityName: 'EventAppointment',
      countArgs: { id: appointmentId },
      workerUpdatePermission: 'updateEventAppointments'
    });
  }

  private async cancelByClient(req: Request, res: Response): Promise<Response> {
    const appointmentId = +req.params.id;

    const maybeEvent = await this.baseEventValidation(
      res,
      +req.params.eId,
      'cancel'
    );

    if (!(maybeEvent instanceof Event)) {
      return maybeEvent;
    }

    const { token } = res.locals;
    const eventId = +req.params.eId;

    let appointment: EventAppointment;
    try {
      // Check if exists any appointment for the selected event and client
      appointment = await this.service.findOne({
        where: { id: appointmentId, client: token.id, event: eventId },
        loadRelationIds: true
      });

      if (!appointment) {
        return this.forbidden(res, 'The appointment does not exist.');
      } else if (appointment.cancelled) {
        return this.forbidden(res, 'The appointment is already cancelled.');
      }
    } catch (e) {
      return this.onFail(res, e, 'cancel');
    }

    try {
      await this.service.update(appointmentId, {
        ...appointment,
        cancelled: true
      });

      return this.ok(res);
    } catch (e) {
      return this.onFail(res, e, 'cancel');
    }
  }

  protected run(req: Request, res: Response): Promise<Response> {
    this.checkServices();

    const { token } = res.locals;

    if (token.user === 'client') {
      return this.cancelByClient(req, res);
    }

    return this.cancelByOwnerOrWorker(req, res);
  }
}

const cancelInstance = new IEventAppointmentCancelController();

export const EventCancelController = cancelInstance;

class IEventAppointmentDeleteController extends BaseEventAppointmentController {
  private async deleteByOwnerOrWorker(
    req: Request,
    res: Response
  ): Promise<Response> {
    const maybeEvent = await this.baseEventValidation(
      res,
      +req.params.eId,
      'delete'
    );

    if (!(maybeEvent instanceof Event)) {
      return maybeEvent;
    }

    const id = +req.params.id;
    return deletedByOwnerOrWorker({
      service: this.service,
      ownerService: this.ownerService,
      workerService: this.workerService,
      controller: this,
      res,
      token: res.locals.token as ParsedToken,
      entityId: id,
      entityName: 'EventAppointment',
      countArgs: { id },
      workerDeletePermission: 'deleteEventAppointments'
    });
  }

  private async deleteByClient(req: Request, res: Response): Promise<Response> {
    const eventId = +req.params.eId;
    const appointmentId = +req.params.id;

    const maybeEvent = await this.baseEventValidation(res, eventId, 'delete');

    if (!(maybeEvent instanceof Event)) {
      return maybeEvent;
    }

    const { token } = res.locals;

    return deletedByClient({
      service: this.service,
      clientService: this.clientService,
      controller: this,
      res,
      entityId: appointmentId,
      clientId: token.id,
      countArgs: { id: appointmentId, client: token.id, event: eventId },
      entityName: 'EventAppointment'
    });
  }

  protected run(req: Request, res: Response): Promise<Response> {
    this.checkServices();

    const { token } = res.locals;

    if (token.user === 'client') {
      return this.deleteByClient(req, res);
    }

    return this.deleteByOwnerOrWorker(req, res);
  }
}

const deleteInstance = new IEventAppointmentDeleteController();

export const EventDeleteController = deleteInstance;
