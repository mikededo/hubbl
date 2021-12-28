import * as jwt from 'jsonwebtoken';

import { PersonDTOGroups } from '@gymman/shared/models/dto';

import BaseController from '../../Base';
import { register, trainerRegister } from './register';

// Manually set the environment variable
process.env.NX_JWT_TOKEN = 'test-secret-token';

describe('register', () => {
  const mockReq = { body: {} } as any;
  const mockPerson = {
    person: {
      id: 1,
      email: 'test@user.com',
      password: '123456'
    }
  } as any;
  const mockDTO = {
    ...mockPerson.person,
    toClass: jest.fn()
  } as any;

  const mockFromJson = jest.fn().mockResolvedValue(mockDTO);
  const mockFromClass = jest.fn().mockResolvedValue(mockDTO);
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
    { id: 1, email: 'test@user.com' },
    process.env.NX_JWT_TOKEN || 'test-secret-token'
  );

  /* HELPERS */

  const fromJsonFail = async (fromJson: any, cb: () => Promise<void>) => {
    await cb();

    expect(fromJson).toHaveBeenCalledTimes(1);
    expect(jsonResSpy).toHaveBeenCalledTimes(1);
    expect(jsonResSpy).toHaveBeenCalledWith({} as any, 400, 'error-thrown');
  };

  const serviceError = async (cb: () => Promise<void>) => {
    jsonResSpy.mockImplementation();

    await cb();

    expect(mockFromJson).toHaveBeenCalledTimes(1);
    expect(mockFromJson).toHaveReturned();
    expect(mockController.fail).toHaveBeenCalledTimes(1);
    expect(mockController.fail).toHaveBeenCalledWith(
      {} as any,
      'Internal server error. If the error persists, contact our team.'
    );
  };

  const createdError = async (
    fromJson: any,
    res: any,
    cb: () => Promise<void>
  ) => {
    mockController.created.mockImplementation(() => {
      throw new Error();
    });

    await cb();

    expect(fromJson).toHaveBeenCalledTimes(1);
    expect(fromJson).toHaveReturned();
    expect(mockDTO.toClass).toHaveBeenCalledTimes(1);
    expect(mockController.created).toHaveBeenCalledTimes(1);
    expect(mockController.fail).toHaveBeenCalledTimes(1);
    expect(mockController.fail).toHaveBeenCalledWith(
      res,
      'Internal server error. If the error persists, contact our team.'
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();

    jsonResSpy = jest.spyOn(BaseController, 'jsonResponse');
  });

  describe('register', () => {
    describe('Successfull registrations', () => {
      let mockRes: any;
      let mockService: any;
      let jwtSpy: any;

      beforeEach(() => {
        mockRes = {
          json: jest.fn().mockReturnThis(),
          status: jest.fn().mockReturnThis(),
          setHeader: jest.fn()
        } as any;
        mockService = {
          save: jest.fn().mockResolvedValue(mockPerson)
        } as any;
        jwtSpy = jest.spyOn(jwt, 'sign').mockReturnValue(token as any);
      });

      const commonChecks = () => {
        // Check spies
        expect(mockService.save).toHaveBeenCalledTimes(1);
        expect(mockController.created).toHaveBeenCalledTimes(1);
        expect(mockController.created).toHaveBeenCalledWith(mockRes, {
          token,
          any: expect.anything()
        });
        expect(mockFromJson).toHaveBeenCalledWith({}, 'register');
        expect(mockFromClass).toHaveBeenCalledTimes(1);
        expect(jwtSpy).toHaveBeenCalledTimes(1);
        expect(jwtSpy).toHaveBeenCalledWith(
          { id: 1, email: 'test@user.com' },
          process.env.NX_JWT_TOKEN,
          { expiresIn: '10m' }
        );
        // Ensure cookie is set
        expect(mockRes.setHeader).toBeCalledWith(
          'Set-Cookie',
          `__gym-man-refresh__=${token}; HttpOnly`
        );
        // Check result
        expect(mockController.created).toHaveBeenCalledTimes(1);
        // Should return the DTO with the token
        expect(mockController.created).toHaveBeenCalledWith(mockRes, {
          token,
          any: mockDTO
        });
      };

      it('should save the person and call created with the token and the person', async () => {
        await register({
          service: mockService,
          controller: mockController,
          fromJson: mockFromJson,
          fromClass: mockFromClass,
          req: mockReq,
          res: mockRes,
          returnName: 'any'
        });

        commonChecks();
        // Specific checks
        expect(mockFromClass).toHaveBeenCalledWith(mockPerson);
      });

      it('should save the person and call created with the token, the person and a Gym', async () => {
        await register({
          service: mockService,
          controller: mockController,
          fromJson: mockFromJson,
          fromClass: mockFromClass,
          req: mockReq,
          res: mockRes,
          returnName: 'any'
        });

        commonChecks();
        // Specific checks
        expect(mockFromClass).toHaveBeenCalledWith(mockPerson);
      });
    });

    it('should send a 400 code on fromJson validation error', async () => {
      jsonResSpy.mockImplementation();
      const mockService = { save: jest.fn() } as any;
      const mockFailFromJson = jest.fn().mockImplementation(() => {
        throw 'error-thrown';
      });

      await fromJsonFail(mockFailFromJson, async () => {
        await register({
          service: mockService,
          controller: mockController,
          fromJson: mockFailFromJson,
          fromClass: mockFromClass,
          req: mockReq,
          res: {} as any,
          returnName: 'any'
        });
      });
    });

    it('should send a fail on service error', async () => {
      const mockService = {
        save: jest.fn().mockRejectedValue(mockPerson)
      } as any;

      serviceError(async () => {
        await await register({
          service: mockService,
          controller: mockController,
          fromJson: mockFromJson,
          fromClass: mockFromClass,
          req: mockReq,
          res: {} as any,
          returnName: 'any'
        });
      });
    });

    it('should send a fail if NX_JWT_TOKEN is not set', async () => {
      delete process.env.NX_JWT_TOKEN;

      const mockService = {
        save: jest.fn().mockResolvedValue(mockPerson)
      } as any;

      await register({
        service: mockService,
        controller: mockController,
        fromJson: mockFromJson,
        fromClass: mockFromClass,
        req: mockReq,
        res: {} as any,
        returnName: 'any'
      });

      expect(mockFromJson).toHaveBeenCalledTimes(1);
      expect(mockService.save).toHaveBeenCalledTimes(1);
      expect(mockController.fail).toHaveBeenCalledTimes(1);
      expect(mockController.fail).toHaveBeenCalledWith(
        {} as any,
        'Internal server error. If the error persists, contact our team.'
      );
    });

    it('should send a fail on created error', async () => {
      const mockRes = { setHeader: jest.fn() } as any;

      const mockService = {
        save: jest.fn().mockResolvedValue(mockPerson)
      } as any;
      const signSpy = jest.spyOn(jwt, 'sign').mockReturnValue(token as any);

      mockController.created.mockImplementation(() => {
        throw new Error();
      });

      await createdError(mockFromJson, mockRes, async () => {
        await register({
          service: mockService,
          controller: mockController,
          fromJson: mockFromJson,
          fromClass: mockFromClass,
          req: mockReq,
          res: mockRes,
          returnName: 'any'
        });
      });

      expect(signSpy).toHaveBeenCalledTimes(1);
      // Ensure cookie is set
      expect(mockRes.setHeader).toBeCalledWith(
        'Set-Cookie',
        `__gym-man-refresh__=${token}; HttpOnly`
      );
    });
  });

  describe('trainerRegister', () => {
    it('should save a trainer', async () => {
      const mockRes = {
        json: jest.fn().mockReturnThis(),
        status: jest.fn().mockReturnThis(),
        setHeader: jest.fn()
      } as any;
      const mockService = {
        save: jest.fn().mockResolvedValue(mockPerson)
      } as any;
      mockDTO.toClass.mockResolvedValue(mockPerson);

      await trainerRegister({
        service: mockService,
        controller: mockController,
        fromJson: mockFromJson,
        fromClass: mockFromClass,
        req: mockReq,
        res: mockRes
      });

      expect(mockFromJson).toHaveBeenCalledTimes(1);
      expect(mockFromJson).toHaveBeenCalledWith({}, PersonDTOGroups.REGISTER);
      expect(mockDTO.toClass).toHaveBeenCalledTimes(1);
      expect(mockService.save).toHaveBeenCalledTimes(1);
      expect(mockService.save).toHaveBeenCalledWith(mockPerson);
      expect(mockController.created).toHaveBeenCalledTimes(1);
      expect(mockController.created).toHaveBeenCalledWith(mockRes, {
        trainer: mockDTO
      });
    });

    it('should send a 400 code on fromJson validation error', async () => {
      const mockService = {
        save: jest.fn().mockRejectedValue(mockPerson)
      } as any;
      const mockFailFromJson = jest.fn().mockImplementation(() => {
        throw 'error-thrown';
      });

      await fromJsonFail(mockFailFromJson, async () => {
        await trainerRegister({
          service: mockService,
          controller: mockController,
          fromJson: mockFailFromJson,
          fromClass: mockFromClass,
          req: mockReq,
          res: {} as any
        });
      });
    });

    it('should send a fail on service error', async () => {
      const mockService = {
        save: jest.fn().mockRejectedValue(mockPerson)
      } as any;

      await serviceError(async () => {
        await trainerRegister({
          service: mockService,
          controller: mockController,
          fromJson: mockFromJson,
          fromClass: mockFromClass,
          req: mockReq,
          res: {} as any
        });
      });
    });

    it('should send a fail on created error', async () => {
      const mockService = {
        save: jest.fn().mockResolvedValue(mockPerson)
      } as any;

      await createdError(mockFromJson, {}, async () => {
        await trainerRegister({
          service: mockService,
          controller: mockController,
          fromJson: mockFromJson,
          fromClass: mockFromClass,
          req: mockReq,
          res: {} as any
        });
      });
    });
  });
});
