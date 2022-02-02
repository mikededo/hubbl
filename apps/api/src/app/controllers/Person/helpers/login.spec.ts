import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

import { PersonDTOGroups } from '@hubbl/shared/models/dto';

import BaseController from '../../Base';
import * as logins from './login';
import * as log from 'npmlog';

jest.mock('bcrypt');

// Manually set the environment variable
process.env.NX_JWT_TOKEN = 'test-secret-token';

describe('login', () => {
  const mockController = {
    entityError: jest.fn(),
    created: jest.fn(),
    execute: jest.fn(),
    fail: jest.fn(),
    forbidden: jest.fn(),
    notFound: jest.fn(),
    ok: jest.fn(),
    run: jest.fn(),
    unauthorized: jest.fn()
  } as any;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    let mockService: any;
    const entityAlias = 'entity';
    const personAlias = 'person';
    const mockReq = { body: {} } as any;
    const mockRes = {
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
      setHeader: jest.fn()
    } as any;
    const mockEntity = {
      person: { id: 1, email: 'test@user.com', password: 'changeme00' },
      covidPassport: true
    };
    const mockDTO = {
      ...mockEntity.person,
      covidPassport: true,
      toClass: jest.fn().mockResolvedValue
    } as any;

    const mockFromJson = jest.fn().mockResolvedValue(mockDTO);
    const mockFromClass = jest.fn().mockReturnValue(mockDTO);

    const token = jwt.sign(
      { id: 1, email: 'test@user.com' },
      process.env.NX_JWT_TOKEN
    );

    let jsonResSpy: any;
    let logSpy: any;

    beforeEach(() => {
      jest.clearAllMocks();

      mockService = {
        createQueryBuilder: jest.fn().mockReturnThis(),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn()
      };

      jsonResSpy = jest.spyOn(BaseController, 'jsonResponse');
      logSpy = jest.spyOn(log, 'error').mockImplementation();
    });

    const queryAssertions = () => {
      expect(mockFromJson).toHaveBeenCalledTimes(1);
      expect(mockFromJson).toHaveBeenCalledWith({}, PersonDTOGroups.LOGIN);
      expect(mockService.createQueryBuilder).toHaveBeenCalledTimes(1);
      expect(mockService.createQueryBuilder).toHaveBeenCalledWith({
        alias: entityAlias
      });
      // Joined with person and gym
      expect(mockService.leftJoinAndSelect).toHaveBeenCalledTimes(2);
      expect(mockService.leftJoinAndSelect).toHaveBeenNthCalledWith(
        1,
        `${entityAlias}.person`,
        personAlias
      );
      // The second call has to be done with the person alias, since the entity
      // entity does not have a gym
      expect(mockService.leftJoinAndSelect).toHaveBeenNthCalledWith(
        2,
        `${personAlias}.gym`,
        'gym'
      );
      // Find by email
      expect(mockService.where).toHaveBeenCalledTimes(1);
      expect(mockService.where).toHaveBeenCalledWith(
        `${personAlias}.email = :email`,
        { email: mockDTO.email }
      );
      // Finally call getOne
      expect(mockService.getOne).toHaveBeenCalledTimes(1);
    };

    it('should sucessfully login a user', async () => {
      const compareSpy = jest
        .spyOn(bcrypt, 'compare')
        .mockImplementation(() => Promise.resolve(true));
      const signSpy = jest.spyOn(jwt, 'sign').mockReturnValue(token as any);

      mockService.getOne.mockReturnValue(mockEntity);

      await logins.login({
        service: mockService,
        controller: mockController,
        fromJson: mockFromJson,
        fromClass: mockFromClass,
        req: mockReq,
        res: mockRes,
        alias: entityAlias as any
      });

      queryAssertions();
      // Compare the passwords
      expect(compareSpy).toHaveBeenCalledTimes(1);
      expect(compareSpy).toHaveBeenCalledWith(
        mockDTO.password,
        mockEntity.person.password
      );
      // Finally return the instance
      expect(mockService.where).toHaveReturnedTimes(1);
      // Token creation
      expect(signSpy).toHaveBeenCalledTimes(1);
      expect(signSpy).toHaveBeenCalledWith(
        { id: 1, email: 'test@user.com', user: entityAlias },
        process.env.NX_JWT_TOKEN,
        { expiresIn: '15m' }
      );
      // Ensure cookie is set
      expect(mockRes.setHeader).toBeCalledWith(
        'Set-Cookie',
        `__hubbl-refresh__=${token}; HttpOnly`
      );
      // Check result
      expect(mockController.ok).toHaveBeenCalledTimes(1);
      expect(mockController.ok).toHaveBeenCalledWith(mockRes, {
        token,
        [entityAlias]: mockDTO
      });
    });

    it('should fail if entity not found', async () => {
      mockService.getOne.mockResolvedValue(undefined);

      await logins.login({
        service: mockService,
        controller: mockController,
        fromJson: mockFromJson,
        fromClass: mockFromClass,
        req: mockReq,
        res: mockRes,
        alias: entityAlias as any
      });

      queryAssertions();
      // Should call fail with email not found, as search should be done by email
      expect(mockController.fail).toHaveBeenCalledTimes(1);
      expect(mockController.fail).toHaveBeenCalledWith(
        mockRes,
        'Email not found'
      );
    });

    it('should fail if entity password is incorrect', async () => {
      mockService.getOne.mockResolvedValue(mockEntity);
      const compareSpy = jest
        .spyOn(bcrypt, 'compare')
        .mockImplementation(() => Promise.resolve(false));

      await logins.login({
        service: mockService,
        controller: mockController,
        fromJson: mockFromJson,
        fromClass: mockFromClass,
        req: mockReq,
        res: mockRes,
        alias: entityAlias as any
      });

      queryAssertions();
      expect(compareSpy).toHaveBeenCalledTimes(1);
      expect(compareSpy).toHaveBeenCalledWith(
        mockDTO.password,
        mockEntity.person.password
      );
      // Should call unauthorized if the passwords do not match
      expect(mockController.unauthorized).toHaveBeenCalledTimes(1);
      expect(mockController.unauthorized).toHaveBeenCalledWith(
        mockRes,
        'Passwords do not match'
      );
    });

    it('should throw a 400 code on fromJson validation error', async () => {
      const mockFailFromJson = jest.fn().mockImplementation(() => {
        throw 'error-thrown';
      });

      jsonResSpy.mockImplementation();

      await logins.login({
        service: mockService,
        controller: mockController,
        fromJson: mockFailFromJson,
        fromClass: mockFromClass,
        req: mockReq,
        res: {} as any,
        alias: entityAlias as any
      });

      expect(mockFailFromJson).toHaveBeenCalledTimes(1);
      expect(jsonResSpy).toHaveBeenCalledTimes(1);
      expect(jsonResSpy).toHaveBeenCalledWith({} as any, 400, 'error-thrown');
    });

    it('should send a fail on service error', async () => {
      mockService.getOne.mockRejectedValue({});

      await logins.login({
        service: mockService,
        controller: mockController,
        fromClass: mockFromClass,
        fromJson: mockFromJson,
        req: mockReq,
        res: {} as any,
        alias: entityAlias as any
      });

      expect(mockService.getOne).toHaveBeenCalledTimes(1);
      expect(logSpy).toHaveBeenCalledTimes(1);
      expect(logSpy).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(String),
        expect.any(String)
      );
      expect(mockController.fail).toHaveBeenCalledTimes(1);
      expect(mockController.fail).toHaveBeenCalledWith(
        {} as any,
        'Internal server error. If the error persists, contact our team.'
      );
    });

    it('should send a fail if NX_JWT_TOKEN is not set', async () => {
      delete process.env.NX_JWT_TOKEN;

      const compareSpy = jest
        .spyOn(bcrypt, 'compare')
        .mockImplementation(() => Promise.resolve(true));
      mockService.getOne.mockReturnValue(mockEntity);

      await logins.login({
        service: mockService,
        controller: mockController,
        fromJson: mockFromJson,
        fromClass: mockFromClass,
        req: mockReq,
        res: {} as any,
        alias: entityAlias as any
      });

      queryAssertions();
      expect(compareSpy).toHaveBeenCalledTimes(1);
      expect(logSpy).toHaveBeenCalledTimes(1);
      expect(logSpy).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(String),
        expect.any(String)
      );
      expect(mockController.fail).toHaveBeenCalledTimes(1);
      expect(mockController.fail).toHaveBeenCalledWith(
        {} as any,
        'Internal server error. If the error persists, contact our team.'
      );
    });

    it('should send a fail on ok error', async () => {
      const compareSpy = jest
        .spyOn(bcrypt, 'compare')
        .mockImplementation(() => Promise.resolve(true));
      const signSpy = jest.spyOn(jwt, 'sign').mockReturnValue(token as any);
      mockService.getOne.mockReturnValue(mockEntity);
      mockController.ok.mockImplementation(() => {
        throw new Error();
      });

      await logins.login({
        service: mockService,
        controller: mockController,
        fromJson: mockFromJson,
        fromClass: mockFromClass,
        req: mockReq,
        res: mockRes,
        alias: entityAlias as any
      });

      queryAssertions();
      expect(compareSpy).toHaveBeenCalledTimes(1);
      expect(signSpy).toHaveBeenCalledTimes(1);
      // Ensure cookie is set
      expect(mockRes.setHeader).toBeCalledWith(
        'Set-Cookie',
        `__hubbl-refresh__=${token}; HttpOnly`
      );
      // Then fail
      expect(mockController.ok).toHaveBeenCalledTimes(1);
      expect(logSpy).toHaveBeenCalledTimes(1);
      expect(logSpy).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(String),
        expect.any(String)
      );
      expect(mockController.fail).toHaveBeenCalledWith(
        mockRes,
        'Internal server error. If the error persists, contact our team.'
      );
    });
  });

  describe('ownerLogin', () => {
    it('should call login with owner', async () => {
      const loginSpy = jest.spyOn(logins, 'login').mockImplementation();

      await logins.ownerLogin({
        service: {} as any,
        controller: {} as any,
        fromJson: {} as any,
        fromClass: {} as any,
        req: {} as any,
        res: {} as any
      });

      expect(loginSpy).toHaveBeenCalledTimes(1);
      expect(loginSpy).toHaveBeenCalledWith({
        service: {},
        controller: {},
        fromJson: {},
        fromClass: {},
        req: {},
        res: {},
        alias: 'owner'
      });
    });
  });

  describe('workerLogin', () => {
    it('should call login with worker', async () => {
      const loginSpy = jest.spyOn(logins, 'login');

      await logins.workerLogin({
        service: {} as any,
        controller: {} as any,
        fromJson: {} as any,
        fromClass: {} as any,
        req: {} as any,
        res: {} as any
      });

      expect(loginSpy).toHaveBeenCalledTimes(1);
      expect(loginSpy).toHaveBeenCalledWith({
        service: {},
        controller: {},
        fromJson: {},
        fromClass: {},
        req: {},
        res: {},
        alias: 'worker'
      });
    });
  });

  describe('clientLogin', () => {
    it('should call login with client', async () => {
      const loginSpy = jest.spyOn(logins, 'login').mockImplementation();

      await logins.clientLogin({
        service: {} as any,
        controller: {} as any,
        fromJson: {} as any,
        fromClass: {} as any,
        req: {} as any,
        res: {} as any
      });

      expect(loginSpy).toHaveBeenCalledTimes(1);
      expect(loginSpy).toHaveBeenCalledWith({
        service: {},
        controller: {},
        fromJson: {},
        fromClass: {},
        req: {},
        res: {},
        alias: 'client'
      });
    });
  });
});
