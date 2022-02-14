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

const getDate = (): Partial<CalendarDate> => {
  const date = new Date();
  date.setDate(date.getDate() + 1);

  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate()
  };
};

const createTestDatabase = async (): Promise<Connection> => {
  try {
    const cnt = await createConnection({
      type: 'postgres',
      name: 'postgres-test',
      host: process.env.POSTGRES_TEST_HOST,
      port: +process.env.POSTGRES_TEST_PORT,
      username: process.env.POSTGRES_TEST_USER,
      password: process.env.POSTGRES_TEST_PASSWORD,
      database: process.env.POSTGRES_TEST_DATABASE,
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
    console.error(e);
    console.error('Error on initialising the database.');
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
        email: ENTITY_IDENTIFIERS.OWNER_EMAIL,
        password: await hash('owner-password', await genSalt(10)),
        phone: '000 000 000',
        gender: Gender.OTHER,
        gym: {
          id: ENTITY_IDENTIFIERS.GYM,
          name: 'TestGym',
          email: 'test@gym.com',
          phone: '000 000 000',
          color: ThemeColor.BLUE,
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
                  isClassType: true,
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
                  isClassType: true,
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

    await em.getRepository(EventType).save([
      {
        id: ENTITY_IDENTIFIERS.EVENT_TYPE_ONE,
        name: 'EventType One',
        description: 'EventType One description',
        labelColor: AppPalette.BLUE,
        gym: ENTITY_IDENTIFIERS.GYM
      },
      {
        id: ENTITY_IDENTIFIERS.EVENT_TYPE_TWO,
        name: 'EventType Two',
        description: 'EventType Two description',
        labelColor: AppPalette.BLUE,
        gym: ENTITY_IDENTIFIERS.GYM
      }
    ]);

    await em.getRepository(EventTemplate).save([
      {
        id: ENTITY_IDENTIFIERS.EVENT_TPL_ONE,
        name: 'Event Template One',
        description: 'Event template one of event type one',
        gym: ENTITY_IDENTIFIERS.GYM,
        type: ENTITY_IDENTIFIERS.EVENT_TYPE_ONE
      },
      {
        id: ENTITY_IDENTIFIERS.EVENT_TPL_TWO,
        name: 'Event Template Two',
        description: 'Event template two of event type two',
        gym: ENTITY_IDENTIFIERS.GYM,
        type: ENTITY_IDENTIFIERS.EVENT_TYPE_ONE
      },
      {
        id: ENTITY_IDENTIFIERS.EVENT_TPL_THREE,
        name: 'Event Template Three',
        description: 'Event template three of event type three',
        gym: ENTITY_IDENTIFIERS.GYM,
        type: ENTITY_IDENTIFIERS.EVENT_TYPE_ONE
      },
      {
        id: ENTITY_IDENTIFIERS.EVENT_TPL_FOUR,
        name: 'Event Template One',
        description: 'Event template one of event type two',
        gym: ENTITY_IDENTIFIERS.GYM,
        type: ENTITY_IDENTIFIERS.EVENT_TYPE_TWO
      }
    ]);

    await em.getRepository(Worker).save({
      person: {
        id: ENTITY_IDENTIFIERS.WORKER,
        email: ENTITY_IDENTIFIERS.WORKER_EMAIL,
        password: await hash('worker-password', await genSalt(10)),
        firstName: 'Worker',
        lastName: 'Test',
        phone: '000 000 000',
        gender: Gender.OTHER,
        gym: ENTITY_IDENTIFIERS.GYM
      },
      managerId: ENTITY_IDENTIFIERS.OWNER,
      createGymZones: true,
      updateGymZones: true,
      deleteGymZones: true,
      createTrainers: true,
      updateTrainers: true,
      deleteTrainers: true,
      createClients: true,
      updateClients: true,
      deleteClients: true,
      createEvents: true,
      updateEvents: true,
      deleteEvents: true,
      createEventTypes: true,
      updateEventTypes: true,
      deleteEventTypes: true,
      createEventTemplates: true,
      updateEventTemplates: true,
      deleteEventTemplates: true,
      createEventAppointments: true,
      updateEventAppointments: true,
      deleteEventAppointments: true,
      createCalendarAppointments: true,
      updateCalendarAppointments: true,
      deleteCalendarAppointments: true
    } as Worker);

    await em.getRepository(Client).save([
      {
        person: {
          id: ENTITY_IDENTIFIERS.CLIENT,
          email: ENTITY_IDENTIFIERS.CLIENT_EMAIL,
          password: await hash('client-password', await genSalt(10)),
          firstName: 'Client',
          lastName: 'Test One',
          phone: '000 000 000',
          gender: Gender.OTHER,
          gym: ENTITY_IDENTIFIERS.GYM
        },
        covidPassport: true
      },
      {
        person: {
          id: ENTITY_IDENTIFIERS.CLIENT_TWO,
          email: ENTITY_IDENTIFIERS.CLIENT_EMAIL_TWO,
          password: await hash('client-password', await genSalt(10)),
          firstName: 'Client',
          lastName: 'Test Two',
          phone: '000 000 000',
          gender: Gender.OTHER,
          gym: ENTITY_IDENTIFIERS.GYM
        },
        covidPassport: true
      },
      {
        person: {
          id: ENTITY_IDENTIFIERS.CLIENT_THREE,
          email: ENTITY_IDENTIFIERS.CLIENT_EMAIL_THREE,
          password: await hash('client-password', await genSalt(10)),
          firstName: 'Client',
          lastName: 'Test Three',
          phone: '000 000 000',
          gender: Gender.OTHER,
          gym: ENTITY_IDENTIFIERS.GYM
        },
        covidPassport: true
      }
    ]);

    await em.getRepository(Trainer).save({
      person: {
        id: ENTITY_IDENTIFIERS.TRAINER,
        email: ENTITY_IDENTIFIERS.TRAINER_EMAIL,
        password: await hash('trainer-password', await genSalt(10)),
        firstName: 'Trainer',
        lastName: 'Test',
        phone: '000 000 000',
        gender: Gender.OTHER,
        gym: ENTITY_IDENTIFIERS.GYM
      },
      managerId: ENTITY_IDENTIFIERS.OWNER
    } as Trainer);

    await em.getRepository(Event).save([
      {
        id: ENTITY_IDENTIFIERS.EVENT_ONE,
        capacity: 10,
        name: 'Event One',
        description: 'Event One description',
        startTime: '10:00:00',
        endTime: '11:00:00',
        template: ENTITY_IDENTIFIERS.EVENT_TPL_ONE,
        trainer: ENTITY_IDENTIFIERS.TRAINER,
        maskRequired: true,
        covidPassport: true,
        difficulty: 1,
        date: getDate(),
        calendar: ENTITY_IDENTIFIERS.CALENDAR_ONE
      },
      {
        id: ENTITY_IDENTIFIERS.EVENT_TWO,
        capacity: 5,
        name: 'Event Two',
        description: 'Event Two description',
        startTime: '10:00:00',
        endTime: '11:00:00',
        template: ENTITY_IDENTIFIERS.EVENT_TPL_ONE,
        trainer: ENTITY_IDENTIFIERS.TRAINER,
        maskRequired: true,
        covidPassport: true,
        difficulty: 2,
        date: getDate(),
        calendar: ENTITY_IDENTIFIERS.CALENDAR_TWO
      },
      {
        id: ENTITY_IDENTIFIERS.EVENT_THREE,
        capacity: 10,
        name: 'Event Three',
        description: 'Event Three description',
        startTime: '11:00:00',
        endTime: '12:00:00',
        template: ENTITY_IDENTIFIERS.EVENT_TPL_TWO,
        trainer: ENTITY_IDENTIFIERS.TRAINER,
        maskRequired: true,
        covidPassport: true,
        difficulty: 3,
        date: getDate(),
        calendar: ENTITY_IDENTIFIERS.CALENDAR_ONE
      },
      {
        id: ENTITY_IDENTIFIERS.EVENT_FOUR,
        capacity: 10,
        name: 'Event Four',
        description: 'Event Four description',
        startTime: '12:00:00',
        endTime: '13:00:00',
        template: ENTITY_IDENTIFIERS.EVENT_TPL_THREE,
        trainer: ENTITY_IDENTIFIERS.TRAINER,
        maskRequired: true,
        covidPassport: true,
        difficulty: 4,
        date: getDate(),
        calendar: ENTITY_IDENTIFIERS.CALENDAR_ONE
      },
      {
        id: ENTITY_IDENTIFIERS.EVENT_FIVE,
        capacity: 10,
        name: 'Event Five',
        description: 'Event Five description',
        startTime: '12:00:00',
        endTime: '13:00:00',
        trainer: ENTITY_IDENTIFIERS.TRAINER,
        maskRequired: true,
        covidPassport: true,
        difficulty: 5,
        date: getDate(),
        calendar: ENTITY_IDENTIFIERS.CALENDAR_TWO
      }
    ]);

    await em.getRepository(EventAppointment).save([
      {
        event: ENTITY_IDENTIFIERS.EVENT_TWO,
        client: ENTITY_IDENTIFIERS.CLIENT,
        startTime: '10:00:00',
        endTime: '11:00:00',
        cancelled: false
      },
      {
        event: ENTITY_IDENTIFIERS.EVENT_TWO,
        client: ENTITY_IDENTIFIERS.CLIENT_TWO,
        startTime: '10:00:00',
        endTime: '11:00:00',
        cancelled: false
      },
      {
        event: ENTITY_IDENTIFIERS.EVENT_TWO,
        client: ENTITY_IDENTIFIERS.CLIENT_THREE,
        startTime: '10:00:00',
        endTime: '11:00:00',
        cancelled: false
      }
    ]);

    await em.getRepository(CalendarAppointment).save([
      {
        calendar: ENTITY_IDENTIFIERS.CALENDAR_THREE,
        client: ENTITY_IDENTIFIERS.CLIENT_THREE,
        cancelled: false,
        startTime: '13:00:00',
        endTime: '14:00:00',
        date: getDate()
      },
      {
        calendar: ENTITY_IDENTIFIERS.CALENDAR_THREE,
        client: ENTITY_IDENTIFIERS.CLIENT_TWO,
        cancelled: false,
        startTime: '13:00:00',
        endTime: '14:00:00',
        date: getDate()
      },
      {
        calendar: ENTITY_IDENTIFIERS.CALENDAR_ONE,
        client: ENTITY_IDENTIFIERS.CLIENT_THREE,
        cancelled: false,
        startTime: '14:00:00',
        endTime: '15:30:00',
        date: getDate()
      }
    ]);
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
