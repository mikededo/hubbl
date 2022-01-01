import * as jwt from 'jsonwebtoken';

import {
  ClientDTO,
  DTOGroups,
  OwnerDTO,
  TrainerDTO,
  WorkerDTO
} from '@hubbl/shared/models/dto';
import { Owner, Worker } from '@hubbl/shared/models/entities';

import { BaseService } from '../../services';
import BaseController from '../Base';
import * as update from './update';

type WorkerShouldUpdateByProps = {
  ownerService: any;
  workerService?: any;
  by: 'owner' | 'worker';
};

type CommonShouldUpdateByProps = {
  service: BaseService<any>;
  ownerService?: BaseService<Owner>;
  workerService?: BaseService<Worker>;
  by: 'owner' | 'worker';
};

describe('update', () => {
  const mockReq = {
    body: {},
    query: {},
    headers: { authorization: '' }
  } as any;
  const mockPerson = {
    person: { id: 1, email: 'test@user.com', password: '123456' }
  } as any;
  const mockDTO = {
    ...mockPerson.person,
    toClass: jest.fn().mockResolvedValue(mockPerson)
  };

  const mockController = {
    clientError: jest.fn(),
    created: jest.fn(),
    execute: jest.fn(),
    fail: jest.fn(),
    forbidden: jest.fn(),
    notFound: jest.fn(),
    ok: jest.fn(),
    run: jest.fn(),
    unauthorized: jest.fn()
  } as any;

  let jsonResSpy: any;

  const token = jwt.sign(
    { id: 1, email: 'test@user.com', exp: Date.now() + 1000 },
    process.env.NX_JWT_TOKEN || 'test-secret-token'
  );

  /* Helpers */

  const fromJsonError = async (
    fromJsonSpy: any,
    jsonResSpy: any,
    updater: () => Promise<void>
  ) => {
    fromJsonSpy.mockImplementation(() => {
      throw 'error-thrown';
    });
    jsonResSpy.mockImplementation();

    await updater();

    expect(fromJsonSpy).toHaveBeenCalledTimes(1);
    expect(jsonResSpy).toHaveBeenCalledTimes(1);
    expect(jsonResSpy).toHaveBeenCalledWith({} as any, 400, 'error-thrown');
  };

  const updatedByDifferentId = async (
    fromJsonSpy: any,
    controller: BaseController,
    updater: () => Promise<void>
  ) => {
    fromJsonSpy.mockResolvedValue(mockDTO);
    mockReq.headers = { authorization: `Bearer ${token}` };

    const decodeSpy = jest.spyOn(jwt, 'decode').mockReturnValue({ id: 0 });

    await updater();

    expect(fromJsonSpy).toHaveBeenCalledTimes(1);
    expect(decodeSpy).toHaveBeenCalledTimes(1);
    expect(decodeSpy).toHaveBeenCalledWith(token);
    expect(controller.unauthorized).toHaveReturnedTimes(1);
    expect(controller.unauthorized).toHaveBeenCalledWith({});
  };

  const updatingOwnerDoesNotExist = async (
    fromJsonSpy: any,
    controller: BaseController,
    service: BaseService<any>,
    entity: 'worker' | 'client',
    updater: () => Promise<void>
  ) => {
    fromJsonSpy.mockResolvedValue(mockDTO);
    mockReq.headers = { authorization: `Bearer ${token}` };

    jest.spyOn(jwt, 'decode').mockReturnValue({ id: 1 });

    await updater();

    expect(fromJsonSpy).toHaveBeenCalledTimes(1);
    expect(service.count).toHaveBeenCalledTimes(1);
    expect(service.count).toHaveBeenCalledWith({
      person: { id: 1 }
    });
    expect(controller.unauthorized).toHaveReturnedTimes(1);
    expect(controller.unauthorized).toHaveBeenCalledWith(
      {},
      `Owner does not exist. Can not update the ${entity}.`
    );
  };

  const invalidByParam = async (
    fromJsonSpy: any,
    controller: BaseController,
    params: '["client", "owner", "worker"]' | '["owner", "worker"]',
    updater: () => Promise<void>
  ) => {
    fromJsonSpy.mockResolvedValue(mockDTO);
    mockReq.headers = { authorization: `Bearer ${token}` };

    jest.spyOn(jwt, 'decode').mockReturnValue({ id: 1 });

    await updater();

    expect(fromJsonSpy).toHaveBeenCalledTimes(1);
    expect(controller.unauthorized).toHaveReturnedTimes(1);
    expect(controller.unauthorized).toHaveBeenCalledWith(
      {},
      `Ensure to pass the [by] parameter. Valid values are ${params}.`
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();

    jsonResSpy = jest.spyOn(BaseController, 'jsonResponse');
  });

  describe('Common updaters', () => {
    describe('findAndUpdateEntity', () => {
      it('should update the entity', async () => {
        const mockService = {
          count: jest.fn().mockResolvedValue(1),
          save: jest.fn().mockImplementation()
        } as any;

        await update.findAndUpdateEntity({
          controller: mockController,
          service: mockService,
          dto: mockDTO,
          res: {} as any,
          entityName: '' as any,
          countArgs: {} as any
        });

        expect(mockController.ok).toHaveBeenCalledTimes(1);
        expect(mockService.count).toHaveBeenCalledTimes(1);
        expect(mockService.count).toHaveBeenCalledWith({});
        expect(mockService.save).toHaveBeenCalledTimes(1);
        expect(mockService.save).toHaveBeenCalledWith(mockPerson);
      });

      it('should send not found if entity does not exist', async () => {
        const mockService = {
          count: jest.fn().mockResolvedValue(0),
          save: jest.fn().mockImplementation()
        } as any;

        await update.findAndUpdateEntity({
          controller: mockController,
          service: mockService,
          dto: mockDTO,
          res: {} as any,
          entityName: 'Any' as any,
          countArgs: {} as any
        });

        expect(mockService.count).toHaveBeenCalledTimes(1);
        expect(mockService.count).toHaveBeenCalledWith({});
        expect(mockController.notFound).toHaveBeenCalledTimes(1);
        expect(mockController.notFound).toHaveBeenCalledWith(
          {},
          'Any to update not found.'
        );
      });

      it('should send a fail on update error', async () => {
        const mockService = {
          count: jest.fn().mockResolvedValue(1),
          save: jest.fn().mockRejectedValue({})
        } as any;

        await update.findAndUpdateEntity({
          controller: mockController,
          service: mockService,
          res: {} as any,
          dto: mockDTO,
          entityName: 'Any' as any,
          countArgs: { entityId: mockDTO.id }
        });

        expect(mockService.count).toHaveBeenCalledTimes(1);
        expect(mockService.save).toHaveBeenCalledTimes(1);
        expect(mockService.save).toHaveBeenCalledWith(mockPerson);
        expect(mockController.fail).toHaveReturnedTimes(1);
        expect(mockController.fail).toHaveBeenCalledWith(
          {},
          'Internal server error. If the error persists, contact our team.'
        );
      });
    });

    describe('updateByOwnerOrWorker', () => {
      describe('Successfull updates', () => {
        const shouldUpdateBy = async ({
          service,
          ownerService = {} as any,
          workerService = {} as any,
          by
        }: CommonShouldUpdateByProps) => {
          const mockRes = {
            json: jest.fn().mockReturnThis(),
            status: jest.fn().mockReturnThis()
          } as any;
          const findAndUpdateSpy = jest
            .spyOn(update, 'findAndUpdateEntity')
            .mockResolvedValue({} as any);

          await update.updatedByOwnerOrWorker({
            controller: mockController,
            service: service,
            ownerService,
            workerService,
            res: mockRes,
            by,
            dto: mockDTO,
            token: { id: 1, email: 'test@user.com', exp: Date.now() },
            entityName: 'Client',
            countArgs: {},
            updatableBy: '["owner", "worker"]',
            workerUpdatePermission: 'any' as any
          });

          // Common checks
          expect(findAndUpdateSpy).toHaveBeenCalledTimes(1);
        };

        it('should update by owner', async () => {
          const mockService = {
            count: jest.fn().mockResolvedValue(1),
            save: jest.fn()
          } as any;
          const mockOwnerService = {
            count: jest.fn().mockResolvedValue(1)
          } as any;

          await shouldUpdateBy({
            service: mockService,
            ownerService: mockOwnerService,
            by: 'owner'
          });

          expect(mockOwnerService.count).toHaveBeenCalledTimes(1);
        });

        it('should update by worker', async () => {
          const mockService = {
            count: jest.fn().mockResolvedValue(1),
            save: jest.fn()
          } as any;
          const mockWorkerService = {
            findOne: jest.fn().mockResolvedValue({ any: true })
          } as any;

          await shouldUpdateBy({
            service: mockService,
            workerService: mockWorkerService,
            by: 'worker'
          });

          expect(mockWorkerService.findOne).toHaveBeenCalledTimes(1);
        });
      });

      it('should send fail if no workerUpdatePermission passed', async () => {
        const mockWorkerService = { findOne: jest.fn() };

        await update.updatedByOwnerOrWorker({
          controller: mockController,
          service: {} as any,
          workerService: mockWorkerService as any,
          ownerService: {} as any,
          res: {} as any,
          token: {} as any,
          by: 'worker',
          dto: {} as any,
          entityName: 'any' as any,
          updatableBy: 'any' as any,
          countArgs: {}
        });

        expect(mockController.fail).toHaveBeenCalledTimes(1);
        expect(mockController.fail).toHaveBeenCalledWith(
          {},
          'Internal server error. If the error persists, contact our team'
        );
        expect(mockWorkerService.findOne).not.toHaveBeenCalled();
      });

      it('should send unauthorized if worker updating does not exist', async () => {
        const mockWorkerService = {
          findOne: jest.fn().mockResolvedValue(null)
        };

        await update.updatedByOwnerOrWorker({
          controller: mockController,
          service: {} as any,
          workerService: mockWorkerService as any,
          ownerService: {} as any,
          res: {} as any,
          token: { id: 1 } as any,
          by: 'worker',
          dto: {} as any,
          entityName: 'any' as any,
          updatableBy: 'any' as any,
          countArgs: {},
          workerUpdatePermission: 'any' as any
        });

        expect(mockWorkerService.findOne).toHaveBeenCalledTimes(1);
        expect(mockWorkerService.findOne).toHaveBeenCalledWith(1);
        expect(mockController.unauthorized).toHaveReturnedTimes(1);
        expect(mockController.unauthorized).toHaveBeenCalledWith(
          {},
          'Worker does not exist. Can not update the any.'
        );
      });

      it('should send unauthorized if worker does not have permissions to update', async () => {
        const mockWorkerService = {
          findOne: jest.fn().mockResolvedValue({ update: false })
        } as any;

        await update.updatedByOwnerOrWorker({
          controller: mockController,
          service: {} as any,
          ownerService: {} as any,
          workerService: mockWorkerService,
          res: {} as any,
          token: { id: 1 } as any,
          by: 'worker',
          dto: {} as any,
          entityName: 'Client',
          updatableBy: 'any' as any,
          countArgs: {},
          workerUpdatePermission: 'update' as any
        });

        expect(mockWorkerService.findOne).toHaveBeenCalledTimes(1);
        expect(mockWorkerService.findOne).toHaveBeenCalledWith(1);
        expect(mockController.unauthorized).toHaveReturnedTimes(1);
        expect(mockController.unauthorized).toHaveBeenCalledWith(
          {},
          'Worker does not have enough permissions.'
        );
      });

      it('should send unauthorized if owner updating does not exist', async () => {
        const mockOwnerService = {
          count: jest.fn().mockResolvedValue(0)
        } as any;

        await update.updatedByOwnerOrWorker({
          controller: mockController,
          service: {} as any,
          ownerService: mockOwnerService,
          workerService: {} as any,
          res: {} as any,
          token: { id: 1 } as any,
          by: 'owner',
          dto: {} as any,
          entityName: 'any' as any,
          updatableBy: 'any' as any,
          countArgs: {}
        });

        expect(mockOwnerService.count).toHaveBeenCalledTimes(1);
        expect(mockOwnerService.count).toHaveBeenCalledWith({
          person: { id: 1 }
        });
        expect(mockController.unauthorized).toHaveReturnedTimes(1);
        expect(mockController.unauthorized).toHaveBeenCalledWith(
          {},
          'Owner does not exist. Can not update the any.'
        );
      });

      it('should send unauthorized if by param is not valid', async () => {
        await update.updatedByOwnerOrWorker({
          controller: mockController,
          service: {} as any,
          ownerService: {} as any,
          workerService: {} as any,
          res: {} as any,
          token: {} as any,
          by: 'any' as any,
          dto: {} as any,
          entityName: 'any' as any,
          updatableBy: 'any' as any,
          countArgs: {}
        });

        expect(mockController.unauthorized).toHaveReturnedTimes(1);
        expect(mockController.unauthorized).toHaveBeenCalledWith(
          {},
          'Ensure to pass the [by] parameter. Valid values are any.'
        );
      });
    });
  });

  describe('Specific updaters', () => {
    describe('ownerUpdate', () => {
      let ownerFromJsonSpy: any;

      beforeEach(() => {
        jest.clearAllMocks();

        ownerFromJsonSpy = jest.spyOn(OwnerDTO, 'fromJson');
      });

      it('should update an owner', async () => {
        mockReq.headers.authorization = `Bearer ${token}`;
        const mockRes = {
          json: jest.fn().mockReturnThis(),
          status: jest.fn().mockReturnThis()
        } as any;
        const mockService = {
          count: jest.fn().mockReturnValue(1),
          save: jest.fn()
        } as any;
        const findAndUpdateSpy = jest
          .spyOn(update, 'findAndUpdateEntity')
          .mockResolvedValue({} as any);

        ownerFromJsonSpy.mockResolvedValue(mockDTO);
        const jwtSpy = jest
          .spyOn(jwt, 'decode')
          .mockReturnValue({ id: 1, email: 'test@user.com' });

        await update.ownerUpdate({
          controller: mockController,
          service: mockService,
          req: mockReq,
          res: mockRes
        });

        expect(ownerFromJsonSpy).toHaveBeenCalledWith(
          mockReq.body,
          DTOGroups.UPDATE
        );
        expect(jwtSpy).toHaveBeenCalledWith(token);
        expect(findAndUpdateSpy).toHaveBeenCalledTimes(1);
        expect(findAndUpdateSpy).toHaveBeenCalledWith({
          controller: mockController,
          service: mockService,
          res: mockRes,
          dto: mockDTO,
          entityName: 'Owner',
          countArgs: { person: { id: mockDTO.id } }
        });
      });

      it('should send a 400 code on fromJson validation error', async () => {
        await fromJsonError(
          ownerFromJsonSpy,
          jsonResSpy.mockImplementation(),
          async () => {
            await update.ownerUpdate({
              controller: mockController,
              service: {} as any,
              req: {} as any,
              res: {} as any
            });
          }
        );
      });

      it('should send unauthorized if owner to update id is not the same as the token', async () => {
        await updatedByDifferentId(
          ownerFromJsonSpy,
          mockController,
          async () => {
            await update.ownerUpdate({
              controller: mockController,
              service: {} as any,
              req: mockReq,
              res: {} as any
            });
          }
        );
      });
    });

    describe('workerUpdate', () => {
      let workerFromJsonSpy: any;

      beforeEach(() => {
        jest.clearAllMocks();

        workerFromJsonSpy = jest.spyOn(WorkerDTO, 'fromJson');
      });

      describe('Successfull updates', () => {
        const shouldUpdateBy = async ({
          workerService,
          ownerService = {},
          by
        }: WorkerShouldUpdateByProps) => {
          mockReq.headers.authorization = `Bearer ${token}`;
          const mockRes = {
            json: jest.fn().mockReturnThis(),
            status: jest.fn().mockReturnThis()
          } as any;
          const findAndUpdateSpy = jest
            .spyOn(update, 'findAndUpdateEntity')
            .mockResolvedValue({} as any);

          workerFromJsonSpy.mockResolvedValue(mockDTO);
          const jwtSpy = jest
            .spyOn(jwt, 'decode')
            .mockReturnValue({ id: 1, email: 'test@user.com' });

          await update.workerUpdate({
            controller: mockController,
            service: workerService,
            ownerService,
            req: mockReq,
            res: mockRes,
            by: by
          });

          // Common checks
          expect(workerFromJsonSpy).toHaveBeenCalledWith(
            mockReq.body,
            DTOGroups.UPDATE
          );
          expect(jwtSpy).toHaveBeenCalledWith(token);
          expect(findAndUpdateSpy).toHaveBeenCalledTimes(1);
          expect(findAndUpdateSpy).toHaveBeenCalledWith({
            controller: mockController,
            service: workerService,
            res: mockRes,
            dto: mockDTO,
            entityName: 'Worker',
            countArgs: { person: { id: mockDTO.id } }
          });
        };

        it('should update the worker by a worker', async () => {
          const mockWorkerService = {
            count: jest.fn().mockResolvedValue(1),
            save: jest.fn().mockResolvedValue({})
          } as any;

          await shouldUpdateBy({
            workerService: mockWorkerService,
            ownerService: undefined,
            by: 'worker'
          });
        });

        it('should update the worker by an owner', async () => {
          const mockWorkerService = {
            count: jest.fn().mockResolvedValue(1),
            save: jest.fn().mockResolvedValue({})
          } as any;
          const mockOwnerService = { count: jest.fn().mockResolvedValue(1) };

          await shouldUpdateBy({
            workerService: mockWorkerService,
            ownerService: mockOwnerService,
            by: 'owner'
          });

          expect(mockOwnerService.count).toHaveBeenCalledTimes(1);
          expect(mockOwnerService.count).toHaveBeenCalledWith({
            person: { id: 1 }
          });
        });
      });

      it('should send a 400 code on fromJson validation error', async () => {
        await fromJsonError(
          workerFromJsonSpy,
          jsonResSpy.mockImplementation(),
          async () => {
            await update.workerUpdate({
              controller: mockController,
              service: {} as any,
              ownerService: {} as any,
              req: {} as any,
              res: {} as any,
              by: 'worker'
            });
          }
        );
      });

      it('should send unauthorized if worker to update id is not the same as the token', async () => {
        await updatedByDifferentId(
          workerFromJsonSpy,
          mockController,
          async () => {
            await update.workerUpdate({
              controller: mockController,
              service: {} as any,
              ownerService: {} as any,
              req: mockReq,
              res: {} as any,
              by: 'worker'
            });
          }
        );
      });

      it('should send unauthorized if owner updating worker does not exist', async () => {
        const mockOwnerService = {
          count: jest.fn().mockResolvedValue(0)
        } as any;

        await updatingOwnerDoesNotExist(
          workerFromJsonSpy,
          mockController,
          mockOwnerService,
          'worker',
          async () => {
            await update.workerUpdate({
              controller: mockController,
              service: {} as any,
              ownerService: mockOwnerService,
              req: mockReq,
              res: {} as any,
              by: 'owner'
            });
          }
        );
      });

      it('should send unauthorized if by param is not valid', async () => {
        mockReq.headers = { authorization: `Bearer ${token}` };

        jest.spyOn(jwt, 'decode').mockReturnValue({ id: 1 });

        await invalidByParam(
          workerFromJsonSpy,
          mockController,
          '["owner", "worker"]',
          async () => {
            await update.workerUpdate({
              controller: mockController,
              service: {} as any,
              ownerService: {} as any,
              req: mockReq,
              res: {} as any,
              by: undefined as any
            });
          }
        );
      });
    });

    describe('trainerUpdate', () => {
      let trainerFromJsonSpy: any;

      beforeEach(() => {
        jest.clearAllMocks();

        trainerFromJsonSpy = jest.spyOn(TrainerDTO, 'fromJson');
      });

      describe('Succesfull updates', () => {
        it('should call updatedByOwnerOrWorker if by parm is Owner', async () => {
          trainerFromJsonSpy.mockResolvedValue(mockDTO);
          const updateBySpy = jest
            .spyOn(update, 'updatedByOwnerOrWorker')
            .mockResolvedValue({} as any);
          const jwtSpy = jest.spyOn(jwt, 'decode').mockReturnValue({ id: 1 });

          await update.trainerUpdate({
            controller: mockController,
            service: {} as any,
            ownerService: {} as any,
            req: mockReq,
            res: {} as any,
            by: 'owner'
          });

          expect(trainerFromJsonSpy).toHaveBeenCalledTimes(1);
          expect(trainerFromJsonSpy).toHaveBeenCalledWith({}, DTOGroups.UPDATE);
          expect(jwtSpy).toHaveBeenCalledTimes(1);
          expect(updateBySpy).toHaveBeenCalledTimes(1);
          expect(updateBySpy).toHaveBeenCalledWith({
            controller: mockController,
            service: {},
            ownerService: {} as any,
            token: { id: mockDTO.id },
            res: {},
            dto: mockDTO,
            by: 'owner',
            countArgs: { person: { id: mockDTO.id } },
            entityName: 'Trainer',
            workerUpdatePermission: 'updateTrainers',
            updatableBy: '["owner", "worker"]'
          });
        });

        it('should call updatedByOwnerOrWorker if by parm is Worker', async () => {
          trainerFromJsonSpy.mockResolvedValue(mockDTO);
          const updateBySpy = jest
            .spyOn(update, 'updatedByOwnerOrWorker')
            .mockResolvedValue({} as any);
          const jwtSpy = jest.spyOn(jwt, 'decode').mockReturnValue({ id: 1 });

          await update.trainerUpdate({
            controller: mockController,
            service: {} as any,
            workerService: {} as any,
            req: mockReq,
            res: {} as any,
            by: 'worker'
          });

          expect(trainerFromJsonSpy).toHaveBeenCalledTimes(1);
          expect(trainerFromJsonSpy).toHaveBeenCalledWith({}, DTOGroups.UPDATE);
          expect(jwtSpy).toHaveBeenCalledTimes(1);
          expect(updateBySpy).toHaveBeenCalledTimes(1);
          expect(updateBySpy).toHaveBeenCalledWith({
            controller: mockController,
            service: {},
            ownerService: undefined,
            token: { id: mockDTO.id },
            workerService: {} as any,
            res: {},
            dto: mockDTO,
            by: 'worker',
            countArgs: { person: { id: mockDTO.id } },
            entityName: 'Trainer',
            workerUpdatePermission: 'updateTrainers',
            updatableBy: '["owner", "worker"]'
          });
        });
      });

      it('should send a 400 code on fromJson validation error', async () => {
        await fromJsonError(
          trainerFromJsonSpy,
          jsonResSpy.mockImplementation(),
          async () => {
            await update.trainerUpdate({
              controller: mockController,
              service: {} as any,
              ownerService: {} as any,
              workerService: {} as any,
              req: {} as any,
              res: {} as any,
              by: 'worker'
            });
          }
        );
      });
    });

    describe('clientUpdate', () => {
      let clientFromJsonSpy: any;

      beforeEach(() => {
        jest.clearAllMocks();

        clientFromJsonSpy = jest.spyOn(ClientDTO, 'fromJson');
      });

      describe('Succesfull updates', () => {
        it('should update a client by themself', async () => {
          clientFromJsonSpy.mockResolvedValue(mockDTO);
          const findAndUpdateSpy = jest
            .spyOn(update, 'findAndUpdateEntity')
            .mockResolvedValue({} as any);
          const jwtSpy = jest.spyOn(jwt, 'decode').mockReturnValue({ id: 1 });

          await update.clientUpdate({
            controller: mockController,
            service: {} as any,
            req: mockReq,
            res: {} as any,
            by: 'client'
          });

          expect(clientFromJsonSpy).toHaveBeenCalledTimes(1);
          expect(clientFromJsonSpy).toHaveBeenCalledWith({}, DTOGroups.UPDATE);
          expect(jwtSpy).toHaveBeenCalledTimes(1);
          expect(findAndUpdateSpy).toHaveBeenCalledTimes(1);
          expect(findAndUpdateSpy).toHaveBeenCalledWith({
            controller: mockController,
            service: {},
            res: {},
            dto: mockDTO,
            countArgs: { person: { id: mockDTO.id } },
            entityName: 'Client'
          });
        });

        it('should call updatedByOwnerOrWorker if by parm is Owner', async () => {
          clientFromJsonSpy.mockResolvedValue(mockDTO);
          const updateBySpy = jest
            .spyOn(update, 'updatedByOwnerOrWorker')
            .mockResolvedValue({} as any);
          const jwtSpy = jest.spyOn(jwt, 'decode').mockReturnValue({ id: 1 });

          await update.clientUpdate({
            controller: mockController,
            service: {} as any,
            ownerService: {} as any,
            req: mockReq,
            res: {} as any,
            by: 'owner'
          });

          expect(clientFromJsonSpy).toHaveBeenCalledTimes(1);
          expect(clientFromJsonSpy).toHaveBeenCalledWith({}, DTOGroups.UPDATE);
          expect(jwtSpy).toHaveBeenCalledTimes(1);
          expect(updateBySpy).toHaveBeenCalledTimes(1);
          expect(updateBySpy).toHaveBeenCalledWith({
            controller: mockController,
            service: {},
            ownerService: {} as any,
            workerService: undefined,
            token: { id: mockDTO.id },
            res: {},
            dto: mockDTO,
            by: 'owner',
            countArgs: { person: { id: mockDTO.id } },
            entityName: 'Client',
            workerUpdatePermission: expect.anything(),
            updatableBy: '["client", "owner", "worker"]'
          });
        });

        it('should call updatedByOwnerOrWorker if by parm is Worker', async () => {
          clientFromJsonSpy.mockResolvedValue(mockDTO);
          const updateBySpy = jest
            .spyOn(update, 'updatedByOwnerOrWorker')
            .mockResolvedValue({} as any);
          const jwtSpy = jest.spyOn(jwt, 'decode').mockReturnValue({ id: 1 });

          await update.clientUpdate({
            controller: mockController,
            service: {} as any,
            workerService: {} as any,
            req: mockReq,
            res: {} as any,
            by: 'worker'
          });

          expect(clientFromJsonSpy).toHaveBeenCalledTimes(1);
          expect(clientFromJsonSpy).toHaveBeenCalledWith({}, DTOGroups.UPDATE);
          expect(jwtSpy).toHaveBeenCalledTimes(1);
          expect(updateBySpy).toHaveBeenCalledTimes(1);
          expect(updateBySpy).toHaveBeenCalledWith({
            controller: mockController,
            service: {},
            ownerService: undefined,
            token: { id: mockDTO.id },
            workerService: {} as any,
            res: {},
            dto: mockDTO,
            by: 'worker',
            countArgs: { person: { id: mockDTO.id } },
            entityName: 'Client',
            workerUpdatePermission: 'updateClients',
            updatableBy: '["client", "owner", "worker"]'
          });
        });
      });

      it('should send a 400 code on fromJson validation error', async () => {
        await fromJsonError(
          clientFromJsonSpy,
          jsonResSpy.mockImplementation(),
          async () => {
            await update.clientUpdate({
              controller: mockController,
              service: {} as any,
              ownerService: {} as any,
              workerService: {} as any,
              req: {} as any,
              res: {} as any,
              by: 'client'
            });
          }
        );
      });

      it('should send unauthorized if client to update id is not the same as the token', async () => {
        await updatedByDifferentId(
          clientFromJsonSpy,
          mockController,
          async () => {
            await update.clientUpdate({
              controller: mockController,
              service: {} as any,
              ownerService: {} as any,
              workerService: {} as any,
              req: mockReq,
              res: {} as any,
              by: 'client'
            });
          }
        );
      });
    });
  });
});
