import * as supertest from 'supertest';

import app from '../../main';
import * as controllers from '../controllers/EventTemplate';

jest.mock('npmlog');
// eslint-disable-next-line arrow-body-style
jest.mock('../middlewares/auth.middleware', () => {
  return {
    __esModule: true,
    default: (_, __, next) => next()
  };
});

describe('EventTemplate routes', () => {
  it('should call EventTemplateFetchController.execute', async () => {
    const executeSpy = jest.spyOn(
      controllers.EventTemplateFetchController,
      'execute'
    );

    await supertest(app).get('/event-templates/1');

    expect(executeSpy).toHaveBeenCalledTimes(1);
  });

  it('should call EventTemplateCreateController.execute', async () => {
    const executeSpy = jest.spyOn(
      controllers.EventTemplateCreateController,
      'execute'
    );

    await supertest(app).post('/event-templates');

    expect(executeSpy).toHaveBeenCalledTimes(1);
  });

  it('should call EventTemplateUpdateController.execute', async () => {
    const executeSpy = jest.spyOn(
      controllers.EventTemplateUpdateController,
      'execute'
    );

    await supertest(app).put('/event-templates');

    expect(executeSpy).toHaveBeenCalledTimes(1);
  });

  it('should call EventTemplateDeleteController.execute', async () => {
    const executeSpy = jest.spyOn(
      controllers.EventTemplateDeleteController,
      'execute'
    );

    await supertest(app).delete('/event-templates/1');

    expect(executeSpy).toHaveBeenCalledTimes(1);
  });
});
