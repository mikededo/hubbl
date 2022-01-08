import { DTOGroups, EventAppointmentDTO } from '@hubbl/shared/models/dto';
import { Event } from '@hubbl/shared/models/entities';
import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import {
  ClientService,
  EventAppointmentService,
  EventService,
  OwnerService,
  WorkerService
} from '../../../services';
import BaseController from '../../Base';
import { createdByOwnerOrWorker, ParsedToken } from '../../helpers';

// TODO: Add service failing checks

class IEventAppointmentCreateController extends BaseController {
  protected service: EventAppointmentService = undefined;
  protected eventService: EventService = undefined;

  protected ownerService: OwnerService = undefined;
  protected workerService: WorkerService = undefined;
  protected clientService: ClientService = undefined;

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
    // Check if the event exists
    const event = await this.eventService.findOne(id);
    if (!event) {
      return this.clientError(
        res,
        'Event to create the appointment does not exist'
      );
    }

    // Check event date
    const eventDate = new Date(
      event.date.year,
      event.date.month - 1,
      event.date.day
    );
    if (eventDate < new Date()) {
      return this.clientError(
        res,
        'Can not create an appointment to a past event'
      );
    }

    // Check capacity
    const appointmentCount = await this.service.count({ event: id });
    if (appointmentCount === event.capacity) {
      return this.clientError(res, 'No places left for the seleted event.');
    }

    return event;
  }

  private async clientValidation(
    res: Response,
    id: number,
    event: Event
  ): Promise<Response> | undefined {
    // Check if the client exists
    const client = await this.clientService.findOne(id);
    if (!client) {
      return this.clientError(res, 'Person does not exist');
    }

    // Check if event requires covid passport
    if (event.covidPassport && !client.covidPassport) {
      return this.clientError(
        res,
        'Client does not have the covid passport and the event requires it'
      );
    }
  }

  /**
   * When the `by` param is either worker or owner, the body will include the id
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
      by: req.query.by as any,
      dto,
      entityName: 'EventAppointment',
      workerCreatePermission: 'createEventAppointments'
    });
  }

  /**
   * When the `by` param is a client, it will mean that the client is making the
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
      await this.service.save(dto.toClass());

      return this.ok(res);
    } catch (e) {
      return this.fail(
        res,
        'Internal server error. If the error persists, contact our team.'
      );
    }
  }

  protected async run(req: Request, res: Response): Promise<Response> {
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

    if (req.query.by === 'client') {
      return this.createByClient(req, res);
    }

    return this.createByOwnerOrWorker(req, res);
  }
}

const createInstance = new IEventAppointmentCreateController();

export const EventCreateController = createInstance;
