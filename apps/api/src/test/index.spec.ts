import { setup, teardown } from './e2e-setup';
import { client, owner, trainer, worker } from './Person';

jest.mock('npmlog');

describe('Integration tests', () => {
  beforeAll((done) => {
    setup()
      .then(() => {
        done();
      })
      .catch(console.log);
  });

  afterAll((done) => {
    teardown().then(() => {
      done();
    }).catch(console.log);
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
});
