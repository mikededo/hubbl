import { getRepository } from 'typeorm';

import { OwnerService, WorkerService } from '../../services';
import * as deleteHelpers from '../helpers/delete';
import DeleteByOwnerWorkerController from './DeleteByOwnerWorker.controller';

jest.mock('../../services');

describe('DeleteByOwnerWorkerController controller', () => {
  let controller: DeleteByOwnerWorkerController;
  const mockServiceConstructor = jest.fn().mockImplementation() as any;

  const mockReq = {
    params: { id: 1, vgId: 1 },
    body: {},
    headers: { authorization: 'Any token' }
  } as any;
  const mockRes = { locals: { token: { id: 1 } } } as any;

  beforeEach(() => {
    jest.clearAllMocks();

    controller = new DeleteByOwnerWorkerController(
      mockServiceConstructor,
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

  it('should call deletedByOwnerOrWorker', async () => {
    const dboowSpy = jest
      .spyOn(deleteHelpers, 'deletedByOwnerOrWorker')
      .mockImplementation();

    controller['service'] = {} as any;
    controller['ownerService'] = {} as any;
    controller['workerService'] = {} as any;

    await controller.execute(mockReq, mockRes);

    expect(dboowSpy).toHaveBeenCalledTimes(1);
    expect(dboowSpy).toHaveBeenCalledWith({
      service: {},
      ownerService: {},
      workerService: {},
      controller: controller,
      res: mockRes,
      token: { id: 1 },
      entityId: mockReq.params.id,
      entityName: 'EntityName',
      countArgs: { id: 1 },
      workerDeletePermission: 'workerPermission'
    });
  });
});
