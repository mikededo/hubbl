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
import { ENTITY_IDENTIFIERS } from './util';

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

  await cnt.transaction(async (em) => {
    await em.getRepository(Owner).save({
      person: {
        id: ENTITY_IDENTIFIERS.OWNER,
        firstName: 'Owner',
        lastName: 'Test',
        email: 'test@owner.com',
        password: await hash('owner-password', await genSalt(10)),
        gender: Gender.OTHER,
        gym: {
          id: ENTITY_IDENTIFIERS.GYM,
          name: 'TestGym',
          email: 'test@gym.com',
          phone: '000 000 000',
          color: ThemeColor.BLUE,
          eventTypes: [
            {
              id: ENTITY_IDENTIFIERS.EVENT_TYPE_ONE,
              name: 'EventType One',
              labelColor: AppPalette.BLUE,
              eventTemplates: [
                {
                  id: ENTITY_IDENTIFIERS.EVENT_TPL_ONE,
                  name: 'Event Template One',
                  description: 'Event template one of event type one'
                },
                {
                  id: ENTITY_IDENTIFIERS.EVENT_TPL_TWO,
                  name: 'Event Template Two',
                  description: 'Event template two of event type two'
                },
                {
                  id: ENTITY_IDENTIFIERS.EVENT_TPL_THREE,
                  name: 'Event Template Three',
                  description: 'Event template three of event type three'
                }
              ]
            },
            {
              id: ENTITY_IDENTIFIERS.EVENT_TYPE_TWO,
              name: 'EventType Two',
              labelColor: AppPalette.BLUE,
              eventTemplates: [
                {
                  id: ENTITY_IDENTIFIERS.EVENT_TPL_FOUR,
                  name: 'Event Template One',
                  description: 'Event template one of event type one'
                }
              ]
            }
          ],
          virtualGyms: [
            {
              id: ENTITY_IDENTIFIERS.VIRTUAL_GYM,
              name: 'VirtualGym One',
              description: 'Virtual gym one description',
              capacity: 10,
              location: 'Test location one, 1',
              openTime: '09:00:00',
              closeTime: '23:00:00',
              gymZones: [
                {
                  id: ENTITY_IDENTIFIERS.GYM_ZONE_ONE,
                  name: 'GymZone One',
                  description: 'Gym zone one of virtual gym one',
                  capacity: 10,
                  openTime: '09:00:00',
                  closeTime: '23:00:00',
                  maskRequired: true,
                  covidPassport: true,
                  isClassType: false,
                  calendar: { id: ENTITY_IDENTIFIERS.CALENDAR_ONE }
                },
                {
                  id: ENTITY_IDENTIFIERS.GYM_ZONE_TWO,
                  name: 'GymZone Two',
                  description: 'Gym zone two of virtual gym one',
                  capacity: 10,
                  openTime: '09:00:00',
                  closeTime: '23:00:00',
                  maskRequired: true,
                  covidPassport: true,
                  isClassType: false,
                  calendar: { id: ENTITY_IDENTIFIERS.CALENDAR_TWO }
                },
                {
                  id: ENTITY_IDENTIFIERS.GYM_ZONE_THREE,
                  name: 'GymZone Three',
                  description: 'Gym zone two of virtual gym one',
                  capacity: 10,
                  openTime: '09:00:00',
                  closeTime: '23:00:00',
                  maskRequired: true,
                  covidPassport: true,
                  isClassType: false,
                  calendar: { id: ENTITY_IDENTIFIERS.CALENDAR_THREE }
                }
              ]
            }
          ]
        }
      }
    });

    await em.getRepository(Worker).save({
      person: {
        id: ENTITY_IDENTIFIERS.WORKER,
        email: 'test@worker.com',
        password: await hash('worker-password', await genSalt(10)),
        firstName: 'Worker',
        lastName: 'Test',
        gender: Gender.OTHER,
        gym: ENTITY_IDENTIFIERS.GYM
      },
      managerId: ENTITY_IDENTIFIERS.OWNER
    } as Worker);

    await em.getRepository(Client).save({
      person: {
        id: ENTITY_IDENTIFIERS.CLIENT,
        email: 'test@client.com',
        password: await hash('client-password', await genSalt(10)),
        firstName: 'Client',
        lastName: 'Test',
        gender: Gender.OTHER,
        gym: ENTITY_IDENTIFIERS.GYM
      },
      covidPassport: true
    } as Client);

    await em.getRepository(Trainer).save({
      person: {
        id: ENTITY_IDENTIFIERS.CLIENT,
        email: 'test@client.com',
        password: await hash('client-password', await genSalt(10)),
        firstName: 'Client',
        lastName: 'Test',
        gender: Gender.OTHER,
        gym: ENTITY_IDENTIFIERS.GYM
      },
      managerId: ENTITY_IDENTIFIERS.OWNER
    } as Trainer);
  });
};

let cnt: Connection;

export const setup = async () => {
  cnt = await createTestDatabase();

  if (!cnt) {
    return;
  }

  await seedDatabase(cnt);
};

export const teardown = async () => {
  if (!cnt) {
    return;
  }

  cnt.close();
};
