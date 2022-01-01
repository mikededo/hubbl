import { Gym, Person } from '@hubbl/shared/models/entities';
import { AppTheme, Gender, ThemeColor } from '@hubbl/shared/types';

import PersonDTO from '../Person';

export const createPersonJson = (otherProps: any = {}): any => ({
  id: 1,
  email: 'test@user.com',
  password: 'testpwd00',
  firstName: 'Test',
  lastName: 'User',
  theme: AppTheme.LIGHT,
  gym: { id: 1, name: 'Test Gym', email: 'test@gym.com' },
  gender: Gender.OTHER,
  ...otherProps
});

/**
 * Creates a gym with its data filled
 */
export const createGym = (): Gym => {
  const gym = new Gym();

  gym.id = 1;
  gym.name = 'Test';
  gym.email = 'test@gym.com';
  gym.phone = '000 000 000';
  gym.color = ThemeColor.BLUE;
  gym.virtualGyms = [];

  return gym;
};

/**
 * Creates a person with its data filled
 */
export const createPerson = (password = 'changeme00'): Person => {
  const person = new Person();

  person.id = 1;
  person.email = 'test@user.com';
  person.password = password;
  person.firstName = 'Test';
  person.lastName = 'User';
  person.gender = Gender.OTHER;
  person.theme = AppTheme.LIGHT;
  person.gym = createGym();

  return person;
};

/**
 * Creates an entity that inherits the person dto with the `PersonDTO`
 * values filled
 */
export const createPersonDTO = <T extends PersonDTO<Gym | number>>(
  DTO: new () => T
): T => {
  const dto = new DTO();

  dto.id = 1;
  dto.email = 'test@user.com';
  dto.password = 'testpwd00';
  dto.firstName = 'Test';
  dto.lastName = 'User';
  dto.gym = 1;
  dto.gender = Gender.OTHER;
  dto.theme = AppTheme.LIGHT;

  return dto;
};
