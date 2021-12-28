import { compare, genSalt, hash } from 'bcrypt';
import * as ClassValidator from 'class-validator';

import { Client, Gym, Person } from '@gymman/shared/models/entities';
import { AppTheme, Gender } from '@gymman/shared/types';

import * as Util from '../util';
import ClientDTO from './Client';

describe('ClientDTO', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('#fromJSON', () => {
    it('should create the DTO if fromJson is valid', async () => {
      const vorSpy = jest.spyOn(ClassValidator, 'validateOrReject');
      const json = {
        id: 1,
        email: 'test@user.com',
        password: 'testpwd00',
        firstName: 'Test',
        lastName: 'User',
        gym: 1,
        gender: Gender.OTHER,
        theme: AppTheme.LIGHT,
        covidPassport: true
      };

      const result = await ClientDTO.fromJson(json, 'any' as any);

      expect(result).toBeDefined();
      expect(result).toBeInstanceOf(ClientDTO);
      // Check fields
      expect(result.id).toBe(json.id);
      expect(result.email).toBe(json.email);
      expect(result.password).toBe(json.password);
      expect(result.firstName).toBe(json.firstName);
      expect(result.lastName).toBe(json.lastName);
      expect(result.gender).toBe(json.gender);
      expect(result.theme).toBe(json.theme);
      expect(result.gym).toBe(json.gym);
      // Client fields
      expect(result.covidPassport).toBe(json.covidPassport);
      // Ensure class is validated
      expect(vorSpy).toHaveBeenCalledTimes(1);
      expect(vorSpy).toHaveBeenCalledWith(expect.anything(), {
        validationError: { target: false },
        groups: ['any']
      });
    });

    it('should not create the DTO is fromJson is not valid', async () => {
      const vorSpy = jest
        .spyOn(ClassValidator, 'validateOrReject')
        .mockRejectedValue({});
      const vpSpy = jest
        .spyOn(Util, 'validationParser')
        .mockReturnValue({} as any);

      expect.assertions(3);

      try {
        await ClientDTO.fromJson({}, 'any' as any);
      } catch (e) {
        expect(e).toBeDefined();
      }

      expect(vorSpy).toHaveBeenCalledTimes(1);
      expect(vpSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('#fromClass', () => {
    it('should create a ClientDTO from a correct Client', async () => {
      const vorSpy = jest
        .spyOn(ClassValidator, 'validateOrReject')
        .mockResolvedValue();
      const password = await hash('testpwd00', await genSalt(10));

      const client = new Client();
      const person = new Person();
      person.id = 1;
      person.email = 'test@user.com';
      person.password = password;
      person.firstName = 'Test';
      person.lastName = 'User';
      person.gender = Gender.OTHER;
      person.theme = AppTheme.LIGHT;
      person.gym = new Gym();
      client.person = person;

      client.covidPassport = true;

      const result = await ClientDTO.fromClass(client);

      expect(result.id).toBe(client.person.id);
      expect(result.email).toBe(client.person.email);
      expect(result.password).toBe(client.person.password);
      expect(result.firstName).toBe(client.person.firstName);
      expect(result.lastName).toBe(client.person.lastName);
      expect(result.theme).toBe(client.person.theme);
      expect(result.gender).toBe(client.person.gender);
      expect(result.gym).toStrictEqual(client.person.gym);
      // Client props
      expect(result.covidPassport).toBe(client.covidPassport);
      // Ensure validation has been called
      expect(vorSpy).toHaveBeenCalledTimes(1);
    });

    it('should fail on creating an ClientDTO from an incorrect Client', async () => {
      const vorSpy = jest
        .spyOn(ClassValidator, 'validateOrReject')
        .mockRejectedValue({});
      const vpSpy = jest.spyOn(Util, 'validationParser').mockReturnValue({});

      expect.assertions(3);

      try {
        await ClientDTO.fromClass({ person: {} } as any);
      } catch (e) {
        expect(e).toBeDefined();
      }

      expect(vorSpy).toHaveBeenCalledTimes(1);
      expect(vpSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('#toClass', () => {
    it('should return an client', async () => {
      // Set up class
      const dto = new ClientDTO();
      dto.id = 1;
      dto.email = 'test@user.com';
      dto.password = 'testpwd00';
      dto.firstName = 'Test';
      dto.lastName = 'User';
      dto.gym = 1;
      dto.gender = Gender.OTHER;
      dto.theme = AppTheme.LIGHT;
      dto.covidPassport = true;

      const result = await dto.toClass();

      expect(result.person.id).toBe(dto.id);
      expect(result.person.email).toBe(dto.email);
      expect(result.person.firstName).toBe(dto.firstName);
      expect(result.person.lastName).toBe(dto.lastName);
      expect(result.person.gym).toBe(dto.gym);
      expect(result.person.gender).toBe(dto.gender);
      expect(result.person.theme).toBe(dto.theme);
      expect(result.covidPassport).toBe(dto.covidPassport);

      // Password should be hashed
      expect(await compare('testpwd00', result.person.password)).toBeTruthy();
    });
  });
});
