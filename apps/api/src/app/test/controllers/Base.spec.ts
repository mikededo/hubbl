import { BaseController } from '../../controllers';

class MockDto {}

class MockBaseController extends BaseController {
  /**
   * The method should not be tested, since it has no implementation
   */
  protected run(): Promise<any> {
    return null;
  }
}

describe('BaseController', () => {
  let controller: BaseController;

  beforeAll(() => {
    controller = new MockBaseController();
  });

  describe('#jsonResponse', () => {
    it('should return a response with the code and body given', () => {
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis()
      } as any;

      BaseController.jsonResponse(mockRes, 200, {});

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({});
    });
  });

  describe('#ok<T>', () => {
    it('should return a response with the 200 code and no dto', () => {
      const mockRes = {
        sendStatus: jest.fn().mockReturnThis(),
        type: jest.fn()
      } as any;

      controller.ok(mockRes);

      expect(mockRes.sendStatus).toHaveBeenCalledWith(200);
      expect(mockRes.type).not.toHaveBeenCalled();
    });

    it('should return a response with the 200 code and a dto', () => {
      const mockRes = {
        type: jest.fn().mockReturnThis(),
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis()
      } as any;
      const dto = new MockDto();

      controller.ok<MockDto>(mockRes, dto);

      expect(mockRes.type).toHaveBeenCalledWith('application/json');
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(dto);
    });
  });

  describe('#created', () => {
    it('should return a response with the 201 code', () => {
      const mockRes = { sendStatus: jest.fn() } as any;

      controller.created(mockRes);

      expect(mockRes.sendStatus).toHaveBeenCalledWith(201);
    });
  });

  const commonResponseTests = (
    method: keyof Pick<
      BaseController,
      'clientError' | 'unauthorized' | 'forbidden' | 'notFound'
    >,
    code: number,
    defaultMessage: string,
    altMessage: string
  ) => {
    describe(`#${method}`, () => {
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis()
      } as any;

      afterEach(() => {
        mockRes.status.mockClear();
        mockRes.json.mockClear();
      });

      it(`should return call jsonResponse with ${code} status and default message`, () => {
        const jsonResSpy = jest.spyOn(BaseController, 'jsonResponse');

        controller[method](mockRes);

        expect(jsonResSpy).toHaveBeenCalled();
        expect(mockRes.status).toHaveBeenCalledWith(code);
        expect(mockRes.json).toHaveBeenCalledWith({ message: defaultMessage });
      });

      it(`should return call jsonResponse with ${code} status and custom message`, () => {
        const jsonResSpy = jest.spyOn(BaseController, 'jsonResponse');

        controller[method](mockRes, altMessage);

        expect(jsonResSpy).toHaveBeenCalled();
        expect(mockRes.status).toHaveBeenCalledWith(code);
        expect(mockRes.json).toHaveBeenCalledWith({ message: altMessage });
      });
    });
  };

  commonResponseTests('clientError', 400, 'Unauthorized', 'User error');

  commonResponseTests('unauthorized', 401, 'Unauthorized', 'User error');

  commonResponseTests('forbidden', 403, 'Forbidden', 'User not allowed');

  commonResponseTests('notFound', 404, 'Not found', 'Endpoint not found');

  describe('#fail', () => {
    it('should return a response with 500 and the message of the Error', () => {
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis()
      } as any;
      const err = { toString: jest.fn().mockReturnValue('Server error') } as any;

      controller.fail(mockRes, err);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Server error' });
      expect(err.toString).toHaveBeenCalledTimes(1);
    });
  });
});
