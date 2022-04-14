import * as namingStrategies from 'typeorm-naming-strategies';

import {
  Calendar,
  CalendarAppointment,
  CalendarDate,
  Client,
  Event,
  EventAppointment,
  EventTemplate,
  EventType,
  Gym,
  GymZone,
  Owner,
  Person,
  Trainer,
  TrainerTag,
  VirtualGym,
  Worker
} from '@hubbl/shared/models/entities';

import config from './database';
import * as logger from './db.logger';

jest.mock('typeorm-naming-strategies');
jest.mock('./db.logger');

describe('Database connection config', () => {
  const loggerSpy = jest.spyOn(logger, 'DatabaseLogger');
  const namingSpy = jest.spyOn(namingStrategies, 'SnakeNamingStrategy');

  it('should create the connection configuration using .env fields', () => {
    expect(config.type).toBe('postgres');
    expect((config as any).host).toBe(process.env.POSTGRES_HOST);
    expect((config as any).port).toBe(Number(process.env.POSTGRES_PORT));
    expect((config as any).username).toBe(process.env.POSTGRES_USER);
    expect((config as any).password).toBe(process.env.POSTGRES_PASSWORD);
    expect(config.database).toBe(process.env.POSTGRES_DATABASE);
    expect(config.entities).toStrictEqual([
      CalendarAppointment,
      EventAppointment,
      Calendar,
      CalendarDate,
      Client,
      Event,
      EventTemplate,
      EventType,
      Gym,
      GymZone,
      Owner,
      Person,
      Trainer,
      TrainerTag,
      VirtualGym,
      Worker
    ]);
    expect(config.synchronize).toBe(true);
    expect(config.namingStrategy).toBeInstanceOf(
      namingStrategies.SnakeNamingStrategy
    );
    expect(config.logger).toBeInstanceOf(logger.DatabaseLogger);
    expect(config.logging).toBe(true);

    expect(loggerSpy).toHaveBeenCalledTimes(1);
    expect(namingSpy).toHaveBeenCalledTimes(2);
  });
});
