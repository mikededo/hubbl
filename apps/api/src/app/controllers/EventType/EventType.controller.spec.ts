import { getRepository } from 'typeorm';

import { DTOGroups, EventTypeDTO } from '@hubbl/shared/models/dto';
import { AppPalette } from '@hubbl/shared/types';

import { EventTypeService, OwnerService, WorkerService } from '../../services';
import { UpdateByOwnerWorkerController } from '../Base';
import * as create from '../helpers/create';
import {
  EventTypeCreateController,
  EventTypeUpdateController
} from './EventType.controller';

jest.mock('../../services');
jest.mock('@hubbl/shared/models/dto');

describe('EventType controller', () => {
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
    params: { id: 1, vgId: 1 },
    query: { by: 'owner' },
    body: {},
    headers: { authorization: 'Any token' }
  } as any;

  const mockRes = { locals: { token: { id: 1 } } } as any;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('EventTypeCreateController', () => {
    it('should create the services if does not have any', async () => {
      jest.spyOn(EventTypeCreateController, 'fail').mockImplementation();

      EventTypeCreateController['service'] = undefined;
      EventTypeCreateController['ownerService'] = undefined;
      EventTypeCreateController['workerService'] = undefined;
      await EventTypeCreateController.execute({} as any, {} as any);

      expect(EventTypeService).toHaveBeenCalled();
      expect(EventTypeService).toHaveBeenCalledWith(getRepository);
      expect(OwnerService).toHaveBeenCalled();
      expect(OwnerService).toHaveBeenCalledWith(getRepository);
      expect(WorkerService).toHaveBeenCalled();
      expect(WorkerService).toHaveBeenCalledWith(getRepository);
    });

    it('should call createdByOwnerOrWorker', async () => {
      const cboowSpy = jest
        .spyOn(create, 'createdByOwnerOrWorker')
        .mockImplementation();
      const fromJsonSpy = jest
        .spyOn(EventTypeDTO, 'fromJson')
        .mockResolvedValue(mockDto as any);

      EventTypeCreateController['service'] = {} as any;
      EventTypeCreateController['ownerService'] = {} as any;
      EventTypeCreateController['workerService'] = {} as any;

      await EventTypeCreateController.execute(mockReq, mockRes);

      expect(fromJsonSpy).toHaveBeenCalledTimes(1);
      expect(fromJsonSpy).toHaveBeenCalledWith(mockReq.body, DTOGroups.CREATE);
      expect(cboowSpy).toHaveBeenCalledTimes(1);
      expect(cboowSpy).toHaveBeenCalledWith({
        service: {},
        ownerService: {},
        workerService: {},
        controller: EventTypeCreateController,
        res: mockRes,
        fromClass: EventTypeDTO.fromClass,
        token: { id: 1 },
        by: mockReq.query.by,
        dto: mockDto,
        entityName: 'EventType',
        workerCreatePermission: 'createEventTypes'
      });
    });

    it('should call clientError on fromJson error', async () => {
      const cboowSpy = jest
        .spyOn(create, 'createdByOwnerOrWorker')
        .mockImplementation();
      const fromJsonSpy = jest
        .spyOn(EventTypeDTO, 'fromJson')
        .mockRejectedValue('fromJson-error');

      const clientErrorSpy = jest
        .spyOn(EventTypeCreateController, 'clientError')
        .mockImplementation();

      EventTypeCreateController['service'] = {} as any;
      EventTypeCreateController['ownerService'] = {} as any;
      EventTypeCreateController['workerService'] = {} as any;

      await EventTypeCreateController.execute(mockReq, mockRes);

      expect(fromJsonSpy).toHaveBeenCalledTimes(1);
      expect(fromJsonSpy).toHaveBeenCalledWith(mockReq.body, DTOGroups.CREATE);
      expect(cboowSpy).not.toHaveBeenCalled();
      expect(clientErrorSpy).toHaveBeenCalledTimes(1);
      expect(clientErrorSpy).toHaveBeenCalledWith(mockRes, 'fromJson-error');
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
});
