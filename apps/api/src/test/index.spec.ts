import { setup, teardown } from './e2e-setup';
import { eventType } from './EventType';
import { client, owner, trainer, worker } from './Person';
import { token } from './Token';
import { common } from './util';

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

      it('should register a client', async () => {
        await client.register();
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
});
