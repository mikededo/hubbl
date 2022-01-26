import { setup, teardown } from './e2e-setup';
import { client, owner, trainer, worker } from './Person';

// jest.mock('npmlog');

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
    });
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
  });
});
