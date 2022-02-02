import * as log from 'npmlog';
import { getRepository } from 'typeorm';

import { EventTemplateDTO } from '@hubbl/shared/models/dto';

import { EventTemplateService, PersonService } from '../../services';
import {
  CreateByOwnerWorkerController,
  DeleteByOwnerWorkerController,
  UpdateByOwnerWorkerController
} from '../Base';
import {
  EventTemplateCreateController,
  EventTemplateDeleteController,
  EventTemplateFetchController,
  EventTemplateUpdateController
} from './EventTemplate.controller';
import { EventType } from '@hubbl/shared/models/entities';

jest.mock('../../services');
jest.mock('@hubbl/shared/models/dto');

const createEventType = (id: number): EventType => {
  const type = new EventType();

  type.id = id;
  type.name = 'Event Type';

  return type;
};

describe('EventTemplate controller', () => {
  const mockPerson = {
    id: 1,
    gym: { id: 1 }
  };
  const mockEventTemplate = {
    id: 1,
    name: 'Test',
    description: '',
    type: createEventType(1),
    gym: 1
  };
  const mockDto = {
    ...mockEventTemplate,
    eventCount: 5,
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
  describe('EventTemplateFetchController', () => {
    const mockEventTemplateService = {
      createQueryBuilder: jest.fn().mockReturnThis(),
      loadRelationCountAndMap: jest.fn().mockReturnThis(),
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      getMany: jest.fn()
    };
    const mockPersonService = { findOne: jest.fn().mockImplementation() };

    it('should create the services if does not have any', async () => {
      jest.spyOn(EventTemplateFetchController, 'fail').mockImplementation();

      EventTemplateFetchController['service'] = undefined;
      EventTemplateFetchController['personService'] = undefined;
      await EventTemplateFetchController.execute({} as any, {} as any);

      expect(EventTemplateService).toHaveBeenCalledTimes(1);
      expect(EventTemplateService).toHaveBeenCalledWith(getRepository);
      expect(PersonService).toHaveBeenCalledTimes(1);
      expect(PersonService).toHaveBeenCalledWith(getRepository);
    });

    it('should fetch the event templates', async () => {
      const resultList = {
        map: jest.fn().mockImplementation((callback: any) => {
          expect(callback).toBeDefined();

          return [mockEventTemplate, mockEventTemplate].map(callback);
        })
      };
      const fromClassSpy = jest
        .spyOn(EventTemplateDTO, 'fromClass')
        .mockReturnValue(mockDto as any);
      const okSpy = jest
        .spyOn(EventTemplateFetchController, 'ok')
        .mockImplementation();
      const listSpy = jest.spyOn(resultList, 'map');

      mockPersonService.findOne.mockResolvedValue(mockPerson);
      mockEventTemplateService.getMany.mockResolvedValue(resultList);
      mockEventTemplateService.loadRelationCountAndMap.mockImplementation(
        (argOne, argTwo, argThree) => {
          // Check the arguments passed to the callback
          expect(argOne).toBe('evTpl.eventCount');
          expect(argTwo).toBe('evTpl.events');
          expect(argThree).toBe('event');

          return mockEventTemplateService;
        }
      );

      EventTemplateFetchController['service'] = mockEventTemplateService as any;
      EventTemplateFetchController['personService'] = mockPersonService as any;

      await EventTemplateFetchController.execute(mockReq, mockRes);
      expect(mockPersonService.findOne).toHaveBeenCalledTimes(1);
      expect(mockPersonService.findOne).toHaveBeenCalledWith({
        id: mockRes.locals.token.id
      });
      expect(mockEventTemplateService.createQueryBuilder).toHaveBeenCalledTimes(
        1
      );
      expect(mockEventTemplateService.createQueryBuilder).toHaveBeenCalledWith({
        alias: 'evTpl'
      });
      expect(
        mockEventTemplateService.loadRelationCountAndMap
      ).toHaveBeenCalledTimes(1);
      expect(mockEventTemplateService.leftJoinAndSelect).toHaveBeenCalledTimes(
        1
      );
      expect(mockEventTemplateService.leftJoinAndSelect).toHaveBeenCalledWith(
        'evTpl.type',
        'event_type'
      );
      expect(mockEventTemplateService.where).toHaveBeenCalledTimes(1);
      expect(mockEventTemplateService.where).toHaveBeenCalledWith(
        'evTpl.gym = :gym',
        { gym: mockPerson.gym.id }
      );
      expect(mockEventTemplateService.getMany).toHaveBeenCalledTimes(1);
      expect(mockEventTemplateService.getMany).toHaveReturned();
      expect(listSpy).toHaveBeenCalled();
      expect(fromClassSpy).toHaveBeenCalledTimes(2);
      expect(fromClassSpy).toHaveBeenCalledWith(mockEventTemplate);
      expect(okSpy).toHaveBeenCalledTimes(1);
      expect(okSpy).toHaveBeenCalledWith(mockRes, [mockDto, mockDto]);
    });

    it('should call fail on person service error', async () => {
      const failSpy = jest
        .spyOn(EventTemplateFetchController, 'fail')
        .mockImplementation();
      mockPersonService.findOne.mockRejectedValue({});

      EventTemplateFetchController['service'] = {} as any;
      EventTemplateFetchController['personService'] = mockPersonService as any;

      await EventTemplateFetchController.execute(mockReq, mockRes);

      expect(mockPersonService.findOne).toHaveBeenCalledTimes(1);
      // Ensure fail is called
      failSpyAsserts(failSpy);
    });

    it('should call clientError if person does not exist', async () => {
      const clientErrorSpy = jest
        .spyOn(EventTemplateFetchController, 'clientError')
        .mockImplementation();
      mockPersonService.findOne.mockResolvedValue(undefined);

      EventTemplateFetchController['service'] = {} as any;
      EventTemplateFetchController['personService'] = mockPersonService as any;

      await EventTemplateFetchController.execute(mockReq, mockRes);

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
        .spyOn(EventTemplateFetchController, 'fail')
        .mockImplementation();
      mockEventTemplateService.getMany.mockRejectedValue({});
      mockPersonService.findOne.mockResolvedValue(mockPerson);

      EventTemplateFetchController['service'] = mockEventTemplateService as any;
      EventTemplateFetchController['personService'] = mockPersonService as any;

      await EventTemplateFetchController.execute(mockReq, mockRes);

      expect(mockPersonService.findOne).toHaveBeenCalledTimes(1);
      expect(mockEventTemplateService.createQueryBuilder).toHaveBeenCalledTimes(
        1
      );
      expect(
        mockEventTemplateService.loadRelationCountAndMap
      ).toHaveBeenCalledTimes(1);
      expect(mockEventTemplateService.where).toHaveBeenCalledTimes(1);
      // Ensure fail is called
      failSpyAsserts(failSpy);
    });
  });

  describe('EventTemplateCreateController', () => {
    it('should create an CreateByOwnerWorkerController', () => {
      jest.spyOn(EventTemplateDTO, 'fromJson');

      expect(EventTemplateCreateController).toBeInstanceOf(
        CreateByOwnerWorkerController
      );
      expect(EventTemplateCreateController['serviceCtr']).toBe(
        EventTemplateService
      );
      expect(EventTemplateCreateController['fromJson']).toBe(
        EventTemplateDTO.fromJson
      );
      expect(EventTemplateCreateController['fromClass']).toBe(
        EventTemplateDTO.fromClass
      );
      expect(EventTemplateCreateController['entityName']).toBe('EventTemplate');
      expect(EventTemplateCreateController['workerCreatePermission']).toBe(
        'createEventTemplates'
      );
    });
  });

  describe('EventTemplateUpdateController', () => {
    it('should create an UpdateByOwnerWorkerController', () => {
      jest.spyOn(EventTemplateDTO, 'fromJson');

      expect(EventTemplateUpdateController).toBeInstanceOf(
        UpdateByOwnerWorkerController
      );
      expect(EventTemplateUpdateController['serviceCtr']).toBe(
        EventTemplateService
      );
      expect(EventTemplateUpdateController['fromJson']).toBe(
        EventTemplateDTO.fromJson
      );
      expect(EventTemplateUpdateController['entityName']).toBe('EventTemplate');
      expect(EventTemplateUpdateController['workerUpdatePermission']).toBe(
        'updateEventTemplates'
      );
    });
  });

  describe('EventTemplateDeleteController', () => {
    it('should create an DeleteByOwnerWorkerController', () => {
      jest.spyOn(EventTemplateDTO, 'fromJson');

      expect(EventTemplateDeleteController).toBeInstanceOf(
        DeleteByOwnerWorkerController
      );
      expect(EventTemplateDeleteController['serviceCtr']).toBe(
        EventTemplateService
      );
      expect(EventTemplateDeleteController['entityName']).toBe('EventTemplate');
      expect(EventTemplateDeleteController['workerDeletePermission']).toBe(
        'deleteEventTemplates'
      );
    });
  });
});
