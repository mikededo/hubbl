import * as log from 'npmlog';
import { getRepository } from 'typeorm';

import { EventTypeDTO } from '@hubbl/shared/models/dto';
import { AppPalette } from '@hubbl/shared/types';

import { EventTypeService, PersonService } from '../../services';
import {
  CreateByOwnerWorkerController,
  DeleteByOwnerWorkerController,
  UpdateByOwnerWorkerController
} from '../Base';
import {
  EventTypeCreateController,
  EventTypeDeleteController,
  EventTypeFetchController,
  EventTypeUpdateController
} from './EventType.controller';

jest.mock('../../services');
jest.mock('@hubbl/shared/models/dto');

describe('EventType controller', () => {
  const mockPerson = {
    id: 1,
    gym: { id: 1 }
  };
  const mockEventType = {
    id: 1,
    name: 'Test',
    description: '',
    labelColor: AppPalette.BLUE,
    gym: 1
  };
  const mockDto = {
    ...mockEventType,
    toClass: jest.fn()
  };
  const mockReq = {
    params: { id: 1 },
    body: {},
    headers: { authorization: 'Any token' }
  } as any;

  const logSpy = jest.spyOn(log, 'error').mockImplementation();
  const mockRes = { locals: { token: { id: 1 } } } as any;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const failSpyAsserts = (failSpy: any) => {
    expect(logSpy).toHaveBeenCalledTimes(1);
    expect(logSpy).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(String),
      expect.any(String)
    );
    expect(failSpy).toHaveBeenCalledTimes(1);
    expect(failSpy).toHaveBeenCalledWith(
      mockRes,
      'Internal server error. If the problem persists, contact our team.'
    );
  };

  describe('EventTypeFetchController', () => {
    const mockEventTypeService = { find: jest.fn().mockImplementation() };
    const mockPersonService = { findOne: jest.fn().mockImplementation() };

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should create the services if does not have any', async () => {
      jest.spyOn(EventTypeFetchController, 'fail').mockImplementation();

      EventTypeFetchController['service'] = undefined;
      EventTypeFetchController['personService'] = undefined;
      await EventTypeFetchController.execute({} as any, {} as any);

      expect(EventTypeService).toHaveBeenCalledTimes(1);
      expect(EventTypeService).toHaveBeenCalledWith(getRepository);
      expect(PersonService).toHaveBeenCalledTimes(1);
      expect(PersonService).toHaveBeenCalledWith(getRepository);
    });

    it('should fetch the event types', async () => {
      const resultList = {
        map: jest.fn().mockImplementation((callback: any) => {
          expect(callback).toBeDefined();

          return [mockEventType, mockEventType].map(callback);
        })
      };
      const fromClassSpy = jest
        .spyOn(EventTypeDTO, 'fromClass')
        .mockReturnValue(mockDto as any);
      const okSpy = jest
        .spyOn(EventTypeFetchController, 'ok')
        .mockImplementation();
      const listSpy = jest.spyOn(resultList, 'map');

      mockPersonService.findOne.mockResolvedValue(mockPerson);
      mockEventTypeService.find.mockResolvedValue(resultList);

      EventTypeFetchController['service'] = mockEventTypeService as any;
      EventTypeFetchController['personService'] = mockPersonService as any;

      await EventTypeFetchController.execute(mockReq, mockRes);

      expect(mockPersonService.findOne).toHaveBeenCalledTimes(1);
      expect(mockPersonService.findOne).toHaveBeenCalledWith({
        id: mockRes.locals.token.id
      });
      expect(mockEventTypeService.find).toHaveBeenCalledTimes(1);
      expect(mockEventTypeService.find).toHaveBeenCalledWith({
        where: { gym: mockPerson.gym.id }
      });
      expect(mockEventTypeService.find).toHaveReturned();
      expect(listSpy).toHaveBeenCalled();
      expect(fromClassSpy).toHaveBeenCalledTimes(2);
      expect(fromClassSpy).toHaveBeenCalledWith(mockEventType);
      expect(okSpy).toHaveBeenCalledTimes(1);
      expect(okSpy).toHaveBeenCalledWith(mockRes, [mockDto, mockDto]);
    });

    it('should call fail on person service error', async () => {
      const failSpy = jest
        .spyOn(EventTypeFetchController, 'fail')
        .mockImplementation();
      mockPersonService.findOne.mockRejectedValue({});

      EventTypeFetchController['service'] = {} as any;
      EventTypeFetchController['personService'] = mockPersonService as any;

      await EventTypeFetchController.execute(mockReq, mockRes);

      expect(mockPersonService.findOne).toHaveBeenCalledTimes(1);
      // Ensure fail is called
      failSpyAsserts(failSpy);
    });

    it('should call clientError if person does not exist', async () => {
      const clientErrorSpy = jest
        .spyOn(EventTypeFetchController, 'clientError')
        .mockImplementation();
      mockPersonService.findOne.mockResolvedValue(undefined);

      EventTypeFetchController['service'] = {} as any;
      EventTypeFetchController['personService'] = mockPersonService as any;

      await EventTypeFetchController.execute(mockReq, mockRes);

      expect(mockPersonService.findOne).toHaveBeenCalledTimes(1);
      // Ensure fail is called
      expect(clientErrorSpy).toHaveBeenCalledTimes(1);
      expect(clientErrorSpy).toHaveBeenCalledWith(
        mockRes,
        'Person does not exist'
      );
    });

    it('should call fail on service error', async () => {
      const failSpy = jest
        .spyOn(EventTypeFetchController, 'fail')
        .mockImplementation();
      mockEventTypeService.find.mockRejectedValue({});
      mockPersonService.findOne.mockResolvedValue(mockPerson);

      EventTypeFetchController['service'] = mockEventTypeService as any;
      EventTypeFetchController['personService'] = mockPersonService as any;

      await EventTypeFetchController.execute(mockReq, mockRes);

      expect(mockPersonService.findOne).toHaveBeenCalledTimes(1);
      expect(mockEventTypeService.find).toHaveBeenCalledTimes(1);
      expect(mockEventTypeService.find).toHaveBeenCalledWith({
        where: { gym: mockPerson.gym.id }
      });
      // Ensure fail is called
      failSpyAsserts(failSpy);
    });
  });

  describe('EventTypeCreateController', () => {
    it('should create an CreateByOwnerWorkerController', () => {
      jest.spyOn(EventTypeDTO, 'fromJson');

      expect(EventTypeCreateController).toBeInstanceOf(
        CreateByOwnerWorkerController
      );
      expect(EventTypeCreateController['serviceCtr']).toBe(EventTypeService);
      expect(EventTypeCreateController['fromJson']).toBe(EventTypeDTO.fromJson);
      expect(EventTypeCreateController['fromClass']).toBe(
        EventTypeDTO.fromClass
      );
      expect(EventTypeCreateController['entityName']).toBe('EventType');
      expect(EventTypeCreateController['workerCreatePermission']).toBe(
        'createEventTypes'
      );
    });
  });

  describe('EventTypeUpdateController', () => {
    it('should create an UpdateByOwnerWorkerController', () => {
      jest.spyOn(EventTypeDTO, 'fromJson');

      expect(EventTypeUpdateController).toBeInstanceOf(
        UpdateByOwnerWorkerController
      );
      expect(EventTypeUpdateController['serviceCtr']).toBe(EventTypeService);
      expect(EventTypeUpdateController['fromJson']).toBe(EventTypeDTO.fromJson);
      expect(EventTypeUpdateController['entityName']).toBe('EventType');
      expect(EventTypeUpdateController['workerUpdatePermission']).toBe(
        'updateEventTypes'
      );
    });
  });

  describe('EventTypeDeleteController', () => {
    it('should create an DeleteByOwnerWorkerController', () => {
      jest.spyOn(EventTypeDTO, 'fromJson');

      expect(EventTypeDeleteController).toBeInstanceOf(
        DeleteByOwnerWorkerController
      );
      expect(EventTypeDeleteController['serviceCtr']).toBe(EventTypeService);
      expect(EventTypeDeleteController['entityName']).toBe('EventType');
      expect(EventTypeDeleteController['workerDeletePermission']).toBe(
        'deleteEventTypes'
      );
    });
  });
});
