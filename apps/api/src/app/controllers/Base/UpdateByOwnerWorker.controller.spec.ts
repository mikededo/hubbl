import { getRepository } from 'typeorm';

import { DTOGroups } from '@hubbl/shared/models/dto';

import { OwnerService, WorkerService } from '../../services';
import * as update from '../helpers/update';
import UpdateByOwnerWorkerController from './UpdateByOwnerWorker.controller';

jest.mock('../../services');

describe('UpdateByOwnerWorkerController controller', () => {
  let controller: UpdateByOwnerWorkerController;
  const mockServiceConstructor = jest.fn().mockImplementation() as any;

  const mockEntity = {
    id: 1,
    name: 'Test',
    boolean: true,
    capacity: 1000
  };
  const mockDto = {
    ...mockEntity,
    toClass: jest.fn()
  };
  const mockReq = {
    params: { id: 1, vgId: 1 },
    query: { by: 'owner' },
    body: {},
    headers: { authorization: 'Any token' }
  } as any;
  const mockRes = { locals: { token: { id: 1 } } } as any;

  const fromJsonSpy = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    controller = new UpdateByOwnerWorkerController(
      mockServiceConstructor,
      fromJsonSpy,
      'EntityName' as any,
      'workerPermission' as any
    );
  });

  it('should create the services if does not have any', async () => {
    jest.spyOn(controller, 'fail').mockImplementation();

    controller['service'] = undefined;
    controller['ownerService'] = undefined;
    controller['workerService'] = undefined;
    await controller.execute({} as any, {} as any);

    expect(mockServiceConstructor).toHaveBeenCalled();
    expect(mockServiceConstructor).toHaveBeenCalledWith(getRepository);
    expect(OwnerService).toHaveBeenCalled();
    expect(OwnerService).toHaveBeenCalledWith(getRepository);
    expect(WorkerService).toHaveBeenCalled();
    expect(WorkerService).toHaveBeenCalledWith(getRepository);
  });

  it('should call updatedByOwnerOrWorker', async () => {
    const uboowSpy = jest
      .spyOn(update, 'updatedByOwnerOrWorker')
      .mockImplementation();
    fromJsonSpy.mockResolvedValue(mockDto as any);

    controller['service'] = {} as any;
    controller['ownerService'] = {} as any;
    controller['workerService'] = {} as any;

    await controller.execute(mockReq, mockRes);

    expect(fromJsonSpy).toHaveBeenCalledTimes(1);
    expect(fromJsonSpy).toHaveBeenCalledWith(mockReq.body, DTOGroups.UPDATE);
    expect(uboowSpy).toHaveBeenCalledTimes(1);
    expect(uboowSpy).toHaveBeenCalledWith({
      service: {},
      ownerService: {},
      workerService: {},
      controller: controller,
      res: mockRes,
      token: { id: 1 },
      by: mockReq.query.by,
      dto: mockDto,
      entityName: 'EntityName',
      updatableBy: '["owner", "worker"]',
      countArgs: { id: 1 },
      workerUpdatePermission: 'workerPermission'
    });
  });

  it('should call clientError on fromJson error', async () => {
    const uboowSpy = jest
      .spyOn(update, 'updatedByOwnerOrWorker')
      .mockImplementation();
    fromJsonSpy.mockRejectedValue('fromJson-error');

    const clientErrorSpy = jest
      .spyOn(controller, 'clientError')
      .mockImplementation();

    controller['service'] = {} as any;
    controller['ownerService'] = {} as any;
    controller['workerService'] = {} as any;

    await controller.execute(mockReq, mockRes);

    expect(fromJsonSpy).toHaveBeenCalledTimes(1);
    expect(fromJsonSpy).toHaveBeenCalledWith(mockReq.body, DTOGroups.UPDATE);
    expect(uboowSpy).not.toHaveBeenCalled();
    expect(clientErrorSpy).toHaveBeenCalledTimes(1);
    expect(clientErrorSpy).toHaveBeenCalledWith(mockRes, 'fromJson-error');
  });
});
