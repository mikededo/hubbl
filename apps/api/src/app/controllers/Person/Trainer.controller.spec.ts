import { getRepository } from 'typeorm';

import { TrainerDTO } from '@hubbl/shared/models/dto';

import {
  OwnerService,
  PersonService,
  TrainerService,
  WorkerService
} from '../../services';
import * as helpers from '../helpers';
import * as personHelpers from './helpers';
import * as log from 'npmlog';
import {
  TrainerRegisterController,
  TrainerUpdateController,
  TrainerFetchController
} from './Trainer.controller';

jest.mock('../../services');
jest.mock('./helpers');
jest.mock('../helpers');
jest.mock('npmlog');

describe('TrainerController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('TrainerFetch', () => {
    const mockReq = { query: { skip: 0 } };
    const mockRes = { locals: { token: { id: 1, user: 'owner' } } };
    const rawTrainer = {
      p_id: 1,
      p_email: 'test@trainer.com',
      p_password:
        '$2b$10$zsQ.IYU10.xT7IXkoCuuFexFzW9adEgQw6bodSYWMmwM1LaPK6lXS',
      p_first_name: 'Test',
      p_last_name: 'Trainer',
      p_phone: null,
      p_theme: 'LIGHT',
      p_gender: 'OTHER',
      p_gym_id: 1,
      t_worker_code: '6198fcb2-fbfd-44a5-ac34-d9c3b6033fa0',
      t_trainer_person_fk: 1,
      t_manager_id_fk: 1
    };
    const parsedTrainer = {
      id: 1,
      firstName: 'Test',
      lastName: 'Trainer',
      email: 'test@trainer.com',
      password: '$2b$10$zsQ.IYU10.xT7IXkoCuuFexFzW9adEgQw6bodSYWMmwM1LaPK6lXS',
      phone: null,
      theme: 'LIGHT',
      gender: 'OTHER',
      managerId: 1,
      workerCode: '6198fcb2-fbfd-44a5-ac34-d9c3b6033fa0'
    };

    const mockQueryBuilder = {
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      getRawMany: jest.fn()
    };
    const mockService = {
      createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder)
    };
    const mockPersonService = { findOne: jest.fn() };

    const fromClassSpy = jest.spyOn(TrainerDTO, 'fromClass');
    const logSpy = jest.spyOn(log, 'error');

    beforeEach(() => {
      jest.clearAllMocks();
    });

    describe('execute', () => {
      const setupServices = () => {
        TrainerFetchController['service'] = mockService as any;
        TrainerFetchController['personService'] = mockPersonService as any;
      };

      it('should create the needed services if does not have any', async () => {
        TrainerFetchController['service'] = undefined;
        TrainerFetchController['personService'] = undefined;

        jest.spyOn(TrainerFetchController, 'fail').mockImplementation();

        await TrainerFetchController.execute({} as any, {} as any);

        expect(TrainerService).toHaveBeenCalledTimes(1);
        expect(TrainerService).toHaveBeenCalledWith(getRepository);
        expect(PersonService).toHaveBeenCalledTimes(1);
        expect(PersonService).toHaveBeenCalledWith(getRepository);
      });

      it('should return the list of trainers', async () => {
        mockQueryBuilder.getRawMany.mockResolvedValue([rawTrainer, rawTrainer]);
        mockPersonService.findOne.mockResolvedValue({ gym: { id: 1 } });

        const okSpy = jest
          .spyOn(TrainerFetchController, 'ok')
          .mockImplementation();

        setupServices();
        await TrainerFetchController.execute(mockReq as any, mockRes as any);

        expect(mockPersonService.findOne).toHaveBeenCalledTimes(1);
        expect(mockPersonService.findOne).toHaveBeenCalledWith({
          id: mockRes.locals.token.id
        });
        expect(mockService.createQueryBuilder).toHaveBeenCalledTimes(1);
        expect(mockService.createQueryBuilder).toHaveBeenCalledWith({
          alias: 't'
        });
        expect(mockQueryBuilder.leftJoinAndSelect).toHaveBeenCalledTimes(1);
        expect(mockQueryBuilder.leftJoinAndSelect).toHaveBeenCalledWith(
          'person',
          'p'
        );
        expect(mockQueryBuilder.where).toHaveBeenCalledTimes(1);
        expect(mockQueryBuilder.where).toHaveBeenCalledWith('p.gym = :gymId', {
          gymId: 1
        });
        expect(mockQueryBuilder.andWhere).toHaveBeenCalledTimes(1);
        expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
          't.trainer_person_fk = p.id'
        );
        expect(mockQueryBuilder.skip).toHaveBeenCalledTimes(1);
        expect(mockQueryBuilder.skip).toHaveBeenCalledWith(mockReq.query.skip);
        expect(mockQueryBuilder.limit).toHaveBeenCalledTimes(1);
        expect(mockQueryBuilder.limit).toHaveBeenCalledWith(25);
        expect(mockQueryBuilder.getRawMany).toHaveBeenCalledTimes(1);
        expect(fromClassSpy).toHaveBeenCalledTimes(2);
        expect(fromClassSpy).toHaveNthReturnedWith(1, parsedTrainer);
        expect(fromClassSpy).toHaveNthReturnedWith(2, parsedTrainer);
        expect(okSpy).toHaveBeenCalledTimes(1);
        expect(okSpy).toHaveBeenCalledWith(mockRes, [
          parsedTrainer,
          parsedTrainer
        ]);
      });

      it('should use skip as 0 if not given', async () => {
        mockQueryBuilder.getRawMany.mockResolvedValue([rawTrainer, rawTrainer]);
        mockPersonService.findOne.mockResolvedValue({ gym: { id: 1 } });

        const okSpy = jest
          .spyOn(TrainerFetchController, 'ok')
          .mockImplementation();

        setupServices();
        await TrainerFetchController.execute(
          { query: {} } as any,
          mockRes as any
        );

        expect(mockPersonService.findOne).toHaveBeenCalledTimes(1);
        expect(mockQueryBuilder.skip).toHaveBeenCalledTimes(1);
        expect(mockQueryBuilder.skip).toHaveBeenCalledWith(0);
        expect(mockQueryBuilder.getRawMany).toHaveBeenCalledTimes(1);
        expect(fromClassSpy).toHaveBeenCalledTimes(2);
        expect(okSpy).toHaveBeenCalledTimes(1);
      });

      it('should call forbidden if person is not owner nor worker', async () => {
        const mockRes = { locals: { token: { id: 1, user: 'client' } } } as any;
        const forbiddenSpy = jest
          .spyOn(TrainerFetchController, 'forbidden')
          .mockImplementation();

        setupServices();
        await TrainerFetchController.execute(mockReq as any, mockRes as any);

        expect(forbiddenSpy).toHaveBeenCalledTimes(1);
        expect(forbiddenSpy).toHaveBeenCalledWith(
          mockRes,
          'User can not fetch the trainers.'
        );
      });

      it('should call forbidden if person does not exist', async () => {
        mockPersonService.findOne.mockResolvedValue(undefined);
        const unauthorizedSpy = jest
          .spyOn(TrainerFetchController, 'unauthorized')
          .mockImplementation();

        setupServices();
        await TrainerFetchController.execute(mockReq as any, mockRes as any);

        expect(unauthorizedSpy).toHaveBeenCalledTimes(1);
        expect(unauthorizedSpy).toHaveBeenCalledWith(
          mockRes,
          'Person does not exist'
        );
      });

      it('should call fail on personService error', async () => {
        mockPersonService.findOne.mockRejectedValue('error-thrown');
        const failSpy = jest
          .spyOn(TrainerFetchController, 'fail')
          .mockImplementation();

        setupServices();
        await TrainerFetchController.execute(mockReq as any, mockRes as any);

        expect(logSpy).toHaveBeenCalledTimes(1);
        expect(logSpy).toHaveBeenCalledWith(
          `Controller [${TrainerFetchController.constructor.name}]`,
          '"fetch" handler',
          'error-thrown'
        );
        expect(failSpy).toHaveBeenCalledTimes(1);
        expect(failSpy).toHaveBeenCalledWith(
          mockRes,
          'Internal server error. If the problem persists, contact our team.'
        );
      });

      it('should call fail on service error', async () => {
        mockQueryBuilder.getRawMany.mockRejectedValue('error-thrown');
        mockPersonService.findOne.mockResolvedValue({ gym: { id: 1 } });
        const failSpy = jest
          .spyOn(TrainerFetchController, 'fail')
          .mockImplementation();

        setupServices();
        await TrainerFetchController.execute(mockReq as any, mockRes as any);

        expect(logSpy).toHaveBeenCalledTimes(1);
        expect(logSpy).toHaveBeenCalledWith(
          `Controller [${TrainerFetchController.constructor.name}]`,
          '"fetch" handler',
          'error-thrown'
        );
        expect(failSpy).toHaveBeenCalledTimes(1);
        expect(failSpy).toHaveBeenCalledWith(
          mockRes,
          'Internal server error. If the problem persists, contact our team.'
        );
      });
    });
  });

  describe('TrainerRegister', () => {
    describe('run', () => {
      it('should create a service if does not have any', async () => {
        await TrainerRegisterController.execute({} as any, {} as any);

        expect(TrainerService).toHaveBeenCalledTimes(1);
        expect(TrainerService).toHaveBeenCalledWith(getRepository);
      });

      it('should call trainerRegister', async () => {
        const trainerRegisterSpy = jest
          .spyOn(personHelpers, 'trainerRegister')
          .mockImplementation();

        TrainerRegisterController['service'] = {} as any;
        await TrainerRegisterController.execute({} as any, {} as any);

        expect(trainerRegisterSpy).toHaveBeenCalledWith({
          service: {},
          controller: TrainerRegisterController,
          fromJson: TrainerDTO.fromJson,
          fromClass: TrainerDTO.fromClass,
          req: {},
          res: {}
        });
      });
    });
  });

  describe('TrainerUpdateController', () => {
    describe('execute', () => {
      it('should create the needed services if does not have any', async () => {
        TrainerUpdateController['service'] = undefined;
        TrainerUpdateController['ownerService'] = undefined;
        TrainerUpdateController['workerService'] = undefined;

        await TrainerUpdateController.execute({} as any, {} as any);

        expect(TrainerService).toHaveBeenCalledTimes(1);
        expect(TrainerService).toHaveBeenCalledWith(getRepository);
        expect(OwnerService).toHaveBeenCalledTimes(1);
        expect(OwnerService).toHaveBeenCalledWith(getRepository);
        expect(WorkerService).toHaveBeenCalledTimes(1);
        expect(WorkerService).toHaveBeenCalledWith(getRepository);
      });

      it('should call trainerUpdate', async () => {
        const trainerUpdate = jest
          .spyOn(helpers, 'trainerUpdate')
          .mockImplementation();

        TrainerUpdateController['service'] = {} as any;
        TrainerUpdateController['ownerService'] = {} as any;
        TrainerUpdateController['workerService'] = {} as any;
        await TrainerUpdateController.execute({} as any, {} as any);

        expect(trainerUpdate).toHaveBeenCalledWith({
          service: {},
          ownerService: {},
          workerService: {},
          controller: TrainerUpdateController,
          req: {},
          res: {}
        });
      });
    });
  });
});
