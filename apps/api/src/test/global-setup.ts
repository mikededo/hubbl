import { genSalt, hash } from 'bcrypt';
import { Connection, createConnection } from 'typeorm';
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
import { AppPalette, Gender, ThemeColor } from '@hubbl/shared/types';

const createTestDatabase = async (): Promise<Connection> => {
  try {
    const cnt = await createConnection({
      type: 'postgres',
      name: 'postgres-test',
      host: 'localhost',
      port: 5433,
      username: 'test',
      password: 'test',
      database: 'test-hubbl-db',
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
      namingStrategy: new SnakeNamingStrategy()
    });

    return cnt;
  } catch (e) {
    console.error('Error on initialising the database.');
    console.log(e);
  }
};

const seedDatabase = async (cnt: Connection): Promise<void> => {
  await cnt.synchronize(true);

  console.log({ connected: cnt.isConnected });

  await cnt.getRepository(Owner).save({
    person: {
      id: 1,
      firstName: 'Owner',
      lastName: 'Test',
      email: 'test@owner.com',
      password: await hash('owner-password', await genSalt(10)),
      gender: Gender.OTHER,
      gym: {
        id: 1,
        name: 'TestGym',
        email: 'test@gym.com',
        phone: '000 000 000',
        color: ThemeColor.BLUE,
        eventTypes: [
          {
            id: 1,
            name: 'EventType One',
            labelColor: AppPalette.BLUE,
            eventTemplates: [
              {
                id: 1,
                name: 'Event Template One',
                description: 'Event template one of event type one'
              },
              {
                id: 2,
                name: 'Event Template Two',
                description: 'Event template two of event type two'
              },
              {
                id: 3,
                name: 'Event Template Three',
                description: 'Event template three of event type three'
              }
            ]
          },
          {
            id: 2,
            name: 'EventType Two',
            labelColor: AppPalette.BLUE,
            eventTemplates: [
              {
                id: 4,
                name: 'Event Template One',
                description: 'Event template one of event type one'
              }
            ]
          }
        ],
        virtualGyms: [
          {
            id: 1,
            name: 'VirtualGym One',
            description: 'Virtual gym one description',
            capacity: 10,
            location: 'Test location one, 1',
            openTime: '09:00:00',
            closeTime: '23:00:00',
            gymZones: [
              {
                id: 1,
                name: 'GymZone One',
                description: 'Gym zone one of virtual gym one',
                capacity: 10,
                openTime: '09:00:00',
                closeTime: '23:00:00',
                maskRequired: true,
                covidPassport: true,
                isClassType: false,
                calendar: { id: 1 }
              },
              {
                id: 2,
                name: 'GymZone Two',
                description: 'Gym zone two of virtual gym one',
                capacity: 10,
                openTime: '09:00:00',
                closeTime: '23:00:00',
                maskRequired: true,
                covidPassport: true,
                isClassType: false,
                calendar: { id: 2 }
              },
              {
                id: 1,
                name: 'GymZone Three',
                description: 'Gym zone two of virtual gym one',
                capacity: 10,
                openTime: '09:00:00',
                closeTime: '23:00:00',
                maskRequired: true,
                covidPassport: true,
                isClassType: false,
                calendar: { id: 3 }
              }
            ]
          }
        ]
      }
    }
  });
};

// SUUUUUUUUUUUUUUUUUUUUUU # no vull saber ni quant temps - 18:30 mirar last commit

export default async () => {
  const cnt: Connection = await createTestDatabase();

  if (!cnt) {
    return;
  }

  await seedDatabase(cnt);

  await cnt.close();
};
