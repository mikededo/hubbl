import { ConnectionOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

import {
  Calendar,
  CalendarDate,
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
} from '../models';

const config: ConnectionOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST || 'localhost',
  port: Number(process.env.POSTGRES_PORT) || 5432,
  username: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'changeme',
  database: process.env.POSTGRES_DB || 'gym-man-db',
  entities: [
    Calendar,
    CalendarDate,
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
  namingStrategy: new SnakeNamingStrategy()
};

export default config;
