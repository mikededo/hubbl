import { compare, genSalt, hash } from 'bcrypt';
import * as ClassValidator from 'class-validator';

import { Client, Gym } from '@hubbl/shared/models/entities';
import * as helpers from '@hubbl/shared/models/helpers';

import GymDTO from '../Gym';
import * as Util from '../util';
import ClientDTO from './Client';

jest.mock('@hubbl/shared/models/helpers');

describe('ClientDTO', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('#fromJSON', () => {
    it('should create the DTO if fromJson is valid', async () => {
      const vorSpy = jest.spyOn(ClassValidator, 'validateOrReject');
      const json = Util.createPersonJson({ covidPassport: true });

      const result = await ClientDTO.fromJson(json, 'any' as any);

      expect(result).toBeDefined();
      expect(result).toBeInstanceOf(ClientDTO);
      // Check fields
      expect(result.id).toBe(json.id);
      expect(result.email).toBe(json.email);
      expect(result.password).toBe(json.password);
      expect(result.firstName).toBe(json.firstName);
      expect(result.lastName).toBe(json.lastName);
      expect(result.phone).toBe(json.phone);
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
        .spyOn(helpers, 'validationParser')
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
      const password = await hash('testpwd00', await genSalt(10));

      const client = new Client();
      const person = Util.createPerson(password);

      client.person = person;
      client.covidPassport = true;

      const gymFromClass = jest.spyOn(GymDTO, 'fromClass').mockReturnValue({
        ...(person.gym as Gym),
        toClass: jest.fn().mockReturnValue(person.gym)
      });

      const result = ClientDTO.fromClass(client);

      expect(gymFromClass).toHaveBeenCalledTimes(1);
      expect(gymFromClass).toHaveBeenCalledWith(person.gym);
      expect(result.id).toBe(client.person.id);
      expect(result.email).toBe(client.person.email);
      expect(result.password).toBe(client.person.password);
      expect(result.firstName).toBe(client.person.firstName);
      expect(result.lastName).toBe(client.person.lastName);
      expect(result.phone).toBe(client.person.phone);
      expect(result.theme).toBe(client.person.theme);
      expect(result.gender).toBe(client.person.gender);
      expect(result.gym).toStrictEqual(client.person.gym);
      // Client props
      expect(result.covidPassport).toBe(client.covidPassport);
    });
  });

  describe('#toClass', () => {
    it('should return an client', async () => {
      // Set up class
      const dto = Util.createPersonDTO<ClientDTO<Gym | number>>(ClientDTO);

      dto.covidPassport = true;

      const result = await dto.toClass();

      expect(result.person.id).toBe(dto.id);
      expect(result.person.email).toBe(dto.email);
      expect(result.person.firstName).toBe(dto.firstName);
      expect(result.person.lastName).toBe(dto.lastName);
      expect(result.person.phone).toBe(dto.phone);
      expect(result.person.gym).toBe(dto.gym);
      expect(result.person.gender).toBe(dto.gender);
      expect(result.person.theme).toBe(dto.theme);
      expect(result.personId).toBe(dto.id);
      expect(result.covidPassport).toBe(dto.covidPassport);

      // Password should be hashed
      expect(await compare('testpwd00', result.person.password)).toBeTruthy();
    });
  });
});
