import { Gym } from '@gymman/shared/models/entities';
import * as jwt from 'jsonwebtoken';

import BaseController from '../Base';
import register from './register';

describe('run', () => {
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
    toClass: jest.fn().mockResolvedValue
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

  let jsonResSpy = null;

  const token = jwt.sign(
    { id: 1, email: 'test@user.com' },
    process.env.JWT_TOKEN || 'secret-token'
  );

  beforeEach(() => {
    jest.clearAllMocks();

    jsonResSpy = jest.spyOn(BaseController, 'jsonResponse');
  });

  describe('Successfull registrations', () => {
    let mockRes: any;
    let mockService: any;
    let jwtSpy: any;

    beforeAll(() => {
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
        owner: expect.anything()
      });
      expect(mockFromJson).toHaveBeenCalledWith({}, 'register');
      expect(mockFromClass).toHaveBeenCalledTimes(1);
      expect(jwtSpy).toHaveBeenCalledTimes(1);
      expect(jwtSpy).toHaveBeenCalledWith(
        { id: 1, email: 'test@user.com' },
        process.env.JWT_TOKEN || 'secret-token'
      );
      // Ensure cookie is set
      expect(mockRes.setHeader).toBeCalledWith(
        'Set-Cookie',
        `__gym-man-refresh__=${token}; HttpOnly`
      );
      // Check result
      expect(mockController.created).toHaveBeenCalledTimes(1);
    };

    it('should save the person and call created with the token and the person', async () => {
      await register(
        mockService,
        mockController,
        mockFromJson,
        mockFromClass,
        mockReq,
        mockRes
      );

      commonChecks();
      // Specific checks
      expect(mockFromClass).toHaveBeenCalledWith(mockPerson, expect.anything());
    });

    it('should save the person and call created with the token, the person and a Gym', async () => {
      await register(
        mockService,
        mockController,
        mockFromJson,
        mockFromClass,
        mockReq,
        mockRes
      );

      commonChecks();
      // Specific checks
      expect(mockFromClass).toHaveBeenCalledWith(mockPerson, expect.any(Gym));
    });
  });

  it('should thow a 400 on validate fromJson error', async () => {
    const mockService = { save: jest.fn() } as any;
    const mockFailFromJson = jest.fn().mockImplementation(() => {
      throw 'error-thrown';
    });
    jsonResSpy.mockImplementation();

    await register(
      mockService,
      mockController,
      mockFailFromJson,
      mockFromClass,
      mockReq,
      {} as any
    );

    expect(mockFailFromJson).toHaveBeenCalledTimes(1);
    expect(jsonResSpy).toHaveBeenCalledTimes(1);
    expect(jsonResSpy).toHaveBeenCalledWith({} as any, 400, 'error-thrown');
  });

  it('should send a fail on service error', async () => {
    const mockService = {
      save: jest.fn().mockRejectedValue(mockPerson)
    } as any;

    await register(
      mockService,
      mockController,
      mockFromJson,
      mockFromClass,
      mockReq,
      {} as any
    );

    expect(mockFromJson).toHaveBeenCalledTimes(1);
    expect(mockController.fail).toHaveBeenCalledTimes(1);
    expect(mockController.fail).toHaveBeenCalledWith(
      {} as any,
      'Internal server error. If the error persists, contact our team.'
    );
  });

  it('should send a fail if JWT_TOKEN not set', async () => {
    // Clear the JWT_SECRET value
    process.env.JWT_TOKEN = undefined;

    const mockService = {
      save: jest.fn().mockResolvedValue(mockPerson)
    } as any;

    await register(
      mockService,
      mockController,
      mockFromJson,
      mockFromClass,
      mockReq,
      {} as any
    );

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

    await register(
      mockService,
      mockController,
      mockFromJson,
      mockFromClass,
      mockReq,
      mockRes
    );

    expect(mockFromJson).toHaveBeenCalledTimes(1);
    expect(mockService.save).toHaveBeenCalledTimes(1);
    expect(signSpy).toHaveBeenCalledTimes(1);
    expect(mockController.fail).toHaveBeenCalledTimes(1);
    // Ensure cookie is set
    expect(mockRes.setHeader).toBeCalledWith(
      'Set-Cookie',
      `__gym-man-refresh__=${token}; HttpOnly`
    );
    // Then fail
    expect(mockController.created).toHaveBeenCalledTimes(1);
    expect(mockController.fail).toHaveBeenCalledWith(
      mockRes,
      'Internal server error. If the error persists, contact our team.'
    );
  });
});
