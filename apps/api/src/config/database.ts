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
  VirtualGym,
  Worker
} from '@hubbl/shared/models/entities';
import { DatabaseLogger } from './db.logger';

const config: ConnectionOptions = {
  type: 'postgres',
  name: 'postgres',
  host: process.env.POSTGRES_HOST || 'localhost',
  port: Number(process.env.POSTGRES_PORT) || 5432,
  username: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'changeme',
  database: process.env.POSTGRES_DB || 'hubbl-db',
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
    VirtualGym,
    Worker
  ],
  synchronize: true,
  namingStrategy: new SnakeNamingStrategy(),
  logger: new DatabaseLogger(),
  logging: true
};

export default config;
