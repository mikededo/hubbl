import { genSalt, hash } from 'bcrypt';
import { DataSource } from 'typeorm';

import {
  CalendarAppointment,
  CalendarDate,
  Client,
  Event,
  EventAppointment,
  EventTemplate,
  EventType,
  Gym,
  Owner,
  Trainer,
  TrainerTag,
  Worker
} from '@hubbl/shared/models/entities';
import { AppPalette, Gender } from '@hubbl/shared/types';

import { TestSource } from '../config';
import { ENTITY_IDENTIFIERS } from './util';

const getDate = (add: number): Partial<CalendarDate> => {
  const date = new Date();
  date.setDate(date.getDate() + add);

  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate()
  };
};

const createTestDatabase = async (): Promise<DataSource> => {
  try {
    const source = await TestSource.initialize();

    return source;
  } catch (e) {
    console.error(e);
    console.error('Error on initialising the database.');
  }
};

const seedDatabase = async (source: DataSource): Promise<void> => {
  await source.synchronize(true);

  await source.transaction(async (em) => {
    await em.getRepository(Gym).save({
      id: ENTITY_IDENTIFIERS.GYM,
      name: 'TestGym',
      email: 'test@gym.com',
      phone: '000 000 000',
      code: ENTITY_IDENTIFIERS.GYM_CODE,
      color: AppPalette.BLUE,
      virtualGyms: [
        {
          id: ENTITY_IDENTIFIERS.VIRTUAL_GYM,
          name: 'VirtualGym One',
          description: 'Virtual gym one description',
          capacity: 10,
          location: 'Test location one, 1',
          phone: '123 456 789',
          openTime: '09:00:00',
          closeTime: '23:00:00',
          gym: ENTITY_IDENTIFIERS.GYM,
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
    });

    await em.getRepository(Owner).save({
      personId: ENTITY_IDENTIFIERS.OWNER,
      person: {
        id: ENTITY_IDENTIFIERS.OWNER,
        firstName: 'Owner',
        lastName: 'Test',
        email: ENTITY_IDENTIFIERS.OWNER_EMAIL,
        password: await hash('owner-password', await genSalt(10)),
        phone: '000 000 000',
        gender: Gender.OTHER,
        gym: ENTITY_IDENTIFIERS.GYM
      },
      gym: ENTITY_IDENTIFIERS.GYM
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
        capacity: 5,
        covidPassport: true,
        maskRequired: true,
        difficulty: 1,
        gym: ENTITY_IDENTIFIERS.GYM,
        type: ENTITY_IDENTIFIERS.EVENT_TYPE_ONE
      },
      {
        id: ENTITY_IDENTIFIERS.EVENT_TPL_TWO,
        name: 'Event Template Two',
        description: 'Event template two of event type two',
        capacity: 5,
        covidPassport: true,
        maskRequired: true,
        difficulty: 2,
        gym: ENTITY_IDENTIFIERS.GYM,
        type: ENTITY_IDENTIFIERS.EVENT_TYPE_ONE
      },
      {
        id: ENTITY_IDENTIFIERS.EVENT_TPL_THREE,
        name: 'Event Template Three',
        description: 'Event template three of event type three',
        capacity: 5,
        covidPassport: true,
        maskRequired: true,
        difficulty: 3,
        gym: ENTITY_IDENTIFIERS.GYM,
        type: ENTITY_IDENTIFIERS.EVENT_TYPE_ONE
      },
      {
        id: ENTITY_IDENTIFIERS.EVENT_TPL_FOUR,
        name: 'Event Template One',
        description: 'Event template one of event type two',
        capacity: 5,
        covidPassport: true,
        maskRequired: true,
        difficulty: 4,
        gym: ENTITY_IDENTIFIERS.GYM,
        type: ENTITY_IDENTIFIERS.EVENT_TYPE_TWO
      }
    ]);

    await em.getRepository(Worker).save({
      personId: ENTITY_IDENTIFIERS.WORKER,
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
      createGymZones: true,
      updateGymZones: true,
      deleteGymZones: true,
      createTrainers: true,
      updateTrainers: true,
      deleteTrainers: true,
      createClients: true,
      updateClients: true,
      deleteClients: true,
      createTags: true,
      updateTags: true,
      deleteTags: true,
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
        personId: ENTITY_IDENTIFIERS.CLIENT,
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
        personId: ENTITY_IDENTIFIERS.CLIENT_TWO,
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
        personId: ENTITY_IDENTIFIERS.CLIENT_THREE,
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

    await em.getRepository(TrainerTag).save([
      {
        id: ENTITY_IDENTIFIERS.TRIANER_TAG_ONE,
        name: 'Tag One',
        color: AppPalette.BLUE,
        gym: ENTITY_IDENTIFIERS.GYM
      },
      {
        id: ENTITY_IDENTIFIERS.TRIANER_TAG_TWO,
        name: 'Tag Two',
        color: AppPalette.EMERALD,
        gym: ENTITY_IDENTIFIERS.GYM
      },
      {
        id: ENTITY_IDENTIFIERS.TRIANER_TAG_THREE,
        name: 'Tag Three',
        color: AppPalette.PEARL,
        gym: ENTITY_IDENTIFIERS.GYM
      },
      {
        id: ENTITY_IDENTIFIERS.TRIANER_TAG_FOUR,
        name: 'Tag Four',
        color: AppPalette.PURPLE,
        gym: ENTITY_IDENTIFIERS.GYM
      }
    ]);

    await em.getRepository(Trainer).save({
      personId: ENTITY_IDENTIFIERS.TRAINER,
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
      tags: [
        {
          id: ENTITY_IDENTIFIERS.TRIANER_TAG_ONE,
          name: 'Tag One',
          color: AppPalette.BLUE,
          gym: ENTITY_IDENTIFIERS.GYM
        },
        {
          id: ENTITY_IDENTIFIERS.TRIANER_TAG_TWO,
          name: 'Tag Two',
          color: AppPalette.EMERALD,
          gym: ENTITY_IDENTIFIERS.GYM
        }
      ]
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
        eventType: ENTITY_IDENTIFIERS.EVENT_TYPE_ONE,
        trainer: ENTITY_IDENTIFIERS.TRAINER,
        maskRequired: true,
        covidPassport: true,
        difficulty: 1,
        date: getDate(0),
        calendar: ENTITY_IDENTIFIERS.CALENDAR_ONE,
        gym: ENTITY_IDENTIFIERS.GYM
      },
      {
        id: ENTITY_IDENTIFIERS.EVENT_TWO,
        capacity: 5,
        name: 'Event Two',
        description: 'Event Two description',
        startTime: '10:00:00',
        endTime: '11:00:00',
        template: ENTITY_IDENTIFIERS.EVENT_TPL_ONE,
        eventType: ENTITY_IDENTIFIERS.EVENT_TYPE_TWO,
        trainer: ENTITY_IDENTIFIERS.TRAINER,
        maskRequired: true,
        covidPassport: true,
        difficulty: 2,
        date: getDate(0),
        calendar: ENTITY_IDENTIFIERS.CALENDAR_TWO,
        gym: ENTITY_IDENTIFIERS.GYM
      },
      {
        id: ENTITY_IDENTIFIERS.EVENT_THREE,
        capacity: 10,
        name: 'Event Three',
        description: 'Event Three description',
        startTime: '11:00:00',
        endTime: '12:00:00',
        template: ENTITY_IDENTIFIERS.EVENT_TPL_TWO,
        eventType: ENTITY_IDENTIFIERS.EVENT_TYPE_ONE,
        trainer: ENTITY_IDENTIFIERS.TRAINER,
        maskRequired: true,
        covidPassport: true,
        difficulty: 3,
        date: getDate(1),
        calendar: ENTITY_IDENTIFIERS.CALENDAR_ONE,
        gym: ENTITY_IDENTIFIERS.GYM
      },
      {
        id: ENTITY_IDENTIFIERS.EVENT_FOUR,
        capacity: 10,
        name: 'Event Four',
        description: 'Event Four description',
        startTime: '12:00:00',
        endTime: '13:00:00',
        template: ENTITY_IDENTIFIERS.EVENT_TPL_THREE,
        eventType: ENTITY_IDENTIFIERS.EVENT_TYPE_TWO,
        trainer: ENTITY_IDENTIFIERS.TRAINER,
        maskRequired: true,
        covidPassport: true,
        difficulty: 4,
        date: getDate(1),
        calendar: ENTITY_IDENTIFIERS.CALENDAR_ONE,
        gym: ENTITY_IDENTIFIERS.GYM
      },
      {
        id: ENTITY_IDENTIFIERS.EVENT_FIVE,
        capacity: 10,
        name: 'Event Five',
        description: 'Event Five description',
        startTime: '12:00:00',
        endTime: '13:00:00',
        eventType: ENTITY_IDENTIFIERS.EVENT_TYPE_ONE,
        trainer: ENTITY_IDENTIFIERS.TRAINER,
        maskRequired: true,
        covidPassport: true,
        difficulty: 5,
        date: getDate(1),
        calendar: ENTITY_IDENTIFIERS.CALENDAR_TWO,
        gym: ENTITY_IDENTIFIERS.GYM
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
        date: getDate(1)
      },
      {
        calendar: ENTITY_IDENTIFIERS.CALENDAR_THREE,
        client: ENTITY_IDENTIFIERS.CLIENT_TWO,
        cancelled: false,
        startTime: '13:00:00',
        endTime: '14:00:00',
        date: getDate(1)
      },
      {
        calendar: ENTITY_IDENTIFIERS.CALENDAR_ONE,
        client: ENTITY_IDENTIFIERS.CLIENT_THREE,
        cancelled: false,
        startTime: '14:00:00',
        endTime: '15:30:00',
        date: getDate(1)
      }
    ]);
  });
};

let source: DataSource;

export const setup = async () => {
  source = await createTestDatabase();

  if (!source) {
    return;
  }

  await seedDatabase(source);
};

export const teardown = async () => {
  if (!source) {
    return;
  }

  source.destroy();
};
