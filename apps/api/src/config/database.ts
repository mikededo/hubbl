import { ConnectionOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

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

import { DatabaseLogger } from './db.logger';

const config: ConnectionOptions = {
  type: 'postgres',
  name: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE,
  entities: [
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
  ],
  synchronize: true,
  namingStrategy: new SnakeNamingStrategy(),
  logger: new DatabaseLogger(),
  logging: true
};

export default config;
