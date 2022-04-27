import * as helpers from './helpers';
import { PersonLogOutController } from './Person.controller';

jest.mock('./helpers');
jest.mock('../helpers');

describe('PersonController', () => {
  describe('PersonLogOutController', () => {
    describe('execute', () => {
      it('should call PersonLogOut', async () => {
        const PersonLogOutSpy = jest
          .spyOn(helpers, 'logout')
          .mockImplementation();

        await PersonLogOutController.execute({} as any, {} as any);

        expect(PersonLogOutSpy).toHaveBeenCalledWith({
          controller: PersonLogOutController,
          res: {}
        });
      });
    });
  });
});
