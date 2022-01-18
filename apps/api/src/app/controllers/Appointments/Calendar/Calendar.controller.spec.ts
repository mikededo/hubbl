import npmlog = require('npmlog');
import { getRepository } from 'typeorm';

import { FetchAppointmentInterval } from '@hubbl/shared/models/body-validators';
import { CalendarAppointmentDTO, DTOGroups } from '@hubbl/shared/models/dto';
import { CalendarDate, GymZone } from '@hubbl/shared/models/entities';
import { GymZoneIntervals } from '@hubbl/shared/types';

import { queries } from '../../../constants';
import {
  CalendarAppointmentService,
  ClientService,
  GymZoneService,
  OwnerService,
  PersonService,
  WorkerService
} from '../../../services';
import * as create from '../../helpers/create';
import * as deleteHelpers from '../../helpers/delete';
import * as update from '../../helpers/update';
import * as validations from '../../helpers/validations';
import {
  CalendarCancelController,
  CalendarCreateController,
  CalendarDeleteController,
  CalendarFetchController
} from './Calendar.controller';

type TypesOfControllers =
  | typeof CalendarCreateController
  | typeof CalendarFetchController
  | typeof CalendarCancelController
  | typeof CalendarDeleteController;

type Operations = 'create' | 'cancel' | 'fetch';

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
    findOne: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    manager: { query: jest.fn() }
  };
  const mockGymZoneService = {
    findOne: jest.fn()
  };
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
    mockAppointmentService.manager.query.mockResolvedValue([{ max: 0 }]);
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
      `Can not ${operation} a past appointment`
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
    mockAppointmentService.manager.query.mockResolvedValue([
      { max: mockGymZone.capacity }
    ]);

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
    mockAppointmentService.manager.query.mockResolvedValue([{ max: 0 }]);
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
    mockAppointmentService.manager.query.mockResolvedValue([{ max: 0 }]);
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
    mockAppointmentService.manager.query.mockResolvedValue([{ max: 0 }]);
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
    mockAppointmentService.manager.query.mockResolvedValue([{ max: 0 }]);
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
    mockAppointmentService.manager.query.mockResolvedValue([{ max: 0 }]);
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

  describe('CalendarFetchController', () => {
    const mockReq = {
      body: {
        date: { year: 9999, month: 6, day: 29 },
        interval: GymZoneIntervals.HOURTHIRTY
      },
      params: { id: 4 }
    } as any;
    const mockPerson = { id: 3, gym: 1 } as any;

    const mockPersonService = { findOne: jest.fn() };

    const bodyValidation = jest.spyOn(FetchAppointmentInterval, 'validate');
    const calendarAccessSpy = jest.spyOn(validations, 'userAccessToCalendar');
    const failSpy = jest
      .spyOn(CalendarFetchController, 'fail')
      .mockReturnValue({} as any);

    beforeEach(() => {
      jest.clearAllMocks();
    });

    const setupServices = () => {
      CalendarFetchController['service'] = mockAppointmentService as any;
      CalendarFetchController['personService'] = {} as any;
      CalendarFetchController['gymZoneService'] = mockGymZoneService as any;
    };

    it('should create the services if does not have any', async () => {
      jest.spyOn(CalendarFetchController, 'fail').mockImplementation();

      CalendarFetchController['service'] = undefined;
      CalendarFetchController['personService'] = undefined;

      await CalendarFetchController.execute({} as any, {} as any);

      expect(CalendarAppointmentService).toHaveBeenCalledTimes(1);
      expect(CalendarAppointmentService).toHaveBeenCalledWith(getRepository);
      expect(PersonService).toHaveBeenCalledTimes(1);
      expect(PersonService).toHaveBeenCalledWith(getRepository);
    });

    it('should send ok with the parsed results of the query', async () => {
      const queryResult = [
        { available: '09:00:00' },
        { available: '10:00:00' },
        { available: '11:00:00' },
        { available: '12:00:00' },
        { available: '13:00:00' }
      ];
      calendarAccessSpy.mockResolvedValue(undefined);
      mockAppointmentService.manager.query.mockResolvedValue(queryResult);

      bodyValidation.mockResolvedValue(mockReq.body);
      const okSpy = jest
        .spyOn(CalendarFetchController, 'ok')
        .mockImplementation();
      setupServices();

      await CalendarFetchController.execute(mockReq, mockRes);

      // Check if person can access the calendar
      expect(calendarAccessSpy).toHaveBeenCalledTimes(1);
      expect(calendarAccessSpy).toHaveBeenCalledWith({
        controller: CalendarFetchController,
        personService: {},
        gymZoneService: mockGymZoneService,
        res: mockRes,
        personId: mockRes.locals.token.id,
        calendarId: mockReq.params.id
      });
      // Validate the body
      expect(bodyValidation).toHaveBeenCalledTimes(1);
      expect(bodyValidation).toHaveBeenCalledWith(mockReq.body);
      // Validate the query made to search for the intervals
      expect(mockAppointmentService.manager.query).toHaveBeenCalledTimes(1);
      expect(mockAppointmentService.manager.query).toHaveBeenCalledWith(
        queries.AVAILABLE_TIMES_APPOINTMENTS,
        [
          mockReq.body.date.year,
          mockReq.body.date.month,
          mockReq.body.date.day,
          mockReq.params.id,
          `${mockReq.body.interval} minutes`
        ]
      );
      // Validate response sent
      expect(okSpy).toHaveBeenCalledTimes(1);
      expect(okSpy).toHaveBeenCalledWith(
        mockRes,
        queryResult.map(({ available }) => available)
      );
    });

    it('should return if accessValidation does not pass', async () => {
      mockPersonService.findOne.mockRejectedValue(mockPerson);
      calendarAccessSpy.mockResolvedValue('error' as any);

      setupServices();

      await CalendarFetchController.execute(mockReq, mockRes);

      expect(calendarAccessSpy).toHaveBeenCalledTimes(1);
      expect(bodyValidation).not.toHaveBeenCalled();
    });

    it('should send clientError if body is not valid', async () => {
      calendarAccessSpy.mockResolvedValue(undefined);
      bodyValidation.mockRejectedValue({});
      const clientErrorSpy = jest
        .spyOn(CalendarFetchController, 'clientError')
        .mockImplementation();

      setupServices();

      await CalendarFetchController.execute(mockReq, mockRes);

      expect(calendarAccessSpy).toHaveBeenCalledTimes(1);
      expect(bodyValidation).toHaveBeenCalledTimes(1);
      expect(clientErrorSpy).toHaveBeenCalledTimes(1);
      expect(clientErrorSpy).toHaveBeenCalledWith(mockRes, {});
    });

    it('should send clientError if accessing a past date', async () => {
      const pastDateReq = {
        ...mockReq,
        body: { date: { ...mockReq.body.date, year: 2000 } }
      };

      calendarAccessSpy.mockResolvedValue(undefined);
      bodyValidation.mockResolvedValue(pastDateReq.body);

      const clientErrorSpy = jest
        .spyOn(CalendarFetchController, 'clientError')
        .mockImplementation();

      setupServices();

      await CalendarFetchController.execute(pastDateReq, mockRes);

      expect(calendarAccessSpy).toHaveBeenCalledTimes(1);
      expect(bodyValidation).toHaveBeenCalledTimes(1);
      expect(clientErrorSpy).toHaveBeenCalledTimes(1);
      expect(clientErrorSpy).toHaveBeenCalledWith(
        mockRes,
        'Can not search for past dates.'
      );
    });

    it('should send fail on query error', async () => {
      calendarAccessSpy.mockResolvedValue(undefined);
      bodyValidation.mockResolvedValue(mockReq.body);
      mockAppointmentService.manager.query.mockRejectedValue('error-thrown');

      setupServices();

      await CalendarFetchController.execute(mockReq, mockRes);

      expect(calendarAccessSpy).toHaveBeenCalledTimes(1);
      expect(bodyValidation).toHaveBeenCalledTimes(1);
      expect(mockAppointmentService.manager.query).toHaveBeenCalledTimes(1);
      failAsserts(CalendarFetchController, failSpy, 'fetch');
    });
  });

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
      fromClassSpy.mockReturnValue(mockDto);

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
        mockAppointmentService.manager.query.mockResolvedValue([{ max: 0 }]);
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

      it('should send fail on created error', async () => {
        fromJsonSpy.mockResolvedValue(mockDto);
        fromClassSpy.mockReturnValue(mockDto);

        mockGymZoneService.findOne.mockResolvedValue(mockGymZone);
        mockAppointmentService.manager.query.mockResolvedValue([
          {
            max: 0
          }
        ]);
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

  describe('CalendarCancelController', () => {
    const forbiddenSpy = jest
      .spyOn(CalendarCancelController, 'forbidden')
      .mockImplementation();

    beforeEach(() => {
      jest.clearAllMocks();
    });

    const appointmentDoesNotExistAsserts = async (mockReq: any) => {
      mockAppointmentService.findOne.mockResolvedValue(undefined);

      setupServices(CalendarCancelController);

      await CalendarCancelController.execute(mockReq, mockRes);

      expect(mockAppointmentService.findOne).toHaveBeenCalledTimes(1);
      expect(forbiddenSpy).toHaveBeenCalledTimes(1);
      expect(forbiddenSpy).toHaveBeenCalledWith(
        mockRes,
        'The appointment does not exist.'
      );
    };

    const appointmentCancelledAsserts = async (mockReq: any) => {
      mockAppointmentService.findOne.mockResolvedValue({
        ...mockAppointment,
        cancelled: true
      });

      setupServices(CalendarCancelController);

      await CalendarCancelController.execute(mockReq, mockRes);

      expect(mockAppointmentService.findOne).toHaveBeenCalledTimes(1);
      expect(forbiddenSpy).toHaveBeenCalledTimes(1);
      expect(forbiddenSpy).toHaveBeenCalledWith(
        mockRes,
        'The appointment is already cancelled.'
      );
    };

    const serviceFindOneFailAsserts = async (mockReq: any) => {
      const failSpy = jest
        .spyOn(CalendarCancelController, 'fail')
        .mockImplementation();
      mockAppointmentService.findOne.mockRejectedValue('error-thrown');

      setupServices(CalendarCancelController);

      await CalendarCancelController.execute(mockReq, mockRes);

      expect(mockAppointmentService.findOne).toHaveBeenCalledTimes(1);
      failAsserts(CalendarCancelController, failSpy, 'cancel');
    };

    it('should call updatedByOwnerOrWorker by any owner or worker', async () => {
      const fromClassSpy = jest
        .spyOn(CalendarAppointmentDTO, 'fromClass')
        .mockReturnValue({ ...mockDto, cancelled: true } as any);
      const uboow = jest
        .spyOn(update, 'updatedByOwnerOrWorker')
        .mockImplementation();
      mockAppointmentService.findOne.mockResolvedValue(mockAppointment);

      setupServices(CalendarCancelController);

      await CalendarCancelController.execute(mockReq, mockRes);

      expect(mockAppointmentService.findOne).toHaveBeenCalledTimes(1);
      expect(mockAppointmentService.findOne).toHaveBeenCalledWith({
        id: mockReq.params.id,
        options: { loadRelationIds: true }
      });
      expect(fromClassSpy).toHaveBeenCalledTimes(1);
      expect(fromClassSpy).toHaveBeenCalledWith({
        ...mockAppointment,
        cancelled: true
      });
      expect(uboow).toHaveBeenCalledTimes(1);
      expect(uboow).toHaveBeenCalledWith({
        service: mockAppointmentService,
        ownerService: {},
        workerService: {},
        controller: CalendarCancelController,
        res: mockRes,
        token: mockRes.locals.token,
        by: mockReq.query.by,
        dto: { ...mockDto, cancelled: true },
        entityName: 'CalendarAppointment',
        updatableBy: '["client", "owner", "worker"]',
        countArgs: { id: mockReq.params.id },
        workerUpdatePermission: 'updateCalendarAppointments'
      });
    });

    it('should cancel an appointment by a client', async () => {
      mockClientService.findOne.mockResolvedValue(mockClient);
      mockAppointmentService.findOne.mockResolvedValue(mockAppointment);

      const okSpy = jest
        .spyOn(CalendarCancelController, 'ok')
        .mockImplementation();
      setupServices(CalendarCancelController);

      await CalendarCancelController.execute(mockClientReq, mockRes);

      expect(mockClientService.findOne).toHaveBeenCalledTimes(1);
      expect(mockClientService.findOne).toHaveBeenCalledWith({
        id: mockRes.locals.token.id
      });
      expect(mockAppointmentService.findOne).toHaveBeenCalledTimes(1);
      expect(mockAppointmentService.findOne).toHaveBeenCalledWith({
        id: mockReq.params.id,
        options: {
          where: { client: mockRes.locals.token.id },
          loadRelationIds: true
        }
      });
      expect(mockAppointmentService.update).toHaveBeenCalledTimes(1);
      expect(mockAppointmentService.update).toHaveBeenCalledWith(
        mockReq.params.id,
        { ...mockAppointment, cancelled: true }
      );
      expect(okSpy).toHaveBeenCalledTimes(1);
      expect(okSpy).toHaveBeenCalledWith(mockRes);
    });

    describe('owner/worker', () => {
      it('should send forbidden if the appointment does not exist', async () => {
        await appointmentDoesNotExistAsserts(mockReq);
      });

      it('should send forbidden if the appointment is already cacnelled', async () => {
        await appointmentCancelledAsserts(mockReq);
      });

      it('should send fail on service.findOne error', async () => {
        await serviceFindOneFailAsserts(mockReq);
      });
    });

    describe('client', () => {
      it('sould send forbidden if client does not exist', async () => {
        mockClientService.findOne.mockResolvedValue(undefined);
        setupServices(CalendarCancelController);

        await CalendarCancelController.execute(mockClientReq, mockRes);

        expect(mockClientService.findOne).toHaveBeenCalledTimes(1);
        expect(forbiddenSpy).toHaveBeenCalledTimes(1);
        expect(forbiddenSpy).toHaveBeenCalledWith(
          mockRes,
          'Person does not exist.'
        );
      });

      it('sould send fail on clientService.findOne error', async () => {
        mockClientService.findOne.mockRejectedValue('error-thrown');
        const failSpy = jest
          .spyOn(CalendarCancelController, 'fail')
          .mockImplementation();

        setupServices(CalendarCancelController);

        await CalendarCancelController.execute(mockClientReq, mockRes);

        expect(mockClientService.findOne).toHaveBeenCalledTimes(1);
        failAsserts(CalendarCancelController, failSpy, 'cancel');
      });

      it('should send forbidden if the appointment does not exist', async () => {
        mockClientService.findOne.mockResolvedValue(mockClient);

        await appointmentDoesNotExistAsserts(mockClientReq);
      });

      it('should send forbidden if the appointment is already cacnelled', async () => {
        mockClientService.findOne.mockResolvedValue(mockClient);

        await appointmentCancelledAsserts(mockClientReq);
      });

      it('should send fail on service.findOne error', async () => {
        mockClientService.findOne.mockResolvedValue(mockClient);

        await serviceFindOneFailAsserts(mockClientReq);
      });

      it('should send fail on service.update error', async () => {
        mockClientService.findOne.mockResolvedValue(mockClient);
        mockAppointmentService.findOne.mockResolvedValue(mockAppointment);
        mockAppointmentService.update.mockRejectedValue('error-thrown');

        const failSpy = jest
          .spyOn(CalendarCancelController, 'fail')
          .mockImplementation();
        setupServices(CalendarCancelController);

        await CalendarCancelController.execute(mockClientReq, mockRes);

        expect(mockClientService.findOne).toHaveBeenCalledTimes(1);
        expect(mockAppointmentService.findOne).toHaveBeenCalledTimes(1);
        expect(mockAppointmentService.update).toHaveBeenCalledTimes(1);
        failAsserts(CalendarCancelController, failSpy, 'cancel');
      });
    });
  });

  describe('CalendarDeleteController', () => {
    it('should create the services if does not have any', async () => {
      jest.spyOn(CalendarDeleteController, 'fail').mockImplementation();

      CalendarDeleteController['service'] = undefined;
      CalendarDeleteController['gymZoneService'] = undefined;
      CalendarDeleteController['ownerService'] = undefined;
      CalendarDeleteController['workerService'] = undefined;
      CalendarDeleteController['clientService'] = undefined;

      await CalendarDeleteController.execute({} as any, {} as any);

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

    describe('owner/worker', () => {
      it('should call deletedByOwnerOrWorker with params id', async () => {
        const dboow = jest
          .spyOn(deleteHelpers, 'deletedByOwnerOrWorker')
          .mockImplementation();

        setupServices(CalendarDeleteController);

        await CalendarDeleteController.execute(mockReq, mockRes);

        expect(dboow).toHaveBeenCalledTimes(1);
        expect(dboow).toHaveBeenCalledWith({
          service: mockAppointmentService,
          ownerService: {},
          workerService: {},
          controller: CalendarDeleteController,
          res: mockRes,
          token: mockRes.locals.token,
          by: mockReq.query.by,
          entityId: mockReq.params.id,
          entityName: 'CalendarAppointment',
          countArgs: { id: mockReq.params.id },
          workerDeletePermission: 'deleteCalendarAppointments'
        });
      });
    });

    describe('owner/worker', () => {
      it('should call deletedByClient with params id', async () => {
        const dbc = jest
          .spyOn(deleteHelpers, 'deletedByClient')
          .mockImplementation();

        setupServices(CalendarDeleteController);

        await CalendarDeleteController.execute(mockClientReq, mockRes);

        expect(dbc).toHaveBeenCalledTimes(1);
        expect(dbc).toHaveBeenCalledWith({
          service: mockAppointmentService,
          clientService: mockClientService,
          controller: CalendarDeleteController,
          res: mockRes,
          entityId: mockReq.params.id,
          clientId: mockRes.locals.token.id,
          entityName: 'CalendarAppointment',
          countArgs: { id: mockReq.params.id, client: mockRes.locals.token.id }
        });
      });
    });
  });
});
