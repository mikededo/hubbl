import { getRepository } from 'typeorm';

import { TrainerTagDTO } from '@hubbl/shared/models/dto';

import { PersonService, TrainerTagService } from '../../services';
import { TrainerTagFetchController } from './TrainerTag.controller';

import * as log from 'npmlog';

jest.mock('npmlog');
jest.mock('@hubbl/shared/models/dto');
jest.mock('../../services');

type FailControllers = typeof TrainerTagFetchController;

type Operations = 'fetch';

describe('TrainerTag controller', () => {
  const logSpy = jest.spyOn(log, 'error');

  const failAsserts = (
    controller: FailControllers,
    operation: Operations,
    res: any,
    failSpy: jest.SpyInstance
  ) => {
    expect(logSpy).toHaveBeenCalledTimes(1);
    expect(logSpy).toHaveBeenCalledWith(
      `Controller[${controller.constructor.name}]`,
      `"${operation}" handler`,
      'error-thrown'
    );
    expect(failSpy).toHaveBeenCalledTimes(1);
    expect(failSpy).toHaveBeenCalledWith(
      res,
      'Internal server error. If the error persists, contact our team.'
    );
  };

  describe('TrainerTagFetchController', () => {
    const mockPerson = { id: 1, gym: { id: 2 } };
    const mockRes = { locals: { token: { id: 1, user: 'owner' } } };
    const mockClientRes = { locals: { token: { id: 1, user: 'client' } } };

    const mockPersonService = { findOne: jest.fn() };
    const mockTagService = { find: jest.fn() };

    const fromClassSpy = jest.spyOn(TrainerTagDTO, 'fromClass');
    const failSpy = jest.spyOn(TrainerTagFetchController, 'fail');

    beforeEach(() => {
      jest.clearAllMocks();

      failSpy.mockImplementation();
    });

    const setupServices = () => {
      TrainerTagFetchController['service'] = mockTagService as any;
      TrainerTagFetchController['personService'] = mockPersonService as any;
    };

    it('should create the services if does not have any', async () => {
      jest.spyOn(TrainerTagFetchController, 'fail');

      TrainerTagFetchController['service'] = undefined;
      TrainerTagFetchController['personService'] = undefined;

      await TrainerTagFetchController.execute({} as any, {} as any);

      expect(TrainerTagService).toHaveBeenCalledTimes(1);
      expect(TrainerTagService).toHaveBeenCalledWith(getRepository);
      expect(PersonService).toHaveBeenCalledTimes(1);
      expect(PersonService).toHaveBeenCalledWith(getRepository);
    });

    it('should return the list of TrainerTags as owner or worker', async () => {
      fromClassSpy.mockReturnValue({} as any);
      mockPersonService.findOne.mockResolvedValue(mockPerson);
      mockTagService.find.mockResolvedValue([{}, {}]);

      const okSpy = jest
        .spyOn(TrainerTagFetchController, 'ok')
        .mockImplementation();

      setupServices();
      await TrainerTagFetchController.execute({} as any, mockRes as any);

      expect(mockPersonService.findOne).toHaveBeenCalledTimes(1);
      expect(mockPersonService.findOne).toHaveBeenCalledWith({
        id: mockRes.locals.token.id,
        options: { select: ['id', 'gym'] }
      });
      expect(mockTagService.find).toHaveBeenCalledTimes(1);
      expect(mockTagService.find).toHaveBeenCalledWith({
        where: { gym: mockPerson.gym.id }
      });
      expect(fromClassSpy).toHaveBeenCalledTimes(2);
      expect(fromClassSpy).toHaveBeenCalledWith({});
      expect(okSpy).toHaveBeenCalledTimes(1);
      expect(okSpy).toHaveBeenCalledWith(mockRes, [{}, {}]);
    });

    it('should send forbidden if request is made by a client', async () => {
      const forbiddenSpy = jest
        .spyOn(TrainerTagFetchController, 'forbidden')
        .mockImplementation();

      setupServices();
      await TrainerTagFetchController.execute({} as any, mockClientRes as any);

      expect(forbiddenSpy).toHaveBeenCalledTimes(1);
      expect(forbiddenSpy).toHaveBeenCalledWith(
        mockClientRes,
        'User does not have permissions.'
      );
    });

    it('should send unauthorized if person does not exist', async () => {
      mockPersonService.findOne.mockResolvedValue(undefined);
      const unauthorizedSpy = jest
        .spyOn(TrainerTagFetchController, 'unauthorized')
        .mockImplementation();

      setupServices();
      await TrainerTagFetchController.execute({} as any, mockRes as any);

      expect(mockPersonService.findOne).toHaveBeenCalledTimes(1);
      expect(unauthorizedSpy).toHaveBeenCalledTimes(1);
      expect(unauthorizedSpy).toHaveBeenCalledWith(
        mockRes,
        'Person does not exist.'
      );
    });

    it('should call fail on personService error', async () => {
      mockPersonService.findOne.mockRejectedValue('error-thrown');

      setupServices();
      await TrainerTagFetchController.execute({} as any, mockRes as any);

      expect(mockPersonService.findOne).toHaveBeenCalledTimes(1);
      failAsserts(TrainerTagFetchController, 'fetch', mockRes, failSpy);
    });

    it('should call fail on service error', async () => {
      mockPersonService.findOne.mockResolvedValue(mockPerson);
      mockTagService.find.mockRejectedValue('error-thrown');

      setupServices();
      await TrainerTagFetchController.execute({} as any, mockRes as any);

      expect(mockPersonService.findOne).toHaveBeenCalledTimes(1);
      expect(mockTagService.find).toHaveBeenCalledTimes(1);
      failAsserts(TrainerTagFetchController, 'fetch', mockRes, failSpy);
    });
  });
});
