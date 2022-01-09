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
import { EventCreateController } from './Events.controller';

jest.mock('../../../services');
jest.mock('@hubbl/shared/models/dto');

/**
 * Create mock event using the Event constructor so
 * `instanceof` checks do not fail
 */
const createMockEvent = (capacity = 25): Event => {
  const result = new Event();

  result.id = 1;
  result.capacity = capacity;
  result.covidPassport = true;
  result.startTime = '10:00:00';
  result.endTime = '11:00:00';
  result.date = { year: 2050, month: 6, day: 29 } as any;

  return result;
};

// TODO: Test endpoints
// Time 2h

describe('Appointments.Event controller', () => {
  const mockEvent = createMockEvent();
  const mockAppointment = {
    id: 1,
    startTime: '09:00:00',
    endTime: '10:00:00',
    cancelled: false,
    client: 1,
    event: 1
  };
  const mockClient = { covidPassport: true };
  const mockDto = {
    ...mockAppointment,
    toClass: jest.fn().mockReturnValue(mockAppointment)
  } as any;

  const mockReq = { query: { by: 'owner' }, body: mockAppointment } as any;
  const mockClientReq = { ...mockReq, query: { by: 'client' } } as any;
  const mockRes = { locals: { token: { id: 2 } } } as any;

  // Services
  const mockAppointmentService = { count: jest.fn(), save: jest.fn() };
  const mockEventService = { findOne: jest.fn() };
  const mockClientService = { findOne: jest.fn() };

  const fromJsonSpy = jest.spyOn(EventAppointmentDTO, 'fromJson');
  const clientErrorSpy = jest
    .spyOn(EventCreateController, 'clientError')
    .mockReturnValue({} as any);
  const forbiddenSpy = jest
    .spyOn(EventCreateController, 'forbidden')
    .mockReturnValue({} as any);
  const failSpy = jest
    .spyOn(EventCreateController, 'fail')
    .mockReturnValue({} as any);

  const logSpy = jest.spyOn(npmlog, 'error').mockImplementation();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('EventCreateController', () => {
    const validationAsserts = () => {
      // Event validation
      expect(mockEventService.findOne).toHaveBeenCalledTimes(1);
      expect(mockEventService.findOne).toHaveBeenCalledWith(mockDto.event);
      expect(mockAppointmentService.count).toHaveBeenCalledTimes(2);
      expect(mockAppointmentService.count).toHaveBeenNthCalledWith(1, {
        event: mockDto.event
      });
      expect(mockAppointmentService.count).toHaveBeenNthCalledWith(2, {
        client: mockDto.client,
        event: mockDto.event
      });
      // Client validation
      expect(mockClientService.findOne).toHaveBeenCalledTimes(1);
      expect(mockClientService.findOne).toHaveBeenCalledWith(mockDto.client);
    };

    const failAsserts = () => {
      expect(logSpy).toHaveBeenCalledTimes(1);
      expect(logSpy).toHaveBeenCalledWith(
        `Controller[${EventCreateController.constructor.name}]`,
        '"create" handler',
        'error-thrown'
      );
      expect(failSpy).toHaveBeenCalledTimes(1);
      expect(failSpy).toHaveBeenCalledWith(
        mockRes,
        'Internal server error. If the error persists, contact our team'
      );
    };

    const setupControllers = () => {
      EventCreateController['service'] = mockAppointmentService as any;
      EventCreateController['eventService'] = mockEventService as any;
      EventCreateController['clientService'] = mockClientService as any;
      EventCreateController['ownerService'] = {} as any;
      EventCreateController['workerService'] = {} as any;
    };

    const setupSucessfullTests = () => {
      fromJsonSpy.mockResolvedValue(mockDto);
      mockEventService.findOne.mockResolvedValue(mockEvent);
      mockAppointmentService.count.mockResolvedValue(0);
      mockClientService.findOne.mockResolvedValue(mockClient);

      setupControllers();
    };

    const fromJsonErrorAsserts = async (mockReq: any) => {
      fromJsonSpy.mockRejectedValue({});

      setupControllers();

      await EventCreateController.execute(mockReq, mockRes);

      expect(fromJsonSpy).toHaveBeenCalledTimes(1);
      expect(clientErrorSpy).toHaveBeenCalledTimes(1);
      expect(clientErrorSpy).toHaveBeenCalledWith(mockRes, {});
    };

    const eventNotFoundAsserts = async (mockReq: any) => {
      fromJsonSpy.mockResolvedValue(mockDto);
      mockEventService.findOne.mockResolvedValue(undefined);

      await EventCreateController.execute(mockReq, mockRes);

      expect(fromJsonSpy).toHaveBeenCalledTimes(1);
      expect(mockEventService.findOne).toHaveBeenCalledTimes(1);
      expect(clientErrorSpy).toHaveBeenCalledTimes(1);
      expect(clientErrorSpy).toHaveBeenCalledWith(
        mockRes,
        'Event to create the appointment does not exist'
      );
    };

    const eventServiceFindOneAsserts = async (mockReq: any) => {
      fromJsonSpy.mockResolvedValue(mockDto);
      mockEventService.findOne.mockRejectedValue('error-thrown');

      await EventCreateController.execute(mockReq, mockRes);

      expect(fromJsonSpy).toHaveBeenCalledTimes(1);
      expect(mockEventService.findOne).toHaveBeenCalledTimes(1);
      failAsserts();
    };

    const pastEventAsserts = async (mockRes: any) => {
      fromJsonSpy.mockResolvedValue(mockDto);
      mockEventService.findOne.mockResolvedValue({
        ...mockEvent,
        date: { year: 2000, month: 6, day: 29 }
      });

      setupControllers();

      await EventCreateController.execute(mockReq, mockRes);

      expect(fromJsonSpy).toHaveBeenCalledTimes(1);
      expect(mockEventService.findOne).toHaveBeenCalledTimes(1);
      expect(forbiddenSpy).toHaveBeenCalledTimes(1);
      expect(forbiddenSpy).toHaveBeenCalledWith(
        mockRes,
        'Can not create an appointment to a past event'
      );
    };

    const eventCapacityAsserts = async (mockReq: any) => {
      fromJsonSpy.mockResolvedValue(mockDto);
      mockEventService.findOne.mockResolvedValue(createMockEvent(5));
      mockAppointmentService.count.mockResolvedValue(6);

      setupControllers();

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

      setupControllers();

      await EventCreateController.execute(mockReq, mockRes);

      expect(fromJsonSpy).toHaveBeenCalledTimes(1);
      expect(mockEventService.findOne).toHaveBeenCalledTimes(1);
      failAsserts();
    };

    const personDoesNotExistAsserts = async (mockReq: any) => {
      fromJsonSpy.mockResolvedValue(mockDto);
      mockEventService.findOne.mockResolvedValue(mockEvent);
      mockAppointmentService.count.mockResolvedValue(0);
      mockClientService.findOne.mockResolvedValue(undefined);

      setupControllers();

      await EventCreateController.execute(mockReq, mockRes);

      expect(fromJsonSpy).toHaveBeenCalledTimes(1);
      expect(mockEventService.findOne).toHaveBeenCalledTimes(1);
      expect(mockAppointmentService.count).toHaveBeenCalledTimes(1);
      expect(mockClientService.findOne).toHaveBeenCalledTimes(1);
      expect(clientErrorSpy).toHaveBeenCalledTimes(1);
      expect(clientErrorSpy).toHaveBeenCalledWith(
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

      setupControllers();

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

      setupControllers();

      await EventCreateController.execute(mockReq, mockRes);

      expect(fromJsonSpy).toHaveBeenCalledTimes(1);
      expect(mockEventService.findOne).toHaveBeenCalledTimes(1);
      expect(mockAppointmentService.count).toHaveBeenCalledTimes(1);
      expect(mockClientService.findOne).toHaveBeenCalledTimes(1);
      failAsserts();
    };

    const appointmentDuplicatedAsserts = async (mockReq: any) => {
      fromJsonSpy.mockResolvedValue(mockDto);
      mockEventService.findOne.mockResolvedValue(mockEvent);
      mockAppointmentService.count
        .mockResolvedValueOnce(0)
        .mockResolvedValueOnce(1);
      mockClientService.findOne.mockResolvedValue(mockClient);

      setupControllers();

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

      setupControllers();

      await EventCreateController.execute(mockReq, mockRes);

      expect(fromJsonSpy).toHaveBeenCalledTimes(1);
      expect(mockEventService.findOne).toHaveBeenCalledTimes(1);
      expect(mockAppointmentService.count).toHaveBeenCalledTimes(2);
      expect(mockClientService.findOne).toHaveBeenCalledTimes(1);
      failAsserts();
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
      const okSpy = jest
        .spyOn(EventCreateController, 'ok')
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
      expect(okSpy).toHaveBeenCalledTimes(1);
      expect(okSpy).toHaveBeenCalledWith(mockRes);
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

      it('should send clientError on event not found', async () => {
        await eventNotFoundAsserts(mockReq);
      });

      it('should send fail on eventService.findOne error', async () => {
        await eventServiceFindOneAsserts(mockReq);
      });

      it('should send forbidden if event is past', async () => {
        await pastEventAsserts(mockReq);
      });

      it('should send forbidden if no places left', async () => {
        await eventCapacityAsserts(mockReq);
      });

      it('should send fail on service.count error', async () => {
        await serviceCountFailAsserts(mockReq);
      });

      it('should send clientError if person does not exist', async () => {
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
        await eventNotFoundAsserts(mockClientReq);
      });

      it('should send fail on eventService.findOne error', async () => {
        await eventServiceFindOneAsserts(mockClientReq);
      });

      it('should send forbidden if event is past', async () => {
        await pastEventAsserts(mockClientReq);
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

      it('should send fail on appointmentService.count error', async () => {
        await appointmentServiceCountFailAsserts(mockClientReq);
      });

      it('should send fail on appointmentService.save error', async () => {
        fromJsonSpy.mockResolvedValue(mockDto);
        mockEventService.findOne.mockResolvedValue(mockEvent);
        mockClientService.findOne.mockResolvedValue(mockClient);
        mockAppointmentService.count.mockResolvedValue(0);
        mockAppointmentService.save.mockRejectedValue('error-thrown');

        setupControllers();

        await EventCreateController.execute(mockClientReq, mockRes);

        expect(fromJsonSpy).toHaveBeenCalledTimes(1);
        expect(mockEventService.findOne).toHaveBeenCalledTimes(1);
        expect(mockAppointmentService.count).toHaveBeenCalledTimes(2);
        expect(mockClientService.findOne).toHaveBeenCalledTimes(1);
        expect(mockAppointmentService.save).toHaveBeenCalledTimes(1);
        failAsserts();
      });

      it('should send fail on ok error', async () => {
        fromJsonSpy.mockResolvedValue(mockDto);
        mockEventService.findOne.mockResolvedValue(mockEvent);
        mockClientService.findOne.mockResolvedValue(mockClient);
        mockAppointmentService.count.mockResolvedValue(0);
        mockAppointmentService.save.mockImplementation();

        const okSpy = jest
          .spyOn(EventCreateController, 'ok')
          .mockImplementation(() => {
            throw 'error-thrown';
          });

        setupControllers();

        await EventCreateController.execute(mockClientReq, mockRes);

        expect(fromJsonSpy).toHaveBeenCalledTimes(1);
        expect(mockEventService.findOne).toHaveBeenCalledTimes(1);
        expect(mockAppointmentService.count).toHaveBeenCalledTimes(2);
        expect(mockClientService.findOne).toHaveBeenCalledTimes(1);
        expect(mockAppointmentService.save).toHaveBeenCalledTimes(1);
        expect(okSpy).toHaveBeenCalledTimes(1);
        expect(okSpy).toHaveBeenCalledWith(mockRes);
        failAsserts();
      });
    });
  });
});
