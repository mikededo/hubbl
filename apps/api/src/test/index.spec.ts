import { owner } from './Person';
import { setup, teardown } from './e2e-setup';

jest.mock('npmlog');

beforeAll((done) => {
  setup().then(() => {
    done();
  });
});

afterAll((done) => {
  teardown().then(() => {
    console.log('Connection closed');
    done();
  });
});

describe('Integration tests', () => {
  describe('Person', () => {
    describe('register', () => {
      it('should register an owner', async () => {
        await owner.register();
      });
    });

    describe('login', () => {
      it('should login an owner', async () => {
        await owner.login();
      });
    });
  });
});
