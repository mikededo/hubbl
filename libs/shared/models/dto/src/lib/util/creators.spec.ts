import { Gym, Person } from '@gymman/shared/models/entities';

import PersonDTO from '../Person';
import * as creators from './creators';

class MockDTO extends PersonDTO<any> {}

describe('creators', () => {
  describe('createPersonJson', () => {
    it('should create the base person json', () => {
      const result = creators.createPersonJson();

      expect(result.id).toBeDefined();
      expect(result.email).toBeDefined();
      expect(result.password).toBeDefined();
      expect(result.firstName).toBeDefined();
      expect(result.lastName).toBeDefined();
      expect(result.theme).toBeDefined();
      expect(result.gym).toBeDefined();
      expect(result.gender).toBeDefined();
    });

    it('should create the base person json with the given props', () => {
      const result = creators.createPersonJson({ another: 'prop' });

      expect(result.id).toBeDefined();
      expect(result.email).toBeDefined();
      expect(result.password).toBeDefined();
      expect(result.firstName).toBeDefined();
      expect(result.lastName).toBeDefined();
      expect(result.theme).toBeDefined();
      expect(result.gym).toBeDefined();
      expect(result.gender).toBeDefined();
      expect(result.another).toBe('prop');
    });
  });

  describe('createGym', () => {
    it('should create a gym', () => {
      const result = creators.createGym();

      expect(result).toBeInstanceOf(Gym);
      expect(result.id).toBeDefined();
      expect(result.name).toBeDefined();
      expect(result.email).toBeDefined();
      expect(result.phone).toBeDefined();
      expect(result.color).toBeDefined();
      expect(result.virtualGyms).toBeDefined();
    });
  });

  describe('createPerson', () => {
    let createGymSpy: any;

    beforeEach(() => {
      jest.clearAllMocks();
      createGymSpy = jest
        .spyOn(creators, 'createGym')
        .mockReturnValue({} as any);
    });

    it('should create a base person', () => {
      const result = creators.createPerson();

      expect(result).toBeInstanceOf(Person);
      expect(result.id).toBeDefined();
      expect(result.email).toBeDefined();
      expect(result.password).toBeDefined();
      expect(result.firstName).toBeDefined();
      expect(result.lastName).toBeDefined();
      expect(result.gender).toBeDefined();
      expect(result.theme).toBeDefined();
      expect(result.gym).toBeDefined();
      // Should call createGym
      expect(createGymSpy).toHaveBeenCalled();
    });

    it('should create a base person with the given password', () => {
      const result = creators.createPerson('any-password');

      expect(result).toBeInstanceOf(Person);
      expect(result.id).toBeDefined();
      expect(result.email).toBeDefined();
      expect(result.password).toBeDefined();
      expect(result.password).toBe('any-password');
      expect(result.firstName).toBeDefined();
      expect(result.lastName).toBeDefined();
      expect(result.gender).toBeDefined();
      expect(result.theme).toBeDefined();
      expect(result.gym).toBeDefined();
      // Should call createGym
      expect(createGymSpy).toHaveBeenCalled();
    });
  });

  describe('createPerson', () => {
    const result = creators.createPersonDTO<MockDTO>(MockDTO);

    expect(result).toBeInstanceOf(MockDTO);
    expect(result.id).toBeDefined();
    expect(result.email).toBeDefined();
    expect(result.password).toBeDefined();
    expect(result.firstName).toBeDefined();
    expect(result.lastName).toBeDefined();
    expect(result.gym).toBeDefined();
    expect(result.gender).toBeDefined();
    expect(result.theme).toBeDefined();
  });
});
