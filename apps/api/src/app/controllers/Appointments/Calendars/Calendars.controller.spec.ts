import npmlog = require('npmlog');
import { getRepository } from 'typeorm';

import { CalendarAppointmentDTO, DTOGroups } from '@hubbl/shared/models/dto';
import { CalendarDate, GymZone } from '@hubbl/shared/models/entities';

import { queries } from '../../../constants';
import {
  CalendarAppointmentService,
  ClientService,
  GymZoneService,
  OwnerService,
  WorkerService
} from '../../../services';
import * as create from '../../helpers/create';
import { CalendarCreateController } from './Calendars.controller';

type TypesOfControllers = typeof CalendarCreateController;

type Operations = 'create';

jest.mock('../../../services');
jest.mock('@hubbl/shared/models/dto');

const createMockGymZone = (capacity = 5): GymZone => {
  const result = new GymZone();

  result.id = 1;
  result.capacity = capacity;
  result.openTime = '06:00:00';
  result.closeTime = '23:00:00';
  result.covidPassport = true;

  return result;
};

const createMockAppointment = (appointment: any): CalendarAppointmentDTO => {
  const result = new CalendarAppointmentDTO();

  result.id = appointment.id ?? 1;
  result.startTime = appointment.startTime ?? '09:00:00';
  result.endTime = appointment.endTime ?? '10:00:00';
  result.cancelled = appointment.cancelled ?? false;
  result.client = appointment.client ?? 1;
  result.calendar = appointment.calendar ?? 1;
  result.date =
    appointment.date ?? ({ year: 2022, month: 6, day: 29 } as CalendarDate);

  result.toClass = jest.fn().mockReturnValue(appointment);

  return result;
};

describe('Appointments.Calendar controller', () => {
  const mockGymZone = createMockGymZone();
  const mockAppointment = {
    id: 1,
    startTime: '09:00:00',
    endTime: '10:00:00',
    cancelled: false,
    client: 1,
    calendar: 1,
    date: { year: 2022, month: 6, day: 29 }
  };
  const mockClient = { covidPassport: true };
  const mockDto = createMockAppointment(mockAppointment);

  const mockReq = {
    query: { by: 'owner' },
    body: mockAppointment,
    params: { eId: 1, id: 1 }
  } as any;
  const mockClientReq = { ...mockReq, query: { by: 'client' } } as any;
  const mockRes = { locals: { token: { id: 2 } } } as any;

  // Services
  const mockAppointmentService = {
    count: jest.fn(),
    save: jest.fn(),
    manager: { query: jest.fn() }
  };
  const mockGymZoneService = { findOne: jest.fn() };
  const mockClientService = { findOne: jest.fn() };

  const fromJsonSpy = jest.spyOn(CalendarAppointmentDTO, 'fromJson');
  const fromClassSpy = jest.spyOn(CalendarAppointmentDTO, 'fromClass');

  const logSpy = jest.spyOn(npmlog, 'error').mockImplementation();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const setupServices = (controller: TypesOfControllers) => {
    controller['service'] = mockAppointmentService as any;
    controller['gymZoneService'] = mockGymZoneService as any;
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

  const setupSucessfullTests = () => {
    fromJsonSpy.mockResolvedValue(mockDto);
    mockGymZoneService.findOne.mockResolvedValue(mockGymZone);
    mockAppointmentService.manager.query.mockResolvedValue({ max: 0 });
    mockAppointmentService.count.mockResolvedValue(0);
    mockClientService.findOne.mockResolvedValue(mockClient);
    mockAppointmentService.save.mockResolvedValue(mockAppointment);

    setupServices(CalendarCreateController);
  };

  const validTimeAsserts = async (
    controller: TypesOfControllers,
    mockReq: any
  ) => {
    const forbiddenSpy = jest
      .spyOn(controller, 'forbidden')
      .mockReturnValue({} as any);

    fromJsonSpy.mockResolvedValue({
      startTime: '10:00:00',
      endTime: '09:00:00'
    } as any);

    setupServices(controller);

    await controller.execute(mockReq, mockRes);

    expect(fromJsonSpy).toHaveBeenCalledTimes(1);
    expect(forbiddenSpy).toHaveBeenCalledTimes(1);
    expect(forbiddenSpy).toHaveBeenCalledWith(
      mockRes,
      'End time of the appointment must be after the appointment.'
    );
  };

  const pastEventAsserts = async (
    controller: TypesOfControllers,
    mockReq: any,
    operation: Operations
  ) => {
    const forbiddenSpy = jest
      .spyOn(controller, 'forbidden')
      .mockReturnValue({} as any);

    fromJsonSpy.mockResolvedValue({
      ...mockAppointment,
      date: { year: 2000, month: 6, day: 29 } as any
    } as any);

    setupServices(controller);

    await controller.execute(mockReq, mockRes);

    expect(fromJsonSpy).toHaveBeenCalledTimes(1);
    expect(forbiddenSpy).toHaveBeenCalledTimes(1);
    expect(forbiddenSpy).toHaveBeenCalledWith(
      mockRes,
      `Can not ${operation} an appointment to a past event`
    );
  };

  const findGymZoneErrorAsserts = async (
    controller: TypesOfControllers,
    mockReq: any,
    operation: Operations
  ) => {
    const failSpy = jest.spyOn(controller, 'fail').mockReturnValue({} as any);

    fromJsonSpy.mockResolvedValue(mockAppointment as any);
    mockGymZoneService.findOne.mockRejectedValue('error-thrown');

    setupServices(controller);

    await controller.execute(mockReq, mockRes);

    expect(fromJsonSpy).toHaveBeenCalledTimes(1);
    expect(mockGymZoneService.findOne).toHaveBeenCalledTimes(1);
    failAsserts(controller, failSpy, operation);
  };

  const outsideGymScheduleAsserts = async (
    controller: TypesOfControllers,
    mockReq: any,
    operation: Operations
  ) => {
    const forbiddenSpy = jest
      .spyOn(controller, 'forbidden')
      .mockReturnValue({} as any);

    fromJsonSpy.mockResolvedValue({
      ...mockAppointment,
      startTime: '00:00:00',
      endTime: '23:59:59'
    } as any);
    mockGymZoneService.findOne.mockResolvedValue(mockGymZone);

    setupServices(controller);

    await controller.execute(mockReq, mockRes);

    expect(fromJsonSpy).toHaveBeenCalledTimes(1);
    expect(mockGymZoneService.findOne).toHaveBeenCalledTimes(1);
    expect(forbiddenSpy).toHaveBeenCalledTimes(1);
    expect(forbiddenSpy).toHaveBeenCalledWith(
      mockRes,
      `Can not ${operation} an appointment if gym zone is closed.`
    );
  };

  const gymZoneCapacityAsserts = async (
    controller: TypesOfControllers,
    mockReq: any
  ) => {
    const forbiddenSpy = jest
      .spyOn(controller, 'forbidden')
      .mockReturnValue({} as any);

    fromJsonSpy.mockResolvedValue(mockAppointment as any);
    mockGymZoneService.findOne.mockResolvedValue(mockGymZone);
    mockAppointmentService.manager.query.mockResolvedValue({
      max: mockGymZone.capacity
    });

    setupServices(controller);

    await controller.execute(mockReq, mockRes);

    expect(fromJsonSpy).toHaveBeenCalledTimes(1);
    expect(mockGymZoneService.findOne).toHaveBeenCalledTimes(1);
    expect(mockAppointmentService.manager.query).toHaveBeenCalledTimes(1);
    expect(forbiddenSpy).toHaveBeenCalledTimes(1);
    expect(forbiddenSpy).toHaveBeenCalledWith(
      mockRes,
      'Gym zone is full at the selected interval.'
    );
  };

  const maxConcurrencyErrorAsserts = async (
    controller: TypesOfControllers,
    mockReq: any
  ) => {
    const failSpy = jest.spyOn(controller, 'fail').mockReturnValue({} as any);

    fromJsonSpy.mockResolvedValue(mockAppointment as any);
    mockGymZoneService.findOne.mockResolvedValue(mockGymZone);
    mockAppointmentService.manager.query.mockRejectedValue('error-thrown');

    setupServices(controller);

    await controller.execute(mockReq, mockRes);

    expect(fromJsonSpy).toHaveBeenCalledTimes(1);
    expect(mockGymZoneService.findOne).toHaveBeenCalledTimes(1);
    expect(mockAppointmentService.manager.query).toHaveBeenCalledTimes(1);
    failAsserts(controller, failSpy, 'create');
  };

  const personDoesNotExistAsserts = async (
    controller: TypesOfControllers,
    mockReq: any
  ) => {
    const forbiddenSpy = jest
      .spyOn(controller, 'forbidden')
      .mockReturnValue({} as any);

    fromJsonSpy.mockResolvedValue(mockAppointment as any);
    mockGymZoneService.findOne.mockResolvedValue(mockGymZone);
    mockAppointmentService.manager.query.mockResolvedValue(0);
    mockClientService.findOne.mockResolvedValue(undefined);

    setupServices(controller);

    await controller.execute(mockReq, mockRes);

    expect(fromJsonSpy).toHaveBeenCalledTimes(1);
    expect(mockGymZoneService.findOne).toHaveBeenCalledTimes(1);
    expect(mockAppointmentService.manager.query).toHaveBeenCalledTimes(1);
    expect(mockClientService.findOne).toHaveBeenCalledTimes(1);
    expect(forbiddenSpy).toHaveBeenCalledTimes(1);
    expect(forbiddenSpy).toHaveBeenCalledWith(
      mockRes,
      'Person does not exist.'
    );
  };

  const covidPassportCheckAsserts = async (
    controller: TypesOfControllers,
    mockReq: any
  ) => {
    const forbiddenSpy = jest
      .spyOn(controller, 'forbidden')
      .mockReturnValue({} as any);

    fromJsonSpy.mockResolvedValue(mockAppointment as any);
    mockGymZoneService.findOne.mockResolvedValue(mockGymZone);
    mockAppointmentService.manager.query.mockResolvedValue(0);
    mockClientService.findOne.mockResolvedValue({
      covidPassport: false
    });

    setupServices(controller);

    await controller.execute(mockReq, mockRes);

    expect(fromJsonSpy).toHaveBeenCalledTimes(1);
    expect(mockGymZoneService.findOne).toHaveBeenCalledTimes(1);
    expect(mockAppointmentService.manager.query).toHaveBeenCalledTimes(1);
    expect(mockClientService.findOne).toHaveBeenCalledTimes(1);
    expect(forbiddenSpy).toHaveBeenCalledTimes(1);
    expect(forbiddenSpy).toHaveBeenCalledWith(
      mockRes,
      'Client does not have the covid passport and the gym zone requires it.'
    );
  };

  const clientServiceFindOneFailAsserts = async (
    controller: TypesOfControllers,
    mockReq: any,
    operation: Operations
  ) => {
    const failSpy = jest.spyOn(controller, 'fail').mockReturnValue({} as any);

    fromJsonSpy.mockResolvedValue(mockAppointment as any);
    mockGymZoneService.findOne.mockResolvedValue(mockGymZone);
    mockAppointmentService.manager.query.mockResolvedValue(0);
    mockClientService.findOne.mockRejectedValue('error-thrown');

    setupServices(controller);

    await controller.execute(mockReq, mockRes);

    expect(fromJsonSpy).toHaveBeenCalledTimes(1);
    expect(mockGymZoneService.findOne).toHaveBeenCalledTimes(1);
    expect(mockAppointmentService.manager.query).toHaveBeenCalledTimes(1);
    expect(mockClientService.findOne).toHaveBeenCalledTimes(1);
    failAsserts(controller, failSpy, operation);
  };

  const appointmentOverlapAsserts = async (
    controller: TypesOfControllers,
    mockReq: any
  ) => {
    const forbiddenSpy = jest
      .spyOn(controller, 'forbidden')
      .mockReturnValue({} as any);

    fromJsonSpy.mockResolvedValue(mockAppointment as any);
    mockGymZoneService.findOne.mockResolvedValue(mockGymZone);
    mockAppointmentService.manager.query.mockResolvedValue(0);
    mockClientService.findOne.mockResolvedValue(mockClient);
    mockAppointmentService.count.mockResolvedValue(1);

    setupServices(controller);

    await controller.execute(mockReq, mockRes);

    expect(fromJsonSpy).toHaveBeenCalledTimes(1);
    expect(mockGymZoneService.findOne).toHaveBeenCalledTimes(1);
    expect(mockAppointmentService.manager.query).toHaveBeenCalledTimes(1);
    expect(mockClientService.findOne).toHaveBeenCalledTimes(1);
    expect(mockAppointmentService.count).toHaveBeenCalledTimes(1);
    expect(forbiddenSpy).toHaveBeenCalledTimes(1);
    expect(forbiddenSpy).toHaveBeenCalledWith(
      mockRes,
      'Client has already an appointment at this time interval.'
    );
  };

  const serviceCountFailAsserts = async (
    controller: TypesOfControllers,
    mockReq: any,
    operation: Operations
  ) => {
    const failSpy = jest.spyOn(controller, 'fail').mockReturnValue({} as any);

    fromJsonSpy.mockResolvedValue(mockAppointment as any);
    mockGymZoneService.findOne.mockResolvedValue(mockGymZone);
    mockAppointmentService.manager.query.mockResolvedValue(0);
    mockClientService.findOne.mockResolvedValue(mockClient);
    mockAppointmentService.count.mockRejectedValue('error-thrown');

    setupServices(controller);

    await controller.execute(mockReq, mockRes);

    expect(fromJsonSpy).toHaveBeenCalledTimes(1);
    expect(mockGymZoneService.findOne).toHaveBeenCalledTimes(1);
    expect(mockAppointmentService.manager.query).toHaveBeenCalledTimes(1);
    expect(mockClientService.findOne).toHaveBeenCalledTimes(1);
    expect(mockAppointmentService.count).toHaveBeenCalledTimes(1);
    failAsserts(controller, failSpy, operation);
  };

  describe('CalendarCreateController', () => {
    const clientErrorSpy = jest
      .spyOn(CalendarCreateController, 'clientError')
      .mockReturnValue({} as any);
    const failSpy = jest
      .spyOn(CalendarCreateController, 'fail')
      .mockReturnValue({} as any);

    const validationAsserts = () => {
      // Event validation
      expect(mockGymZoneService.findOne).toHaveBeenCalledTimes(1);
      expect(mockGymZoneService.findOne).toHaveBeenCalledWith({
        options: { where: { calendar: mockDto.calendar } }
      });
      expect(mockAppointmentService.manager.query).toHaveBeenCalledTimes(1);
      expect(mockAppointmentService.manager.query).toHaveBeenCalledWith(
        queries.MAX_CONCURRENT_EVENTS_DAY,
        [
          mockAppointment.date.year,
          mockAppointment.date.month,
          mockAppointment.date.day,
          mockAppointment.startTime,
          mockAppointment.endTime,
          mockAppointment.calendar
        ]
      );
      expect(mockAppointmentService.count).toHaveBeenCalledTimes(1);
      expect(mockAppointmentService.count).toHaveBeenCalledWith({
        client: mockAppointment.client,
        startTime: mockAppointment.startTime,
        endTime: mockAppointment.endTime,
        date: mockAppointment.date,
        cancelled: false
      });
      // Client validation
      expect(mockClientService.findOne).toHaveBeenCalledTimes(1);
      expect(mockClientService.findOne).toHaveBeenCalledWith({
        id: mockDto.client
      });
    };

    const fromJsonErrorAsserts = async (mockReq: any) => {
      fromJsonSpy.mockRejectedValue({});

      setupServices(CalendarCreateController);

      await CalendarCreateController.execute(mockReq, mockRes);

      expect(fromJsonSpy).toHaveBeenCalledTimes(1);
      expect(clientErrorSpy).toHaveBeenCalledTimes(1);
      expect(clientErrorSpy).toHaveBeenCalledWith(mockRes, {});
    };

    it('should create the services if does not have any', async () => {
      jest.spyOn(CalendarCreateController, 'fail').mockImplementation();

      CalendarCreateController['service'] = undefined;
      CalendarCreateController['gymZoneService'] = undefined;
      CalendarCreateController['ownerService'] = undefined;
      CalendarCreateController['workerService'] = undefined;
      CalendarCreateController['clientService'] = undefined;

      await CalendarCreateController.execute({} as any, {} as any);

      expect(CalendarAppointmentService).toHaveBeenCalledTimes(1);
      expect(CalendarAppointmentService).toHaveBeenCalledWith(getRepository);
      expect(GymZoneService).toHaveBeenCalledTimes(1);
      expect(GymZoneService).toHaveBeenCalledWith(getRepository);
      expect(OwnerService).toHaveBeenCalledTimes(1);
      expect(OwnerService).toHaveBeenCalledWith(getRepository);
      expect(WorkerService).toHaveBeenCalledTimes(1);
      expect(WorkerService).toHaveBeenCalledWith(getRepository);
      expect(ClientService).toHaveBeenCalledTimes(1);
      expect(ClientService).toHaveBeenCalledWith(getRepository);
    });

    it('should create a CalendarAppointment by a client', async () => {
      fromClassSpy.mockResolvedValue(mockDto);

      const createdSpy = jest
        .spyOn(CalendarCreateController, 'created')
        .mockImplementation();
      setupSucessfullTests();

      await CalendarCreateController.execute(mockClientReq, mockRes);

      validationAsserts();
      expect(fromJsonSpy).toHaveBeenCalledTimes(1);
      expect(fromJsonSpy).toHaveBeenCalledWith(
        { ...mockAppointment, client: mockRes.locals.token.id },
        DTOGroups.CREATE
      );
      expect(mockAppointmentService.save).toHaveBeenCalledTimes(1);
      expect(mockAppointmentService.save).toHaveBeenCalledWith(mockAppointment);
      expect(fromClassSpy).toHaveBeenCalledTimes(1);
      expect(fromClassSpy).toHaveBeenCalledWith(mockAppointment);
      expect(createdSpy).toHaveBeenCalledTimes(1);
      expect(createdSpy).toHaveBeenCalledWith(mockRes, mockDto);
    });

    it('should create a CalendarAppointment by an owner or a worker', async () => {
      setupSucessfullTests();
      const cboowSpy = jest
        .spyOn(create, 'createdByOwnerOrWorker')
        .mockImplementation();

      await CalendarCreateController.execute(mockReq, mockRes);

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
        controller: CalendarCreateController,
        res: mockRes,
        fromClass: CalendarAppointmentDTO.fromClass,
        token: mockRes.locals.token,
        by: mockReq.query.by,
        dto: mockDto,
        entityName: 'CalendarAppointment',
        workerCreatePermission: 'createCalendarAppointments'
      });
    });

    /**
     * Common tests shared by the creation of a calendar appointment
     */
    const baseTests = (mockReq: any) => () => {
      it('should send clientError on fromJson error', async () => {
        await fromJsonErrorAsserts(mockReq);
      });

      it('should send forbidden if startTime is after endTime', async () => {
        await validTimeAsserts(CalendarCreateController, mockReq);
      });

      it('should send forbidden if appointment is past', async () => {
        await pastEventAsserts(CalendarCreateController, mockReq, 'create');
      });

      it('should send fail on gymZoneService.findOne error', async () => {
        await findGymZoneErrorAsserts(
          CalendarCreateController,
          mockReq,
          'create'
        );
      });

      it('should send forbidden if appointment is outside gymZone schedule', async () => {
        await outsideGymScheduleAsserts(
          CalendarCreateController,
          mockReq,
          'create'
        );
      });

      it('should send forbidden if gymZone is full schedule', async () => {
        await gymZoneCapacityAsserts(CalendarCreateController, mockReq);
      });

      it('should send fail on manager.query error', async () => {
        await maxConcurrencyErrorAsserts(CalendarCreateController, mockReq);
      });

      it('should send forbidden if client does not exist', async () => {
        await personDoesNotExistAsserts(CalendarCreateController, mockReq);
      });

      it('should send forbidden if covidPassport check does not pass', async () => {
        await covidPassportCheckAsserts(CalendarCreateController, mockReq);
      });

      it('should send fail on clientService.findOne error', async () => {
        await clientServiceFindOneFailAsserts(
          CalendarCreateController,
          mockReq,
          'create'
        );
      });

      it('should send forbidden if client appointments overlap', async () => {
        await appointmentOverlapAsserts(CalendarCreateController, mockReq);
      });

      it('should send fail on service.count error', async () => {
        await serviceCountFailAsserts(
          CalendarCreateController,
          mockReq,
          'create'
        );
      });
    };

    describe('owner/worker', baseTests(mockReq));

    describe('client', () => {
      // Run common tests
      baseTests(mockClientReq)();

      // Run specific tests
      it('should send fail on service.save error', async () => {
        fromJsonSpy.mockResolvedValue(mockDto);

        mockGymZoneService.findOne.mockResolvedValue(mockGymZone);
        mockAppointmentService.manager.query.mockResolvedValue({ max: 0 });
        mockClientService.findOne.mockResolvedValue(mockClient);
        mockAppointmentService.count.mockResolvedValue(0);
        mockAppointmentService.save.mockRejectedValue('error-thrown');

        setupServices(CalendarCreateController);

        await CalendarCreateController.execute(mockClientReq, mockRes);

        expect(fromJsonSpy).toHaveBeenCalledTimes(1);
        expect(mockGymZoneService.findOne).toHaveBeenCalledTimes(1);
        expect(mockAppointmentService.manager.query).toHaveBeenCalledTimes(1);
        expect(mockClientService.findOne).toHaveBeenCalledTimes(1);
        expect(mockAppointmentService.count).toHaveBeenCalledTimes(1);
        expect(mockAppointmentService.save).toHaveBeenCalledTimes(1);
        expect(fromClassSpy).toHaveBeenCalledTimes(0);
        failAsserts(CalendarCreateController, failSpy, 'create');
      });

      it('should send fail on fromClass error', async () => {
        fromJsonSpy.mockResolvedValue(mockDto);
        fromClassSpy.mockRejectedValue('error-thrown');

        mockGymZoneService.findOne.mockResolvedValue(mockGymZone);
        mockAppointmentService.manager.query.mockResolvedValue({
          max: 0
        });
        mockClientService.findOne.mockResolvedValue(mockClient);
        mockAppointmentService.count.mockResolvedValue(0);
        mockAppointmentService.save.mockResolvedValue(mockAppointment);

        setupServices(CalendarCreateController);

        await CalendarCreateController.execute(mockClientReq, mockRes);

        expect(fromJsonSpy).toHaveBeenCalledTimes(1);
        expect(mockGymZoneService.findOne).toHaveBeenCalledTimes(1);
        expect(mockAppointmentService.manager.query).toHaveBeenCalledTimes(1);
        expect(mockClientService.findOne).toHaveBeenCalledTimes(1);
        expect(mockAppointmentService.count).toHaveBeenCalledTimes(1);
        expect(mockAppointmentService.save).toHaveBeenCalledTimes(1);
        expect(fromClassSpy).toHaveBeenCalledTimes(1);
        failAsserts(CalendarCreateController, failSpy, 'create');
      });

      it('should send fail on created error', async () => {
        fromJsonSpy.mockResolvedValue(mockDto);
        fromClassSpy.mockResolvedValue(mockDto);

        mockGymZoneService.findOne.mockResolvedValue(mockGymZone);
        mockAppointmentService.manager.query.mockResolvedValue({
          max: 0
        });
        mockClientService.findOne.mockResolvedValue(mockClient);
        mockAppointmentService.count.mockResolvedValue(0);
        mockAppointmentService.save.mockImplementation();

        const createdSpy = jest
          .spyOn(CalendarCreateController, 'created')
          .mockImplementation(() => {
            throw 'error-thrown';
          });

        setupServices(CalendarCreateController);

        await CalendarCreateController.execute(mockClientReq, mockRes);

        expect(fromJsonSpy).toHaveBeenCalledTimes(1);
        expect(mockGymZoneService.findOne).toHaveBeenCalledTimes(1);
        expect(mockAppointmentService.manager.query).toHaveBeenCalledTimes(1);
        expect(mockClientService.findOne).toHaveBeenCalledTimes(1);
        expect(mockAppointmentService.count).toHaveBeenCalledTimes(1);
        expect(mockAppointmentService.save).toHaveBeenCalledTimes(1);
        expect(fromClassSpy).toHaveBeenCalledTimes(1);
        expect(createdSpy).toHaveBeenCalledTimes(1);
        expect(createdSpy).toHaveBeenCalledWith(mockRes, mockDto);
        failAsserts(CalendarCreateController, failSpy, 'create');
      });
    });
  });
});
