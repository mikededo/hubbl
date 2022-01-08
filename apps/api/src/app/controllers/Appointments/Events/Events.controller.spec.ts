import { getRepository } from 'typeorm';

import { DTOGroups, EventAppointmentDTO } from '@hubbl/shared/models/dto';

import {
  ClientService,
  EventAppointmentService,
  EventService,
  OwnerService,
  WorkerService
} from '../../../services';
import * as create from '../../helpers/create';
import { EventCreateController } from './Events.controller';
import { Event } from '@hubbl/shared/models/entities';

jest.mock('../../../services');
jest.mock('@hubbl/shared/models/dto');

/**
 * Create mock event using the Event constructor so
 * `instanceof` checks do not fail
 */
const createMockEvent = (): Event => {
  const result = new Event();

  result.id = 1;
  result.capacity = 25;
  result.covidPassport = true;
  result.startTime = '10:00:00';
  result.endTime = '11:00:00';
  result.date = { year: 2050, month: 6, day: 29 } as any;

  return result;
};

// TODO: Failing tests

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

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('EventCreateController', () => {
    const validationAsserts = () => {
      // Event validation
      expect(mockEventService.findOne).toHaveBeenCalledTimes(1);
      expect(mockEventService.findOne).toHaveBeenCalledWith(mockDto.event);
      expect(mockAppointmentService.count).toHaveBeenCalledWith({
        event: mockDto.event
      });
      // Client validation
      expect(mockClientService.findOne).toHaveBeenCalledTimes(1);
      expect(mockClientService.findOne).toHaveBeenCalledWith(mockDto.client);
    };

    const setupSucessfullTests = () => {
      fromJsonSpy.mockResolvedValue(mockDto);
      mockEventService.findOne.mockResolvedValue(mockEvent);
      mockAppointmentService.count.mockResolvedValue(0);
      mockClientService.findOne.mockResolvedValue(mockClient);

      EventCreateController['service'] = mockAppointmentService as any;
      EventCreateController['eventService'] = mockEventService as any;
      EventCreateController['clientService'] = mockClientService as any;
      EventCreateController['ownerService'] = {} as any;
      EventCreateController['workerService'] = {} as any;
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
  });
});
