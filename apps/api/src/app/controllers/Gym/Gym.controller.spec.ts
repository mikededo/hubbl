import { DTOGroups, GymDTO } from '@hubbl/shared/models/dto';

import { GymService, OwnerService } from '../../services';
import * as update from '../helpers/update';
import { GymUpdateController } from './Gym.controller';

jest.mock('../../services');
jest.mock('npmlog');

describe('Gym controller', () => {
  const mockReq = { body: { id: 1 } };
  const mockRes = { locals: { token: { id: 2, user: 'owner' } } };

  describe('GymUpdateController', () => {
    const mockOwnerService = {
      count: jest.fn()
    };
    const failSpy = jest.spyOn(GymUpdateController, 'fail');

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should create the services if does not have any', () => {
      jest.spyOn(GymUpdateController, 'fail').mockImplementation();

      GymUpdateController['service'] = undefined;
      GymUpdateController['ownerService'] = undefined;

      GymUpdateController.execute({} as any, {} as any);

      expect(GymService).toHaveBeenCalledTimes(1);
      expect(OwnerService).toHaveBeenCalledTimes(1);
    });

    it('should call updatedByOwnerOrWorker if owns the gym', async () => {
      GymUpdateController['service'] = {} as any;
      GymUpdateController['ownerService'] = mockOwnerService as any;

      const fromJsonSpy = jest
        .spyOn(GymDTO, 'fromJson')
        .mockResolvedValue(mockReq.body as any);
      mockOwnerService.count.mockResolvedValue(1);
      const uboow = jest
        .spyOn(update, 'updatedByOwnerOrWorker')
        .mockImplementation();

      await GymUpdateController.execute(mockReq as any, mockRes as any);

      expect(fromJsonSpy).toHaveBeenCalledTimes(1);
      expect(fromJsonSpy).toHaveBeenCalledWith(mockReq.body, DTOGroups.UPDATE);
      expect(mockOwnerService.count).toHaveBeenCalledTimes(1);
      expect(mockOwnerService.count).toHaveBeenCalledWith({
        where: { person: { id: mockRes.locals.token.id }, gym: mockReq.body.id }
      });
      expect(uboow).toHaveBeenCalledTimes(1);
      expect(uboow).toHaveBeenCalledWith({
        service: {},
        ownerService: mockOwnerService,
        workerService: undefined,
        controller: GymUpdateController,
        res: mockRes,
        token: mockRes.locals.token,
        dto: mockReq.body,
        entityName: 'Gym',
        countArgs: { id: mockReq.body.id },
        workerUpdatePermission: undefined
      });
    });

    it('should call fail fromJson error', async () => {
      GymUpdateController['service'] = {} as any;
      GymUpdateController['ownerService'] = mockOwnerService as any;

      const fromJsonSpy = jest
        .spyOn(GymDTO, 'fromJson')
        .mockRejectedValue({} as any);

      await GymUpdateController.execute(mockReq as any, mockRes as any);

      expect(fromJsonSpy).toHaveBeenCalledTimes(1);
      expect(mockOwnerService.count).not.toHaveBeenCalled();
      expect(failSpy).toHaveBeenCalledTimes(1);
    });

    it('should call forbidden if the user does not own the gym', async () => {
      GymUpdateController['service'] = {} as any;
      GymUpdateController['ownerService'] = mockOwnerService as any;

      mockOwnerService.count.mockResolvedValue(0);
      const fromJsonSpy = jest
        .spyOn(GymDTO, 'fromJson')
        .mockResolvedValue(mockReq.body as any);
      const forbiddenSpy = jest
        .spyOn(GymUpdateController, 'forbidden')
        .mockImplementation();

      await GymUpdateController.execute(mockReq as any, mockRes as any);

      expect(fromJsonSpy).toHaveBeenCalledTimes(1);
      expect(mockOwnerService.count).toHaveBeenCalledTimes(1);
      expect(forbiddenSpy).toHaveBeenCalledTimes(1);
      expect(forbiddenSpy).toHaveBeenCalledWith(
        mockRes,
        'User does not own the gym.'
      );
    });

    it('should call fail ownerService error', async () => {
      GymUpdateController['service'] = {} as any;
      GymUpdateController['ownerService'] = mockOwnerService as any;

      mockOwnerService.count.mockRejectedValue({});
      const fromJsonSpy = jest
        .spyOn(GymDTO, 'fromJson')
        .mockResolvedValue(mockReq.body as any);

      await GymUpdateController.execute(mockReq as any, mockRes as any);

      expect(fromJsonSpy).toHaveBeenCalledTimes(1);
      expect(mockOwnerService.count).toHaveBeenCalledTimes(1);
      expect(failSpy).toHaveBeenCalledTimes(1);
    });

    it('should call fail updateByOwnerOrWorker error', async () => {
      GymUpdateController['service'] = {} as any;
      GymUpdateController['ownerService'] = mockOwnerService as any;

      const fromJsonSpy = jest
        .spyOn(GymDTO, 'fromJson')
        .mockResolvedValue(mockReq.body as any);
      mockOwnerService.count.mockResolvedValue(1);
      const uboow = jest
        .spyOn(update, 'updatedByOwnerOrWorker')
        .mockRejectedValue({} as any);

      await GymUpdateController.execute(mockReq as any, mockRes as any);

      expect(fromJsonSpy).toHaveBeenCalledTimes(1);
      expect(mockOwnerService.count).toHaveBeenCalledTimes(1);
      expect(failSpy).toHaveBeenCalledTimes(1);
      expect(uboow).toHaveBeenCalledTimes(1);
    });
  });
});
