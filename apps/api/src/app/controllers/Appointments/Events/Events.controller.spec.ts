import npmlog = require('npmlog');
import { getRepository } from 'typeorm';

import { DTOGroups, EventAppointmentDTO } from '@hubbl/shared/models/dto';
import { Event } from '@hubbl/shared/models/entities';

import {
  ClientService,
  EventAppointmentService,
  EventService,
  OwnerService,
  WorkerService
} from '../../../services';
import * as create from '../../helpers/create';
import * as deleteHelpers from '../../helpers/delete';
import * as update from '../../helpers/update';
import {
  EventCancelController,
  EventCreateController,
  EventDeleteController
} from './Events.controller';

jest.mock('../../../services');
jest.mock('@hubbl/shared/models/dto');

type TypesOfControllers =
  | typeof EventCreateController
  | typeof EventDeleteController
  | typeof EventCancelController;

type Operations = 'create' | 'cancel' | 'delete';

/**
 * Create mock event using the Event constructor so
 * `instanceof` checks do not fail
 */
const createMockEvent = (capacity = 25): Event => {
  const result = new Event();

  result.id = 2;
  result.capacity = capacity;
  result.covidPassport = true;
  result.startTime = '10:00:00';
  result.endTime = '11:00:00';
  result.date = { year: 2050, month: 6, day: 29 } as any;

  return result;
};

describe('Appointments.Event controller', () => {
  const mockEvent = createMockEvent();
  const mockAppointment = {
    id: 1,
    startTime: '09:00:00',
    endTime: '10:00:00',
    cancelled: false,
    client: 1,
    event: 2
  };
  const mockClient = { covidPassport: true };
  const mockDto = {
    ...mockAppointment,
    toClass: jest.fn().mockReturnValue(mockAppointment)
  } as any;

  const mockReq = {
    query: { by: 'owner' },
    body: mockAppointment,
    params: { eId: 2, id: 1 }
  } as any;
  const mockClientReq = { ...mockReq, query: { by: 'client' } } as any;
  const mockRes = { locals: { token: { id: 2 } } } as any;

  // Services
  const mockAppointmentService = {
    count: jest.fn(),
    update: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
    findOne: jest.fn()
  };
  const mockEventService = { findOne: jest.fn() };
  const mockClientService = { findOne: jest.fn() };

  const fromJsonSpy = jest.spyOn(EventAppointmentDTO, 'fromJson');
  const fromClassSpy = jest.spyOn(EventAppointmentDTO, 'fromClass');

  const logSpy = jest.spyOn(npmlog, 'error').mockImplementation();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const setupServices = (controller: TypesOfControllers) => {
    controller['service'] = mockAppointmentService as any;
    controller['eventService'] = mockEventService as any;
    controller['clientService'] = mockClientService as any;
    controller['ownerService'] = {} as any;
    controller['workerService'] = {} as any;
  };

  const failAsserts = (
    controller: TypesOfControllers,
    failSpy: any,
    operation: Operations
  ) => {
    expect(logSpy).toHaveBeenCalledTimes(1);
    expect(logSpy).toHaveBeenCalledWith(
      `Controller[${controller.constructor.name}]`,
      `"${operation}" handler`,
      'error-thrown'
    );
    expect(failSpy).toHaveBeenCalledTimes(1);
    expect(failSpy).toHaveBeenCalledWith(
      mockRes,
      'Internal server error. If the error persists, contact our team'
    );
  };

  const eventNotFoundAsserts = async (
    controller: TypesOfControllers,
    mockReq: any,
    operation: Operations
  ) => {
    const forbiddenSpy = jest
      .spyOn(controller, 'forbidden')
      .mockReturnValue({} as any);
    fromJsonSpy.mockResolvedValue(mockDto);
    mockEventService.findOne.mockResolvedValue(undefined);

    setupServices(controller);

    await controller.execute(mockReq, mockRes);

    if (operation === 'create') {
      expect(fromJsonSpy).toHaveBeenCalledTimes(1);
    }
    expect(mockEventService.findOne).toHaveBeenCalledTimes(1);
    expect(forbiddenSpy).toHaveBeenCalledTimes(1);
    expect(forbiddenSpy).toHaveBeenCalledWith(
      mockRes,
      `Event to ${operation} the appointment does not exist`
    );
  };

  const eventServiceFindOneAsserts = async (
    controller: TypesOfControllers,
    mockReq: any,
    operation: Operations
  ) => {
    const failSpy = jest.spyOn(controller, 'fail').mockReturnValue({} as any);

    fromJsonSpy.mockResolvedValue(mockDto);
    mockEventService.findOne.mockRejectedValue('error-thrown');

    setupServices(controller);

    await controller.execute(mockReq, mockRes);

    if (operation === 'create') {
      expect(fromJsonSpy).toHaveBeenCalledTimes(1);
    }
    expect(mockEventService.findOne).toHaveBeenCalledTimes(1);
    failAsserts(controller, failSpy, operation);
  };

  const pastEventAsserts = async (
    controller: TypesOfControllers,
    mockRes: any,
    operation: Operations
  ) => {
    const forbiddenSpy = jest
      .spyOn(controller, 'forbidden')
      .mockReturnValue({} as any);
    fromJsonSpy.mockResolvedValue(mockDto);
    mockEventService.findOne.mockResolvedValue({
      ...mockEvent,
      date: { year: 2000, month: 6, day: 29 }
    });

    setupServices(controller);

    await controller.execute(mockReq, mockRes);

    if (operation === 'create') {
      expect(fromJsonSpy).toHaveBeenCalledTimes(1);
    }
    expect(mockEventService.findOne).toHaveBeenCalledTimes(1);
    expect(forbiddenSpy).toHaveBeenCalledTimes(1);
    expect(forbiddenSpy).toHaveBeenCalledWith(
      mockRes,
      `Can not ${operation} an appointment to a past event`
    );
  };

  describe('EventCreateController', () => {
    const clientErrorSpy = jest
      .spyOn(EventCreateController, 'clientError')
      .mockReturnValue({} as any);
    const forbiddenSpy = jest
      .spyOn(EventCreateController, 'forbidden')
      .mockReturnValue({} as any);
    const failSpy = jest
      .spyOn(EventCreateController, 'fail')
      .mockReturnValue({} as any);

    const validationAsserts = () => {
      // Event validation
      expect(mockEventService.findOne).toHaveBeenCalledTimes(1);
      expect(mockEventService.findOne).toHaveBeenCalledWith({
        id: mockDto.event,
        options: { cache: true }
      });
      expect(mockAppointmentService.count).toHaveBeenCalledTimes(2);
      expect(mockAppointmentService.count).toHaveBeenNthCalledWith(1, {
        event: mockDto.event
      });
      expect(mockAppointmentService.count).toHaveBeenNthCalledWith(2, {
        client: mockDto.client,
        event: mockDto.event,
        cancelled: false
      });
      // Client validation
      expect(mockClientService.findOne).toHaveBeenCalledTimes(1);
      expect(mockClientService.findOne).toHaveBeenCalledWith({
        id: mockDto.client
      });
    };

    const setupSucessfullTests = () => {
      fromJsonSpy.mockResolvedValue(mockDto);
      mockEventService.findOne.mockResolvedValue(mockEvent);
      mockAppointmentService.count.mockResolvedValue(0);
      mockClientService.findOne.mockResolvedValue(mockClient);
      mockAppointmentService.save.mockResolvedValue(mockEvent);

      setupServices(EventCreateController);
    };

    const fromJsonErrorAsserts = async (mockReq: any) => {
      fromJsonSpy.mockRejectedValue({});

      setupServices(EventCreateController);

      await EventCreateController.execute(mockReq, mockRes);

      expect(fromJsonSpy).toHaveBeenCalledTimes(1);
      expect(clientErrorSpy).toHaveBeenCalledTimes(1);
      expect(clientErrorSpy).toHaveBeenCalledWith(mockRes, {});
    };

    const eventCapacityAsserts = async (mockReq: any) => {
      fromJsonSpy.mockResolvedValue(mockDto);
      mockEventService.findOne.mockResolvedValue(createMockEvent(5));
      mockAppointmentService.count.mockResolvedValue(6);

      setupServices(EventCreateController);

      await EventCreateController.execute(mockReq, mockRes);

      expect(fromJsonSpy).toHaveBeenCalledTimes(1);
      expect(mockEventService.findOne).toHaveBeenCalledTimes(1);
      expect(forbiddenSpy).toHaveBeenCalledTimes(1);
      expect(forbiddenSpy).toHaveBeenCalledWith(
        mockRes,
        'No places left for the seleted event.'
      );
    };

    const serviceCountFailAsserts = async (mockReq: any) => {
      fromJsonSpy.mockResolvedValue(mockDto);
      mockEventService.findOne.mockResolvedValue(mockEvent);
      mockAppointmentService.count.mockRejectedValue('error-thrown');

      setupServices(EventCreateController);

      await EventCreateController.execute(mockReq, mockRes);

      expect(fromJsonSpy).toHaveBeenCalledTimes(1);
      expect(mockEventService.findOne).toHaveBeenCalledTimes(1);
      failAsserts(EventCreateController, failSpy, 'create');
    };

    const personDoesNotExistAsserts = async (mockReq: any) => {
      fromJsonSpy.mockResolvedValue(mockDto);
      mockEventService.findOne.mockResolvedValue(mockEvent);
      mockAppointmentService.count.mockResolvedValue(0);
      mockClientService.findOne.mockResolvedValue(undefined);

      setupServices(EventCreateController);

      await EventCreateController.execute(mockReq, mockRes);

      expect(fromJsonSpy).toHaveBeenCalledTimes(1);
      expect(mockEventService.findOne).toHaveBeenCalledTimes(1);
      expect(mockAppointmentService.count).toHaveBeenCalledTimes(1);
      expect(mockClientService.findOne).toHaveBeenCalledTimes(1);
      expect(forbiddenSpy).toHaveBeenCalledTimes(1);
      expect(forbiddenSpy).toHaveBeenCalledWith(
        mockRes,
        'Person does not exist'
      );
    };

    const covidPassportCheckAsserts = async (mockReq: any) => {
      fromJsonSpy.mockResolvedValue(mockDto);
      mockEventService.findOne.mockResolvedValue(mockEvent);
      mockAppointmentService.count.mockResolvedValue(0);
      mockClientService.findOne.mockResolvedValue({
        ...mockClient,
        covidPassport: false
      });

      setupServices(EventCreateController);

      await EventCreateController.execute(mockReq, mockRes);

      expect(fromJsonSpy).toHaveBeenCalledTimes(1);
      expect(mockEventService.findOne).toHaveBeenCalledTimes(1);
      expect(mockAppointmentService.count).toHaveBeenCalledTimes(1);
      expect(mockClientService.findOne).toHaveBeenCalledTimes(1);
      expect(forbiddenSpy).toHaveBeenCalledTimes(1);
      expect(forbiddenSpy).toHaveBeenCalledWith(
        mockRes,
        'Client does not have the covid passport and the event requires it'
      );
    };

    const clientServiceFindOneFailAsserts = async (mockReq: any) => {
      fromJsonSpy.mockResolvedValue(mockDto);
      mockEventService.findOne.mockResolvedValue(mockEvent);
      mockAppointmentService.count.mockResolvedValue(0);
      mockClientService.findOne.mockRejectedValue('error-thrown');

      setupServices(EventCreateController);

      await EventCreateController.execute(mockReq, mockRes);

      expect(fromJsonSpy).toHaveBeenCalledTimes(1);
      expect(mockEventService.findOne).toHaveBeenCalledTimes(1);
      expect(mockAppointmentService.count).toHaveBeenCalledTimes(1);
      expect(mockClientService.findOne).toHaveBeenCalledTimes(1);
      failAsserts(EventCreateController, failSpy, 'create');
    };

    const appointmentDuplicatedAsserts = async (mockReq: any) => {
      fromJsonSpy.mockResolvedValue(mockDto);
      mockEventService.findOne.mockResolvedValue(mockEvent);
      mockAppointmentService.count
        .mockResolvedValueOnce(0)
        .mockResolvedValueOnce(1);
      mockClientService.findOne.mockResolvedValue(mockClient);

      setupServices(EventCreateController);

      await EventCreateController.execute(mockReq, mockRes);

      expect(fromJsonSpy).toHaveBeenCalledTimes(1);
      expect(mockEventService.findOne).toHaveBeenCalledTimes(1);
      expect(mockAppointmentService.count).toHaveBeenCalledTimes(2);
      expect(mockClientService.findOne).toHaveBeenCalledTimes(1);
      expect(forbiddenSpy).toHaveBeenCalledTimes(1);
      expect(forbiddenSpy).toHaveBeenCalledWith(
        mockRes,
        'Client has already a place in the event'
      );
    };

    const appointmentServiceCountFailAsserts = async (mockReq: any) => {
      fromJsonSpy.mockResolvedValue(mockDto);
      mockEventService.findOne.mockResolvedValue(mockEvent);
      mockAppointmentService.count
        .mockResolvedValueOnce(0)
        .mockRejectedValueOnce('error-thrown');

      setupServices(EventCreateController);

      await EventCreateController.execute(mockReq, mockRes);

      expect(fromJsonSpy).toHaveBeenCalledTimes(1);
      expect(mockEventService.findOne).toHaveBeenCalledTimes(1);
      expect(mockAppointmentService.count).toHaveBeenCalledTimes(2);
      expect(mockClientService.findOne).toHaveBeenCalledTimes(1);
      failAsserts(EventCreateController, failSpy, 'create');
    };

    it('should create the services if does not have any', async () => {
      jest.spyOn(EventCreateController, 'fail').mockImplementation();

      EventCreateController['service'] = undefined;
      EventCreateController['eventService'] = undefined;
      EventCreateController['ownerService'] = undefined;
      EventCreateController['workerService'] = undefined;
      EventCreateController['clientService'] = undefined;

      await EventCreateController.execute({} as any, {} as any);

      expect(EventAppointmentService).toHaveBeenCalledTimes(1);
      expect(EventAppointmentService).toHaveBeenCalledWith(getRepository);
      expect(EventService).toHaveBeenCalledTimes(1);
      expect(EventService).toHaveBeenCalledWith(getRepository);
      expect(OwnerService).toHaveBeenCalledTimes(1);
      expect(OwnerService).toHaveBeenCalledWith(getRepository);
      expect(WorkerService).toHaveBeenCalledTimes(1);
      expect(WorkerService).toHaveBeenCalledWith(getRepository);
      expect(ClientService).toHaveBeenCalledTimes(1);
      expect(ClientService).toHaveBeenCalledWith(getRepository);
    });

    it('should create an EventAppointment by a client', async () => {
      fromClassSpy.mockResolvedValue(mockDto);

      const createdSpy = jest
        .spyOn(EventCreateController, 'created')
        .mockImplementation();
      setupSucessfullTests();

      await EventCreateController.execute(mockClientReq, mockRes);

      validationAsserts();
      expect(fromJsonSpy).toHaveBeenCalledTimes(1);
      expect(fromJsonSpy).toHaveBeenCalledWith(
        // Ensure client is overwritten with the token id
        { ...mockAppointment, client: mockRes.locals.token.id },
        DTOGroups.CREATE
      );
      // Additional asserts
      expect(mockDto.toClass).toHaveBeenCalledTimes(1);
      expect(mockAppointmentService.save).toHaveBeenCalledTimes(1);
      expect(mockAppointmentService.save).toHaveBeenCalledWith(mockAppointment);
      expect(fromClassSpy).toHaveBeenCalledTimes(1);
      expect(fromClassSpy).toHaveBeenCalledWith(mockEvent);
      expect(createdSpy).toHaveBeenCalledTimes(1);
      expect(createdSpy).toHaveBeenCalledWith(mockRes, mockDto);
    });

    it('should create an EventAppointment by an owner or a worker', async () => {
      setupSucessfullTests();
      const cboowSpy = jest
        .spyOn(create, 'createdByOwnerOrWorker')
        .mockImplementation();

      await EventCreateController.execute(mockReq, mockRes);

      validationAsserts();
      expect(fromJsonSpy).toHaveBeenCalledTimes(1);
      expect(fromJsonSpy).toHaveBeenCalledWith(
        mockAppointment,
        DTOGroups.CREATE
      );
      // Finally call createdByOwnerOrWorker
      expect(cboowSpy).toHaveBeenCalledTimes(1);
      expect(cboowSpy).toHaveBeenCalledWith({
        service: mockAppointmentService,
        ownerService: {},
        workerService: {},
        controller: EventCreateController,
        res: mockRes,
        fromClass: EventAppointmentDTO.fromClass,
        token: mockRes.locals.token,
        by: mockReq.query.by,
        dto: {
          ...mockDto,
          // Ensure the times are overwritten with the event times
          startTime: mockEvent.startTime,
          endTime: mockEvent.endTime
        },
        entityName: 'EventAppointment',
        workerCreatePermission: 'createEventAppointments'
      });
    });

    describe('owner/worker', () => {
      it('should send clientError on fromJson error', async () => {
        await fromJsonErrorAsserts(mockReq);
      });

      it('should send forbidden on event not found', async () => {
        await eventNotFoundAsserts(EventCreateController, mockReq, 'create');
      });

      it('should send fail on eventService.findOne error', async () => {
        await eventServiceFindOneAsserts(
          EventCreateController,
          mockReq,
          'create'
        );
      });

      it('should send forbidden if event is past', async () => {
        await pastEventAsserts(EventCreateController, mockReq, 'create');
      });

      it('should send forbidden if no places left', async () => {
        await eventCapacityAsserts(mockReq);
      });

      it('should send fail on service.count error', async () => {
        await serviceCountFailAsserts(mockReq);
      });

      it('should send forbidden if person does not exist', async () => {
        await personDoesNotExistAsserts(mockReq);
      });

      it('should send forbidden if covidPassport check does not pass', async () => {
        await covidPassportCheckAsserts(mockReq);
      });

      it('should send fail on clientService.findOne error', async () => {
        await clientServiceFindOneFailAsserts(mockReq);
      });

      it('should send forbidden if client already has a place for the event', async () => {
        await appointmentDuplicatedAsserts(mockReq);
      });

      it('should send fail on appointmentService.count error', async () => {
        await appointmentServiceCountFailAsserts(mockReq);
      });
    });

    describe('client', () => {
      it('should send clientError on fromJson error', async () => {
        await fromJsonErrorAsserts(mockClientReq);
      });

      it('should send clientError on event not found', async () => {
        await eventNotFoundAsserts(
          EventCreateController,
          mockClientReq,
          'create'
        );
      });

      it('should send fail on eventService.findOne error', async () => {
        await eventServiceFindOneAsserts(
          EventCreateController,
          mockClientReq,
          'create'
        );
      });

      it('should send forbidden if event is past', async () => {
        await pastEventAsserts(EventCreateController, mockClientReq, 'create');
      });

      it('should send forbidden if no places left', async () => {
        await eventCapacityAsserts(mockClientReq);
      });

      it('should send fail on service.count error', async () => {
        await serviceCountFailAsserts(mockClientReq);
      });

      it('should send clientError if person does not exist', async () => {
        await personDoesNotExistAsserts(mockClientReq);
      });

      it('should send forbidden if covidPassport check does not pass', async () => {
        await covidPassportCheckAsserts(mockClientReq);
      });

      it('should send fail on clientService error', async () => {
        await clientServiceFindOneFailAsserts(mockClientReq);
      });

      it('should send forbidden if client already has a place for the event', async () => {
        await appointmentDuplicatedAsserts(mockClientReq);
      });

      it('should send fail on service.count error', async () => {
        await appointmentServiceCountFailAsserts(mockClientReq);
      });

      it('should send fail on service.save error', async () => {
        fromJsonSpy.mockResolvedValue(mockDto);
        mockEventService.findOne.mockResolvedValue(mockEvent);
        mockClientService.findOne.mockResolvedValue(mockClient);
        mockAppointmentService.count.mockResolvedValue(0);
        mockAppointmentService.save.mockRejectedValue('error-thrown');

        setupServices(EventCreateController);

        await EventCreateController.execute(mockClientReq, mockRes);

        expect(fromJsonSpy).toHaveBeenCalledTimes(1);
        expect(mockEventService.findOne).toHaveBeenCalledTimes(1);
        expect(mockAppointmentService.count).toHaveBeenCalledTimes(2);
        expect(mockClientService.findOne).toHaveBeenCalledTimes(1);
        expect(mockAppointmentService.save).toHaveBeenCalledTimes(1);
        failAsserts(EventCreateController, failSpy, 'create');
      });

      it('should send fail on created error', async () => {
        fromJsonSpy.mockResolvedValue(mockDto);
        fromClassSpy.mockResolvedValue(mockDto);

        mockEventService.findOne.mockResolvedValue(mockEvent);
        mockClientService.findOne.mockResolvedValue(mockClient);
        mockAppointmentService.count.mockResolvedValue(0);
        mockAppointmentService.save.mockImplementation();

        const createdSpy = jest
          .spyOn(EventCreateController, 'created')
          .mockImplementation(() => {
            throw 'error-thrown';
          });

        setupServices(EventCreateController);

        await EventCreateController.execute(mockClientReq, mockRes);

        expect(fromJsonSpy).toHaveBeenCalledTimes(1);
        expect(mockEventService.findOne).toHaveBeenCalledTimes(1);
        expect(mockAppointmentService.count).toHaveBeenCalledTimes(2);
        expect(mockClientService.findOne).toHaveBeenCalledTimes(1);
        expect(mockAppointmentService.save).toHaveBeenCalledTimes(1);
        expect(fromClassSpy).toHaveBeenCalledTimes(1);
        expect(createdSpy).toHaveBeenCalledTimes(1);
        expect(createdSpy).toHaveBeenCalledWith(mockRes, mockDto);
        failAsserts(EventCreateController, failSpy, 'create');
      });
    });
  });

  describe('EventCancelController', () => {
    const forbiddenSpy = jest
      .spyOn(EventCancelController, 'forbidden')
      .mockImplementation();
    const failSpy = jest
      .spyOn(EventCancelController, 'fail')
      .mockImplementation();

    const appointmentNotFoundAsserts = async (mockReq: any) => {
      mockEventService.findOne.mockResolvedValue(mockEvent);
      mockAppointmentService.findOne.mockResolvedValue(undefined);

      setupServices(EventCancelController);

      await EventCancelController.execute(mockReq, mockRes);

      expect(mockEventService.findOne).toHaveBeenCalledTimes(1);
      expect(mockAppointmentService.findOne).toHaveBeenCalledTimes(1);
      expect(forbiddenSpy).toHaveBeenCalledTimes(1);
      expect(forbiddenSpy).toHaveBeenCalledWith(
        mockRes,
        'The appointment does not exist.'
      );
    };

    const appointmentCancelledAsserts = async (mockReq: any) => {
      mockEventService.findOne.mockResolvedValue(mockEvent);
      mockAppointmentService.findOne.mockResolvedValue({ cancelled: true });

      setupServices(EventCancelController);

      await EventCancelController.execute(mockReq, mockRes);

      expect(mockEventService.findOne).toHaveBeenCalledTimes(1);
      expect(mockAppointmentService.findOne).toHaveBeenCalledTimes(1);
      expect(forbiddenSpy).toHaveBeenCalledTimes(1);
      expect(forbiddenSpy).toHaveBeenCalledWith(
        mockRes,
        'The appointment is already cancelled.'
      );
    };

    const serviceFindOneFailAsserts = async (mockReq: any) => {
      mockEventService.findOne.mockResolvedValue(mockEvent);
      mockAppointmentService.findOne.mockRejectedValue('error-thrown');

      setupServices(EventCancelController);

      await EventCancelController.execute(mockReq, mockRes);

      expect(mockEventService.findOne).toHaveBeenCalledTimes(1);
      expect(mockAppointmentService.findOne).toHaveBeenCalledTimes(1);
      failAsserts(EventCancelController, failSpy, 'cancel');
    };

    it('should create the services if does not have any', async () => {
      jest.spyOn(EventCancelController, 'fail').mockImplementation();

      EventCancelController['service'] = undefined;
      EventCancelController['eventService'] = undefined;
      EventCancelController['ownerService'] = undefined;
      EventCancelController['workerService'] = undefined;
      EventCancelController['clientService'] = undefined;

      await EventCancelController.execute({} as any, {} as any);

      expect(EventAppointmentService).toHaveBeenCalledTimes(1);
      expect(EventAppointmentService).toHaveBeenCalledWith(getRepository);
      expect(EventService).toHaveBeenCalledTimes(1);
      expect(EventService).toHaveBeenCalledWith(getRepository);
      expect(OwnerService).toHaveBeenCalledTimes(1);
      expect(OwnerService).toHaveBeenCalledWith(getRepository);
      expect(WorkerService).toHaveBeenCalledTimes(1);
      expect(WorkerService).toHaveBeenCalledWith(getRepository);
      expect(ClientService).toHaveBeenCalledTimes(1);
      expect(ClientService).toHaveBeenCalledWith(getRepository);
    });

    it('should call updatedByOwnerOrWorker by an owner or worker', async () => {
      const fromClassSpy = jest
        .spyOn(EventAppointmentDTO, 'fromClass')
        .mockResolvedValue({ ...mockDto, cancelled: true });
      const uboow = jest
        .spyOn(update, 'updatedByOwnerOrWorker')
        .mockImplementation();
      mockEventService.findOne.mockResolvedValue(mockEvent);
      mockAppointmentService.findOne.mockResolvedValue(mockAppointment);

      setupServices(EventCancelController);

      await EventCancelController.execute(mockReq, mockRes);

      expect(mockEventService.findOne).toHaveBeenCalledTimes(1);
      expect(mockEventService.findOne).toHaveBeenCalledWith({
        id: mockReq.params.eId,
        options: { cache: true }
      });
      expect(mockAppointmentService.findOne).toHaveBeenCalledTimes(1);
      expect(mockAppointmentService.findOne).toHaveBeenCalledWith({
        id: mockReq.params.id,
        options: { where: { event: mockReq.params.eId }, loadRelationIds: true }
      });
      expect(fromClassSpy).toHaveBeenCalledTimes(1);
      expect(fromClassSpy).toHaveBeenCalledWith({
        ...mockAppointment,
        cancelled: true
      });
      // Finally call updatedByOwnerOrWorker
      expect(uboow).toHaveBeenCalledTimes(1);
      expect(uboow).toHaveBeenCalledWith({
        service: mockAppointmentService,
        ownerService: {},
        workerService: {},
        controller: EventCancelController,
        res: mockRes,
        token: mockRes.locals.token,
        by: mockReq.query.by,
        dto: { ...mockDto, cancelled: true },
        entityName: 'EventAppointment',
        updatableBy: '["client", "owner", "worker"]',
        countArgs: { id: mockAppointment.id },
        workerUpdatePermission: 'updateEventAppointments'
      });
    });

    it('should cancel an appointment by a client', async () => {
      mockEventService.findOne.mockResolvedValue(mockEvent);
      mockAppointmentService.findOne.mockResolvedValue(mockAppointment);

      const okSpy = jest
        .spyOn(EventCancelController, 'ok')
        .mockImplementation();
      setupServices(EventCancelController);

      await EventCancelController.execute(mockClientReq, mockRes);

      expect(mockEventService.findOne).toHaveBeenCalledTimes(1);
      expect(mockEventService.findOne).toHaveBeenCalledWith({
        id: mockReq.params.eId,
        options: { cache: true }
      });
      expect(mockAppointmentService.findOne).toHaveBeenCalledTimes(1);
      expect(mockAppointmentService.findOne).toHaveBeenCalledWith({
        id: mockReq.params.id,
        options: {
          where: { client: mockRes.locals.token.id, event: mockReq.params.eId },
          loadRelationIds: true
        }
      });
      expect(mockAppointmentService.update).toHaveBeenCalledTimes(1);
      expect(mockAppointmentService.update).toHaveBeenCalledWith(
        mockAppointment.id,
        { ...mockAppointment, cancelled: true }
      );
      expect(okSpy).toHaveBeenCalledTimes(1);
      expect(okSpy).toHaveBeenCalledWith(mockRes);
    });

    describe('owner/worker', () => {
      it('should send clientError on event not found', async () => {
        await eventNotFoundAsserts(EventCancelController, mockReq, 'cancel');
      });

      it('should send fail on eventService.findOne error', async () => {
        await eventServiceFindOneAsserts(
          EventCancelController,
          mockReq,
          'cancel'
        );
      });

      it('should send forbidden if event is past', async () => {
        await pastEventAsserts(EventCancelController, mockReq, 'cancel');
      });

      it('should send forbidden if the appointment does not exist', async () => {
        await appointmentNotFoundAsserts(mockReq);
      });

      it('should send forbidden if the appointment is already cancelled', async () => {
        await appointmentCancelledAsserts(mockReq);
      });

      it('should send fail on sevice.findOne error', async () => {
        await serviceFindOneFailAsserts(mockReq);
      });
    });

    describe('client', () => {
      it('should send clientError on event not found', async () => {
        await eventNotFoundAsserts(
          EventCancelController,
          mockClientReq,
          'cancel'
        );
      });

      it('should send fail on eventService.findOne error', async () => {
        await eventServiceFindOneAsserts(
          EventCancelController,
          mockClientReq,
          'cancel'
        );
      });

      it('should send forbidden if event is past', async () => {
        await pastEventAsserts(EventCancelController, mockClientReq, 'cancel');
      });

      it('should send forbidden if the appointment does not exist', async () => {
        await appointmentNotFoundAsserts(mockClientReq);
      });

      it('should send forbidden if the appointment is already cancelled', async () => {
        await appointmentCancelledAsserts(mockClientReq);
      });

      it('should send fail on sevice.findOne error', async () => {
        await serviceFindOneFailAsserts(mockClientReq);
      });

      it('should send fail on service.delete error', async () => {
        mockEventService.findOne.mockResolvedValue(mockEvent);
        mockAppointmentService.findOne.mockResolvedValue(mockAppointment);
        mockAppointmentService.update.mockRejectedValueOnce('error-thrown');

        setupServices(EventCancelController);

        await EventCancelController.execute(mockClientReq, mockRes);

        expect(mockEventService.findOne).toHaveBeenCalledTimes(1);
        expect(mockAppointmentService.findOne).toHaveBeenCalledTimes(1);
        expect(mockAppointmentService.update).toHaveBeenCalledTimes(1);
        failAsserts(EventCancelController, failSpy, 'cancel');
      });

      it('should send fail on ok error', async () => {
        mockEventService.findOne.mockResolvedValue(mockEvent);
        mockAppointmentService.findOne.mockResolvedValue(mockAppointment);
        mockAppointmentService.update.mockResolvedValue({});

        const okSpy = jest
          .spyOn(EventCancelController, 'ok')
          .mockImplementation(() => {
            throw 'error-thrown';
          });

        setupServices(EventCancelController);

        await EventCancelController.execute(mockClientReq, mockRes);

        expect(mockEventService.findOne).toHaveBeenCalledTimes(1);
        expect(mockAppointmentService.findOne).toHaveBeenCalledTimes(1);
        expect(mockAppointmentService.update).toHaveBeenCalledTimes(1);
        expect(okSpy).toHaveBeenCalledTimes(1);
        expect(okSpy).toHaveBeenCalledWith(mockRes);
        failAsserts(EventCancelController, failSpy, 'cancel');
      });
    });
  });

  describe('EventDeleteController', () => {
    it('should create the services if does not have any', async () => {
      jest.spyOn(EventDeleteController, 'fail').mockImplementation();

      EventDeleteController['service'] = undefined;
      EventDeleteController['eventService'] = undefined;
      EventDeleteController['ownerService'] = undefined;
      EventDeleteController['workerService'] = undefined;
      EventDeleteController['clientService'] = undefined;

      await EventDeleteController.execute({} as any, {} as any);

      expect(EventAppointmentService).toHaveBeenCalledTimes(1);
      expect(EventAppointmentService).toHaveBeenCalledWith(getRepository);
      expect(EventService).toHaveBeenCalledTimes(1);
      expect(EventService).toHaveBeenCalledWith(getRepository);
      expect(OwnerService).toHaveBeenCalledTimes(1);
      expect(OwnerService).toHaveBeenCalledWith(getRepository);
      expect(WorkerService).toHaveBeenCalledTimes(1);
      expect(WorkerService).toHaveBeenCalledWith(getRepository);
      expect(ClientService).toHaveBeenCalledTimes(1);
      expect(ClientService).toHaveBeenCalledWith(getRepository);
    });

    it('should call deletedByOwnerOrWorker by an owner or worker', async () => {
      const dboow = jest
        .spyOn(deleteHelpers, 'deletedByOwnerOrWorker')
        .mockImplementation();
      mockEventService.findOne.mockResolvedValue(mockEvent);

      setupServices(EventDeleteController);

      await EventDeleteController.execute(mockReq, mockRes);

      expect(mockEventService.findOne).toHaveBeenCalledTimes(1);
      expect(mockEventService.findOne).toHaveBeenCalledWith({
        id: mockReq.params.eId,
        options: { cache: true }
      });
      expect(dboow).toHaveBeenCalledTimes(1);
      expect(dboow).toHaveBeenCalledWith({
        service: mockAppointmentService,
        ownerService: {},
        workerService: {},
        controller: EventDeleteController,
        res: mockRes,
        token: mockRes.locals.token,
        by: mockReq.query.by,
        entityId: mockReq.params.id,
        entityName: 'EventAppointment',
        countArgs: { id: mockReq.params.id },
        workerDeletePermission: 'deleteEventAppointments'
      });
    });

    it('should call deletedByClient', async () => {
      fromJsonSpy.mockResolvedValue(mockDto);
      mockEventService.findOne.mockResolvedValue(mockEvent);
      mockAppointmentService.count.mockResolvedValue(1);

      const dbc = jest
        .spyOn(deleteHelpers, 'deletedByClient')
        .mockImplementation();

      setupServices(EventDeleteController);

      await EventDeleteController.execute(mockClientReq, mockRes);

      expect(mockEventService.findOne).toHaveBeenCalledTimes(1);
      expect(mockEventService.findOne).toHaveBeenCalledWith({
        id: mockClientReq.params.eId,
        options: { cache: true }
      });
      expect(dbc).toHaveBeenCalledTimes(1);
      expect(dbc).toHaveBeenCalledWith({
        service: mockAppointmentService,
        clientService: mockClientService,
        controller: EventDeleteController,
        res: mockRes,
        entityId: mockClientReq.params.id,
        clientId: mockRes.locals.token.id,
        countArgs: {
          id: mockClientReq.params.id,
          event: mockClientReq.params.eId,
          client: mockRes.locals.token.id
        },
        entityName: 'EventAppointment'
      });
    });

    describe('owner/worker', () => {
      it('should send clientError on event not found', async () => {
        await eventNotFoundAsserts(EventDeleteController, mockReq, 'delete');
      });

      it('should send fail on eventService.findOne error', async () => {
        await eventServiceFindOneAsserts(
          EventDeleteController,
          mockReq,
          'delete'
        );
      });

      it('should send forbidden if event is past', async () => {
        await pastEventAsserts(EventDeleteController, mockReq, 'delete');
      });
    });

    describe('client', () => {
      it('should send clientError on event not found', async () => {
        await eventNotFoundAsserts(
          EventDeleteController,
          mockClientReq,
          'delete'
        );
      });

      it('should send fail on eventService.findOne error', async () => {
        await eventServiceFindOneAsserts(
          EventDeleteController,
          mockClientReq,
          'delete'
        );
      });

      it('should send forbidden if event is past', async () => {
        await pastEventAsserts(EventDeleteController, mockClientReq, 'delete');
      });
    });
  });
});
