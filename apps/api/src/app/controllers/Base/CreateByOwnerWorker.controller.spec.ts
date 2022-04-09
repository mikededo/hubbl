import { DTOGroups } from '@hubbl/shared/models/dto';

import { OwnerService, WorkerService } from '../../services';
import * as create from '../helpers/create';
import CreateByOwnerWorkerController from './CreateByOwnerWorker.controller';

jest.mock('../../services');

describe('CreateByOwnerWorkerController controller', () => {
  let controller: CreateByOwnerWorkerController;
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
    body: {},
    headers: { authorization: 'Any token' }
  } as any;
  const mockRes = { locals: { token: { id: 1 } } } as any;

  const fromJsonSpy = jest.fn();
  const fromClassSpy = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    controller = new CreateByOwnerWorkerController(
      mockServiceConstructor,
      fromJsonSpy,
      fromClassSpy,
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
    expect(OwnerService).toHaveBeenCalled();
    expect(WorkerService).toHaveBeenCalled();
  });

  it('should call createdByOwnerOrWorker', async () => {
    const cboowSpy = jest
      .spyOn(create, 'createdByOwnerOrWorker')
      .mockImplementation();
    fromJsonSpy.mockResolvedValue(mockDto as any);

    controller['service'] = {} as any;
    controller['ownerService'] = {} as any;
    controller['workerService'] = {} as any;

    await controller.execute(mockReq, mockRes);

    expect(fromJsonSpy).toHaveBeenCalledTimes(1);
    expect(fromJsonSpy).toHaveBeenCalledWith(mockReq.body, DTOGroups.CREATE);
    expect(cboowSpy).toHaveBeenCalledTimes(1);
    expect(cboowSpy).toHaveBeenCalledWith({
      service: {},
      ownerService: {},
      workerService: {},
      controller: controller,
      res: mockRes,
      fromClass: fromClassSpy,
      token: { id: 1 },
      dto: mockDto,
      entityName: 'EntityName',
      workerCreatePermission: 'workerPermission'
    });
  });

  it('should call clientError on fromJson error', async () => {
    const uboowSpy = jest
      .spyOn(create, 'createdByOwnerOrWorker')
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
    expect(fromJsonSpy).toHaveBeenCalledWith(mockReq.body, DTOGroups.CREATE);
    expect(uboowSpy).not.toHaveBeenCalled();
    expect(clientErrorSpy).toHaveBeenCalledTimes(1);
    expect(clientErrorSpy).toHaveBeenCalledWith(mockRes, 'fromJson-error');
  });
});
