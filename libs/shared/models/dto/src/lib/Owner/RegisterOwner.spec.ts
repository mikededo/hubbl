import { compare } from 'bcrypt';
import * as ClassValidator from 'class-validator';

import { Gender } from '@gymman/shared/types';

import * as Util from '../util';
import RegisterOwnerDTO from './RegisterOwner';

describe('RegisterOwnerDTO', () => {
  describe('#fromJSON', () => {
    it('should not fail on creating a correct DTO', async () => {
      const vorSpy = jest.spyOn(ClassValidator, 'validateOrReject');
      const json = {
        email: 'test@user.com',
        password: 'testpwd00',
        firstName: 'Test',
        lastName: 'User',
        gymId: 1,
        gender: Gender.OTHER
      };

      const result = await RegisterOwnerDTO.fromJson(json);

      expect(result).toBeDefined();
      expect(result).toBeInstanceOf(RegisterOwnerDTO);
      // Check fields
      expect(result.email).toBe('test@user.com');
      expect(result.password).toBe('testpwd00');
      expect(result.firstName).toBe('Test');
      expect(result.lastName).toBe('User');
      expect(result.gymId).toBe(1);
      expect(result.gender).toBe(Gender.OTHER);
      // Ensure class is validated
      expect(vorSpy).toHaveBeenCalledTimes(1);
    });

    it('should fail on creating an incorrect DTO', async () => {
      const vorSpy = jest.spyOn(ClassValidator, 'validateOrReject');
      const vpSpy = jest.spyOn(Util, 'validationParser');

      expect.assertions(3);

      try {
        await RegisterOwnerDTO.fromJson({});
      } catch (e) {
        expect(e).toBeDefined();
      }

      expect(vorSpy).toHaveBeenCalledTimes(1);
      expect(vpSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('#toClass', () => {
    it('should return an owner', async () => {
      // Set up class
      const dto = new RegisterOwnerDTO();
      dto.email = 'test@user.com';
      dto.password = 'testpwd00';
      dto.firstName = 'Test';
      dto.lastName = 'User';
      dto.gymId = 1;
      dto.gender = Gender.OTHER;

      const result = await dto.toClass();

      expect(result.person.email).toBe('test@user.com');
      expect(result.person.firstName).toBe('Test');
      expect(result.person.lastName).toBe('User');
      expect(result.person.gym).toBe(1);
      expect(result.person.gender).toBe(Gender.OTHER);
      // Password should be hashed
      expect(await compare('testpwd00', result.person.password)).toBeTruthy();
    });
  });
});
