import { compare, genSalt, hash } from 'bcrypt';
import * as ClassValidator from 'class-validator';

import { Gym, Person, Client } from '@gymman/shared/models/entities';
import { AppTheme, Gender } from '@gymman/shared/types';

import { PersonDTOVariants } from '../Person';
import * as Util from '../util';
import ClientDTO from './Client';

describe('ClientDTO', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('#fromJSON', () => {
    const successFromJSON = async (
      variant: PersonDTOVariants,
      gym: Gym | number
    ) => {
      const vorSpy = jest.spyOn(ClassValidator, 'validateOrReject');
      const json = {
        email: 'test@user.com',
        password: 'testpwd00',
        firstName: 'Test',
        lastName: 'User',
        gym,
        gender: Gender.OTHER,
        covidPassport: true
      };

      const result = await ClientDTO.fromJson<number>(json, variant);

      expect(result).toBeDefined();
      expect(result).toBeInstanceOf(ClientDTO);
      // Check fields
      expect(result.email).toBe(json.email);
      expect(result.password).toBe(json.password);
      expect(result.firstName).toBe(json.firstName);
      expect(result.lastName).toBe(json.lastName);
      expect(result.gender).toBe(json.gender);
      expect(result.gym).toBe(gym);
      // Client fields
      expect(result.covidPassport).toBe(json.covidPassport);
      // Ensure class is validated
      expect(vorSpy).toHaveBeenCalledTimes(1);
      expect(vorSpy).toHaveBeenCalledWith(expect.anything(), {
        validationError: { target: false },
        groups: [variant]
      });
    };

    const failFromJSON = async (variant: PersonDTOVariants) => {
      const vorSpy = jest.spyOn(ClassValidator, 'validateOrReject');
      const vpSpy = jest.spyOn(Util, 'validationParser');

      expect.assertions(3);

      try {
        await ClientDTO.fromJson({}, variant);
      } catch (e) {
        expect(e).toBeDefined();
      }

      expect(vorSpy).toHaveBeenCalledTimes(1);
      expect(vpSpy).toHaveBeenCalledTimes(1);
    };

    it('[login, number] should not fail on creating a correct DTO', async () => {
      await successFromJSON(PersonDTOVariants.LOGIN, 1);
    });

    it('[login, gym] should not fail on creating a correct DTO', async () => {
      await successFromJSON(PersonDTOVariants.LOGIN, new Gym());
    });

    it('[register, number] should not fail on creating a correct DTO', async () => {
      await successFromJSON(PersonDTOVariants.REGISTER, 1);
    });

    it('[register, gym] should not fail on creating a correct DTO', async () => {
      await successFromJSON(PersonDTOVariants.REGISTER, new Gym());
    });

    it('[register] should fail on creating an incorrect DTO', async () => {
      await failFromJSON(PersonDTOVariants.REGISTER);
    });

    it('[login] should fail on creating an incorrect DTO', async () => {
      await failFromJSON(PersonDTOVariants.LOGIN);
    });
  });

  describe('#fromClass', () => {
    it('should create an ClientDTO<Gym> from a correct Client', async () => {
      const vorSpy = jest.spyOn(ClassValidator, 'validateOrReject');
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

      const result = await ClientDTO.fromClass(client, new Gym());

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

    it('should fail on creating an ClientDTO<Gym> from an incorrect Client', async () => {
      const vorSpy = jest.spyOn(ClassValidator, 'validateOrReject');
      const vpSpy = jest.spyOn(Util, 'validationParser');

      expect.assertions(3);

      try {
        await ClientDTO.fromClass({ person: {} } as any, {} as any);
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
      dto.email = 'test@user.com';
      dto.password = 'testpwd00';
      dto.firstName = 'Test';
      dto.lastName = 'User';
      dto.gym = 1;
      dto.gender = Gender.OTHER;
      dto.covidPassport = true;

      const result = await dto.toClass();

      expect(result.person.email).toBe(dto.email);
      expect(result.person.firstName).toBe(dto.firstName);
      expect(result.person.lastName).toBe(dto.lastName);
      expect(result.person.gym).toBe(dto.gym);
      expect(result.person.gender).toBe(dto.gender);
      expect(result.covidPassport).toBe(dto.covidPassport);

      // Password should be hashed
      expect(await compare('testpwd00', result.person.password)).toBeTruthy();
    });
  });
});
