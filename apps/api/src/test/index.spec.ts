import { setup, teardown } from './e2e-setup';
import { calendar } from './Calendar';
import { eventTemplate } from './EventTemplate';
import { eventType } from './EventType';
import * as appointments from './Appointments';
import { event } from './Event';
import { gymZone } from './GymZone';
import { client, owner, trainer, worker } from './Person';
import { token } from './Token';
import { common } from './util';
import { virtualGym } from './VirtualGym';
import { dashboard } from './Dashboard';

jest.mock('npmlog');

describe('Integration tests', () => {
  beforeAll((done) => {
    setup()
      .then(() => {
        done();
      })
      .catch((e) => {
        console.log(e);
        process.exit(-1);
      });
  });

  afterAll((done) => {
    teardown()
      .then(() => {
        done();
      })
      .catch(console.log);
  });

  describe('Person', () => {
    describe('Fetch', () => {
      it('should fetch the trainers', async () => {
        await trainer.fetch();
      });

      it('should fetch the workers', async () => {
        await worker.fetch();
      });
    });

    describe('register', () => {
      it('should register an owner', async () => {
        await owner.register();
      });

      it('should register a worker', async () => {
        await worker.register();
      });

      it('should register a trainer', async () => {
        await trainer.register();
      });

      it('should register a client with a gym id', async () => {
        await client.baseRegister();
      });

      it('should register a client with a gym code', async () => {
        await client.codeRegister();
      });
    });

    describe('login', () => {
      it('should login an owner', async () => {
        await owner.login();
      });

      it('should login a worker', async () => {
        await worker.login();
      });

      it('should not allow to login a trainer', async () => {
        await trainer.login();
      });

      it('should login a client', async () => {
        await client.login();
      });
    });

    describe('update', () => {
      it('should update an owner', async () => {
        await owner.update();
      });

      it('should update a worker by an owner', async () => {
        await worker.update('owner');
      });

      it('should update a worker by a worker', async () => {
        await worker.update('worker');
      });

      it('should update a trainer by an owner', async () => {
        await trainer.update('owner');
      });

      it('should update a trainer by an worker', async () => {
        await trainer.update('worker');
      });

      it('should update a client by themself', async () => {
        await client.update('client');
      });

      it('should update a client by an owner', async () => {
        await client.update('owner');
      });

      it('should update a client by a worker', async () => {
        await client.update('worker');
      });
    });
  });

  describe('Token', () => {
    it('should validate a token', async () => {
      await token.validate();
    });

    it('should refresh a token', async () => {
      await token.refresh();
    });
  });

  describe('Dashboard', () => {
    it('should fetch the dashboard by an owner', async () => {
      await dashboard.fetch('owner');
    });

    it('should fetch the dashboard by a worker', async () => {
      await dashboard.fetch('worker');
    });

    it('should fetch the dashboard by a client', async () => {
      await dashboard.fetch('client');
    });
  });

  describe('Event type', () => {
    describe('unauthorized', () => {
      it('should block unauthorized POST calls', async () => {
        await common.unauthorized('/event-types', 'post');
      });

      it('should block unauthorized PUT calls', async () => {
        await common.unauthorized('/event-types', 'put');
      });
      it('should block unauthorized GET calls', async () => {
        await common.unauthorized('/event-types', 'get');
      });

      it('should block unauthorized DELETE calls', async () => {
        await common.unauthorized('/event-types/1', 'delete');
      });
    });

    describe('fetch', () => {
      it('should fetch event types by owner', async () => {
        await eventType.fetch('owner');
      });

      it('should fetch event types by worker', async () => {
        await eventType.fetch('worker');
      });

      it('should fetch event types by client', async () => {
        await eventType.fetch('client');
      });
    });

    describe('create, update & delete', () => {
      it('should create, update and delete an event type by an owner', async () => {
        await eventType.createUpdateAndDelete('owner');
      });

      it('should create, update and delete an event type by an worker', async () => {
        await eventType.createUpdateAndDelete('worker');
      });
    });
  });

  describe('Event template', () => {
    describe('unauthorized', () => {
      it('should block unauthorized POST calls', async () => {
        await common.unauthorized('/event-templates', 'post');
      });

      it('should block unauthorized PUT calls', async () => {
        await common.unauthorized('/event-templates', 'put');
      });
      it('should block unauthorized GET calls', async () => {
        await common.unauthorized('/event-templates', 'get');
      });

      it('should block unauthorized DELETE calls', async () => {
        await common.unauthorized('/event-templates/1', 'delete');
      });
    });

    describe('fetch', () => {
      it('should fetch event templates by owner', async () => {
        await eventTemplate.fetch('owner');
      });

      it('should fetch event templates by worker', async () => {
        await eventTemplate.fetch('worker');
      });

      it('should fetch event templates by client', async () => {
        await eventTemplate.fetch('client');
      });
    });

    describe('create, update & delete', () => {
      it('should create, update and delete an event template by an owner', async () => {
        await eventTemplate.createUpdateAndDelete('owner');
      });

      it('should create, update and delete an event template by an worker', async () => {
        await eventTemplate.createUpdateAndDelete('worker');
      });
    });
  });

  describe('Event', () => {
    describe('Create, update & delete', () => {
      it('should create, update and delete an event by an owner', async () => {
        await event.createUpdateAndDelete('owner');
      });

      it('should create, update and delete an event by an worker', async () => {
        await event.createUpdateAndDelete('worker');
      });
    });

    describe('Create without template', () => {
      it('should create, update and delete an event by an owner', async () => {
        await event.createNoTemplate('owner');
      });

      it('should create, update and delete an event by an worker', async () => {
        await event.createNoTemplate('worker');
      });
    });
  });

  describe('Virtual Gym', () => {
    describe('unauthorized', () => {
      it('should block unauthorized POST calls', async () => {
        await common.unauthorized('/virtual-gyms', 'post');
      });

      it('should block unauthorized PUT calls', async () => {
        await common.unauthorized('/virtual-gyms', 'put');
      });
      it('should block unauthorized GET calls', async () => {
        await common.unauthorized('/virtual-gyms', 'get');
      });

      it('should block unauthorized DELETE calls', async () => {
        await common.unauthorized('/virtual-gyms/1', 'delete');
      });
    });

    describe('fetch', () => {
      it('should fetch event templates by owner', async () => {
        await virtualGym.fetch('owner');
      });

      it('should fetch event templates by worker', async () => {
        await virtualGym.fetch('worker');
      });

      it('should fetch event templates by client', async () => {
        await virtualGym.fetch('client');
      });
    });

    describe('create, update & delete', () => {
      it('should create, update and delete a virtual gym by an owner', async () => {
        await virtualGym.createUpdateAndDeleteByOwner();
      });

      it('should not allow to create a virtual gym by a worker', async () => {
        await virtualGym.createUpdateAndDeleteNotByOwner();
      });
    });
  });

  describe('Gym zone', () => {
    describe('unauthorized', () => {
      it('should block unauthorized POST calls', async () => {
        await common.unauthorized('/virtual-gyms/1/gym-zones', 'post');
      });

      it('should block unauthorized PUT calls', async () => {
        await common.unauthorized('/virtual-gyms/1/gym-zones', 'put');
      });
      it('should block unauthorized GET calls', async () => {
        await common.unauthorized('/virtual-gyms/1/gym-zones', 'get');
      });

      it('should block unauthorized DELETE calls', async () => {
        await common.unauthorized('/virtual-gyms/1/gym-zones/1', 'delete');
      });
    });

    describe('fetch', () => {
      it('should fetch event templates by owner', async () => {
        await gymZone.fetch('owner');
      });

      it('should fetch event templates by worker', async () => {
        await gymZone.fetch('worker');
      });

      it('should fetch event templates by client', async () => {
        await gymZone.fetch('client');
      });
    });

    describe('create, update & delete', () => {
      it('should create, update and delete a virtual gym by an owner', async () => {
        await gymZone.createUpdateAndDelete('owner');
      });

      it('should not allow to create a virtual gym by a worker', async () => {
        await gymZone.createUpdateAndDelete('worker');
      });
    });
  });

  describe('Calendars', () => {
    describe('calendar events', () => {
      it('should fetch the events of a calendar by an owner', async () => {
        await calendar.fetchEvents('owner');
      });

      it('should fetch the events of a calendar by a worker', async () => {
        await calendar.fetchEvents('worker');
      });

      it('should fetch the events of a calendar by a client', async () => {
        await calendar.fetchEvents('client');
      });
    });

    describe('event appointments', () => {
      it('should fetch the appointments of an event by an owner', async () => {
        await calendar.fetchEventAppointments('owner');
      });

      it('should fetch the appointments of an event by a worker', async () => {
        await calendar.fetchEventAppointments('worker');
      });
    });

    describe('calendar appointments', () => {
      it('should fetch the appointments of an event by an owner', async () => {
        await calendar.fetchCalendarAppointments('owner');
      });

      it('should fetch the appointments of an event by an worker', async () => {
        await calendar.fetchCalendarAppointments('worker');
      });
    });
  });

  describe('Appointments', () => {
    describe('events', () => {
      describe('create & cancel', () => {
        it('should create and cancel an event for a client by an owner', async () => {
          await appointments.events.createAndCancel('owner');
        });

        it('should create and cancel an event for a client by a worker', async () => {
          await appointments.events.createAndCancel('worker');
        });

        it('should create and cancel an event for a client by a client', async () => {
          await appointments.events.createAndCancel('client');
        });
      });

      describe('create, cancel & delete', () => {
        it('should create and cancel an event for a client by an owner', async () => {
          await appointments.events.createCancelAndDelete('owner');
        });

        it('should create and cancel an event for a client by a worker', async () => {
          await appointments.events.createCancelAndDelete('worker');
        });

        it('should create and cancel an event for a client by a client', async () => {
          await appointments.events.createCancelAndDelete('client');
        });
      });
    });

    describe('calendars', () => {
      describe('fetch', () => {
        it('should fetch the available intervals by an owner', async () => {
          await appointments.calendars.fetch('owner');
        });

        it('should fetch the available intervals by a worker', async () => {
          await appointments.calendars.fetch('worker');
        });

        it('should fetch the available intervals by a client', async () => {
          await appointments.calendars.fetch('client');
        });
      });

      describe('create & cancel', () => {
        it('should create and cancel an event for a client by an owner', async () => {
          await appointments.calendars.createAndCancel('owner');
        });

        it('should create and cancel an event for a client by a worker', async () => {
          await appointments.calendars.createAndCancel('worker');
        });

        it('should create and cancel an event for a client by a client', async () => {
          await appointments.calendars.createAndCancel('client');
        });
      });

      describe('create, cancel & delete', () => {
        it('should create and cancel an event for a client by an owner', async () => {
          await appointments.calendars.createCancelAndDelete('owner');
        });

        it('should create and cancel an event for a client by an worker', async () => {
          await appointments.calendars.createCancelAndDelete('worker');
        });

        it('should create and cancel an event for a client by a client', async () => {
          await appointments.calendars.createCancelAndDelete('client');
        });
      });
    });
  });
});
