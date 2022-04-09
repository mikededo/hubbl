import * as jwt from 'jsonwebtoken';
import * as log from 'npmlog';

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
  user: 'owner' | 'worker';
};

type CommonShouldUpdateByProps = {
  service: BaseService<any>;
  ownerService?: BaseService<Owner>;
  workerService?: BaseService<Worker>;
  user: 'owner' | 'worker';
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

  const jsonResSpy = jest.spyOn(BaseController, 'jsonResponse');
  const logSpy = jest.spyOn(log, 'error').mockImplementation();
  const mockRes = {
    json: jest.fn().mockReturnThis(),
    status: jest.fn().mockReturnThis()
  } as any;
  const mockOwnerRes = {
    ...mockRes,
    locals: { token: { id: 1, user: 'owner' } }
  };
  const mockWorkerRes = {
    ...mockRes,
    locals: { token: { id: 1, user: 'worker' } }
  };
  const mockClientRes = {
    ...mockRes,
    locals: { token: { id: 1, user: 'client' } }
  };
  const mockOwnerDiffIdRes = {
    ...mockRes,
    locals: { token: { id: 2, user: 'owner' } }
  } as any;
  const mockWorkerDiffIdRes = {
    ...mockRes,
    locals: { token: { id: 2, user: 'worker' } }
  } as any;
  const mockClientDiffIdRes = {
    ...mockRes,
    locals: { token: { id: 2, user: 'client' } }
  } as any;

  const token = jwt.sign(
    { id: 1, email: 'test@user.com' },
    process.env.NX_JWT_TOKEN || 'test-secret-token'
  );

  /* Helpers */
  const logAsserts = () => {
    expect(logSpy).toHaveBeenCalledTimes(1);
    expect(logSpy).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(String),
      expect.any(String)
    );
  };

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
    expect(jsonResSpy).toHaveBeenCalledWith(mockRes, 400, 'error-thrown');
  };

  const updatedByDifferentId = async (
    fromJsonSpy: any,
    controller: BaseController,
    response: any,
    updater: () => Promise<void>
  ) => {
    fromJsonSpy.mockResolvedValue(mockDTO);
    mockReq.headers = { authorization: `Bearer ${token}` };

    await updater();

    expect(fromJsonSpy).toHaveBeenCalledTimes(1);
    expect(controller.unauthorized).toHaveReturnedTimes(1);
    expect(controller.unauthorized).toHaveBeenCalledWith(response);
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

    await updater();

    expect(fromJsonSpy).toHaveBeenCalledTimes(1);
    expect(service.count).toHaveBeenCalledTimes(1);
    expect(service.count).toHaveBeenCalledWith({
      where: { personId: 1 }
    });
    expect(controller.unauthorized).toHaveReturnedTimes(1);
    expect(controller.unauthorized).toHaveBeenCalledWith(
      mockOwnerRes,
      `Owner does not exist. Can not update the ${entity}.`
    );
  };

  const clientCanNotUpdate = async (
    fromJsonSpy: any,
    controller: BaseController,
    updater: () => Promise<void>
  ) => {
    fromJsonSpy.mockResolvedValue(mockDTO);
    mockReq.headers = { authorization: `Bearer ${token}` };

    await updater();

    expect(fromJsonSpy).toHaveBeenCalledTimes(1);
    expect(controller.unauthorized).toHaveReturnedTimes(1);
    expect(controller.unauthorized).toHaveBeenCalledWith(
      mockClientRes,
      'Client can not perform such operation.'
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
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
          res: mockRes,
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
          res: mockRes,
          entityName: 'Any' as any,
          countArgs: {} as any
        });

        expect(mockService.count).toHaveBeenCalledTimes(1);
        expect(mockService.count).toHaveBeenCalledWith({});
        expect(mockController.notFound).toHaveBeenCalledTimes(1);
        expect(mockController.notFound).toHaveBeenCalledWith(
          mockRes,
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
          res: mockRes,
          dto: mockDTO,
          entityName: 'Any' as any,
          countArgs: { entityId: mockDTO.id }
        });

        expect(mockService.count).toHaveBeenCalledTimes(1);
        expect(mockService.save).toHaveBeenCalledTimes(1);
        expect(mockService.save).toHaveBeenCalledWith(mockPerson);
        logAsserts();
        expect(mockController.fail).toHaveReturnedTimes(1);
        expect(mockController.fail).toHaveBeenCalledWith(
          mockRes,
          'Internal server error. If the problem persists, contact our team.'
        );
      });
    });

    describe('updateByOwnerOrWorker', () => {
      describe('Successfull updates', () => {
        const shouldUpdateBy = async ({
          service,
          ownerService = {} as any,
          workerService = {} as any,
          user
        }: CommonShouldUpdateByProps) => {
          const findAndUpdateSpy = jest
            .spyOn(update, 'findAndUpdateEntity')
            .mockResolvedValue({} as any);

          await update.updatedByOwnerOrWorker({
            controller: mockController,
            service: service,
            ownerService,
            workerService,
            res: user === 'worker' ? mockWorkerRes : mockOwnerRes,
            dto: mockDTO,
            token: { id: 1, email: 'test@user.com', user },
            entityName: 'Client',
            countArgs: {},
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
            user: 'owner'
          });

          expect(mockOwnerService.count).toHaveBeenCalledTimes(1);
        });

        it('should update by worker', async () => {
          const mockService = {
            count: jest.fn().mockResolvedValue(1),
            save: jest.fn()
          } as any;
          const mockWorkerService = {
            findOneBy: jest.fn().mockResolvedValue({ any: true })
          } as any;

          await shouldUpdateBy({
            service: mockService,
            workerService: mockWorkerService,
            user: 'worker'
          });

          expect(mockWorkerService.findOneBy).toHaveBeenCalledTimes(1);
        });
      });

      it('should send fail if no workerUpdatePermission passed', async () => {
        const mockWorkerService = { findOne: jest.fn() };

        await update.updatedByOwnerOrWorker({
          controller: mockController,
          service: {} as any,
          workerService: mockWorkerService as any,
          ownerService: {} as any,
          res: mockWorkerRes,
          token: mockWorkerRes.locals.token,
          dto: {} as any,
          entityName: 'any' as any,
          countArgs: {}
        });

        logAsserts();
        expect(mockController.fail).toHaveBeenCalledTimes(1);
        expect(mockController.fail).toHaveBeenCalledWith(
          mockWorkerRes,
          'Internal server error. If the problem persists, contact our team.'
        );
        expect(mockWorkerService.findOne).not.toHaveBeenCalled();
      });

      it('should send unauthorized if worker updating does not exist', async () => {
        const mockWorkerService = {
          findOneBy: jest.fn().mockResolvedValue(null)
        };

        await update.updatedByOwnerOrWorker({
          controller: mockController,
          service: {} as any,
          workerService: mockWorkerService as any,
          ownerService: {} as any,
          res: mockWorkerRes,
          token: mockWorkerRes.locals.token,
          dto: {} as any,
          entityName: 'any' as any,
          countArgs: {},
          workerUpdatePermission: 'any' as any
        });

        expect(mockWorkerService.findOneBy).toHaveBeenCalledTimes(1);
        expect(mockWorkerService.findOneBy).toHaveBeenCalledWith({ personId: 1 });
        expect(mockController.unauthorized).toHaveReturnedTimes(1);
        expect(mockController.unauthorized).toHaveBeenCalledWith(
          mockWorkerRes,
          'Worker does not exist. Can not update the any.'
        );
      });

      it('should send unauthorized if worker does not have permissions to update', async () => {
        const mockWorkerService = {
          findOneBy: jest.fn().mockResolvedValue({ update: false })
        } as any;

        await update.updatedByOwnerOrWorker({
          controller: mockController,
          service: {} as any,
          ownerService: {} as any,
          workerService: mockWorkerService,
          res: mockWorkerRes,
          token: mockWorkerRes.locals.token,
          dto: {} as any,
          entityName: 'Client',
          countArgs: {},
          workerUpdatePermission: 'update' as any
        });

        expect(mockWorkerService.findOneBy).toHaveBeenCalledTimes(1);
        expect(mockWorkerService.findOneBy).toHaveBeenCalledWith({ personId: 1 });
        expect(mockController.unauthorized).toHaveReturnedTimes(1);
        expect(mockController.unauthorized).toHaveBeenCalledWith(
          mockWorkerRes,
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
          res: mockOwnerRes,
          token: mockOwnerRes.locals.token,
          dto: {} as any,
          entityName: 'any' as any,
          countArgs: {}
        });

        expect(mockOwnerService.count).toHaveBeenCalledTimes(1);
        expect(mockOwnerService.count).toHaveBeenCalledWith({
          where: { personId: 1 }
        });
        expect(mockController.unauthorized).toHaveReturnedTimes(1);
        expect(mockController.unauthorized).toHaveBeenCalledWith(
          mockOwnerRes,
          'Owner does not exist. Can not update the any.'
        );
      });

      it('should send unauthorized if user is not owner nor worker', async () => {
        await update.updatedByOwnerOrWorker({
          controller: mockController,
          service: {} as any,
          ownerService: {} as any,
          workerService: {} as any,
          res: mockClientRes,
          token: {} as any,
          dto: {} as any,
          entityName: 'any' as any,
          countArgs: {}
        });

        expect(mockController.unauthorized).toHaveReturnedTimes(1);
        expect(mockController.unauthorized).toHaveBeenCalledWith(
          mockClientRes,
          'Client can not perform such operation.'
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

        const mockService = {
          count: jest.fn().mockReturnValue(1),
          save: jest.fn()
        } as any;
        const findAndUpdateSpy = jest
          .spyOn(update, 'findAndUpdateEntity')
          .mockResolvedValue({} as any);

        ownerFromJsonSpy.mockResolvedValue(mockDTO);

        await update.ownerUpdate({
          controller: mockController,
          service: mockService,
          req: mockReq,
          res: mockOwnerRes
        });

        expect(ownerFromJsonSpy).toHaveBeenCalledWith(
          mockReq.body,
          DTOGroups.UPDATE
        );
        expect(findAndUpdateSpy).toHaveBeenCalledTimes(1);
        expect(findAndUpdateSpy).toHaveBeenCalledWith({
          controller: mockController,
          service: mockService,
          res: mockOwnerRes,
          dto: mockDTO,
          entityName: 'Owner',
          countArgs: { where: { personId: mockDTO.id } }
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
              res: mockRes
            });
          }
        );
      });

      it('should send unauthorized if owner to update id is not the same as the token', async () => {
        await updatedByDifferentId(
          ownerFromJsonSpy,
          mockController,
          mockOwnerDiffIdRes,
          async () => {
            await update.ownerUpdate({
              controller: mockController,
              service: {} as any,
              req: mockReq,
              res: mockOwnerDiffIdRes
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
          user
        }: WorkerShouldUpdateByProps) => {
          mockReq.headers.authorization = `Bearer ${token}`;
          const findAndUpdateSpy = jest
            .spyOn(update, 'findAndUpdateEntity')
            .mockResolvedValue({} as any);

          workerFromJsonSpy.mockResolvedValue(mockDTO);

          await update.workerUpdate({
            controller: mockController,
            service: workerService,
            ownerService,
            req: mockReq,
            res: user === 'worker' ? mockWorkerRes : mockOwnerRes
          });

          // Common checks
          expect(workerFromJsonSpy).toHaveBeenCalledWith(
            mockReq.body,
            DTOGroups.UPDATE
          );
          expect(findAndUpdateSpy).toHaveBeenCalledTimes(1);
          expect(findAndUpdateSpy).toHaveBeenCalledWith({
            controller: mockController,
            service: workerService,
            res: user === 'worker' ? mockWorkerRes : mockOwnerRes,
            dto: mockDTO,
            entityName: 'Worker',
            countArgs: { where: { personId: mockDTO.id } }
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
            user: 'worker'
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
            user: 'owner'
          });

          expect(mockOwnerService.count).toHaveBeenCalledTimes(1);
          expect(mockOwnerService.count).toHaveBeenCalledWith({
            where: { personId: 1 }
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
              res: mockRes
            });
          }
        );
      });

      it('should send unauthorized if worker to update id is not the same as the token', async () => {
        await updatedByDifferentId(
          workerFromJsonSpy,
          mockController,
          mockWorkerDiffIdRes,
          async () => {
            await update.workerUpdate({
              controller: mockController,
              service: {} as any,
              ownerService: {} as any,
              req: mockReq,
              res: mockWorkerDiffIdRes
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
              res: mockOwnerRes
            });
          }
        );
      });

      it('should send unauthorized if user is not owner nor worker', async () => {
        mockReq.headers = { authorization: `Bearer ${token}` };

        await clientCanNotUpdate(
          workerFromJsonSpy,
          mockController,
          async () => {
            await update.workerUpdate({
              service: {} as any,
              controller: mockController,
              ownerService: {} as any,
              req: mockReq,
              res: mockClientRes
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
        it('should call updatedByOwnerOrWorker by Owner', async () => {
          trainerFromJsonSpy.mockResolvedValue(mockDTO);
          const updateBySpy = jest
            .spyOn(update, 'updatedByOwnerOrWorker')
            .mockResolvedValue({} as any);

          await update.trainerUpdate({
            controller: mockController,
            service: {} as any,
            ownerService: {} as any,
            req: mockReq,
            res: mockOwnerRes
          });

          expect(trainerFromJsonSpy).toHaveBeenCalledTimes(1);
          expect(trainerFromJsonSpy).toHaveBeenCalledWith({}, DTOGroups.UPDATE);
          expect(updateBySpy).toHaveBeenCalledTimes(1);
          expect(updateBySpy).toHaveBeenCalledWith({
            controller: mockController,
            service: {},
            ownerService: {} as any,
            token: mockOwnerRes.locals.token,
            res: mockOwnerRes,
            dto: mockDTO,
            countArgs: { where: { personId: mockDTO.id } },
            entityName: 'Trainer',
            workerUpdatePermission: 'updateTrainers'
          });
        });

        it('should call updatedByOwnerOrWorker if updated by worker', async () => {
          trainerFromJsonSpy.mockResolvedValue(mockDTO);
          const updateBySpy = jest
            .spyOn(update, 'updatedByOwnerOrWorker')
            .mockResolvedValue({} as any);

          await update.trainerUpdate({
            controller: mockController,
            service: {} as any,
            workerService: {} as any,
            req: mockReq,
            res: mockWorkerRes
          });

          expect(trainerFromJsonSpy).toHaveBeenCalledTimes(1);
          expect(trainerFromJsonSpy).toHaveBeenCalledWith({}, DTOGroups.UPDATE);
          expect(updateBySpy).toHaveBeenCalledTimes(1);
          expect(updateBySpy).toHaveBeenCalledWith({
            controller: mockController,
            service: {},
            ownerService: undefined,
            token: mockWorkerRes.locals.token,
            workerService: {} as any,
            res: mockWorkerRes,
            dto: mockDTO,
            countArgs: { where: { personId: mockDTO.id } },
            entityName: 'Trainer',
            workerUpdatePermission: 'updateTrainers'
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
              res: mockRes
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

          await update.clientUpdate({
            controller: mockController,
            service: {} as any,
            req: mockReq,
            res: mockClientRes
          });

          expect(clientFromJsonSpy).toHaveBeenCalledTimes(1);
          expect(clientFromJsonSpy).toHaveBeenCalledWith({}, DTOGroups.UPDATE);
          expect(findAndUpdateSpy).toHaveBeenCalledTimes(1);
          expect(findAndUpdateSpy).toHaveBeenCalledWith({
            controller: mockController,
            service: {},
            res: mockClientRes,
            dto: mockDTO,
            countArgs: { where: { personId: mockDTO.id } },
            entityName: 'Client'
          });
        });

        it('should call updatedByOwnerOrWorker if updated by owner', async () => {
          clientFromJsonSpy.mockResolvedValue(mockDTO);
          const updateBySpy = jest
            .spyOn(update, 'updatedByOwnerOrWorker')
            .mockResolvedValue({} as any);

          await update.clientUpdate({
            controller: mockController,
            service: {} as any,
            ownerService: {} as any,
            req: mockReq,
            res: mockOwnerRes
          });

          expect(clientFromJsonSpy).toHaveBeenCalledTimes(1);
          expect(clientFromJsonSpy).toHaveBeenCalledWith({}, DTOGroups.UPDATE);
          expect(updateBySpy).toHaveBeenCalledTimes(1);
          expect(updateBySpy).toHaveBeenCalledWith({
            controller: mockController,
            service: {},
            ownerService: {} as any,
            workerService: undefined,
            token: mockOwnerRes.locals.token,
            res: mockOwnerRes,
            dto: mockDTO,
            countArgs: { where: { personId: mockDTO.id } },
            entityName: 'Client',
            workerUpdatePermission: expect.anything()
          });
        });

        it('should call updatedByOwnerOrWorker if updated by worker', async () => {
          clientFromJsonSpy.mockResolvedValue(mockDTO);
          const updateBySpy = jest
            .spyOn(update, 'updatedByOwnerOrWorker')
            .mockResolvedValue({} as any);

          await update.clientUpdate({
            controller: mockController,
            service: {} as any,
            workerService: {} as any,
            req: mockReq,
            res: mockWorkerRes
          });

          expect(clientFromJsonSpy).toHaveBeenCalledTimes(1);
          expect(clientFromJsonSpy).toHaveBeenCalledWith({}, DTOGroups.UPDATE);
          expect(updateBySpy).toHaveBeenCalledTimes(1);
          expect(updateBySpy).toHaveBeenCalledWith({
            controller: mockController,
            service: {},
            ownerService: undefined,
            token: mockWorkerRes.locals.token,
            workerService: {} as any,
            res: mockWorkerRes,
            dto: mockDTO,
            countArgs: { where: { personId: mockDTO.id } },
            entityName: 'Client',
            workerUpdatePermission: 'updateClients'
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
              res: mockRes
            });
          }
        );
      });

      it('should send unauthorized if client to update id is not the same as the token', async () => {
        await updatedByDifferentId(
          clientFromJsonSpy,
          mockController,
          mockClientDiffIdRes,
          async () => {
            await update.clientUpdate({
              controller: mockController,
              service: {} as any,
              ownerService: {} as any,
              workerService: {} as any,
              req: mockReq,
              res: mockClientDiffIdRes
            });
          }
        );
      });
    });
  });
});
