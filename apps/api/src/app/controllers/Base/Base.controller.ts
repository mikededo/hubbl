import { Request, Response } from 'express';

/**
 * Base controller to be implemented by the concrete controllers
 */
export default abstract class BaseController {
  protected abstract run(req: Request, res: Response): Promise<void | any>;

  public async execute(req: Request, res: Response): Promise<void> {
    try {
      await this.run(req, res);
    } catch (err) {
      this.fail(res, 'An unexpected error occurred');
    }
  }

  /**
   * Sends a response with the `code` and `body` given
   *
   * @param res Response object of the request handler
   * @param code HTTP valid code for the response's status
   * @param body Message or body to send as a json
   * @returns The response sent as a json
   */
  public static jsonResponse(res: Response, code: number, body: any): Response {
    return res.status(code).json(body);
  }

  /**
   * Returns a response with a code 200 response with an optional dto as a
   * json if such dto is defined
   *
   * @param res Reponse object of the request handler
   * @param dto Optional DTO to return
   * @returns The response sent
   */
  public ok<T>(res: Response, dto?: T): Response {
    if (dto) {
      res.type('application/json');
      return BaseController.jsonResponse(res, 200, dto);
    } else {
      return res.sendStatus(200);
    }
  }

  /**
   * Returns a response with a 201 response code
   *
   * @param res Response object of the request handler
   * @returns The response sent
   */
  public created<T>(res: Response, dto?: T): Response {
    if (dto) {
      res.type('application/json');
      return BaseController.jsonResponse(res, 201, dto);
    } else {
      return res.sendStatus(201);
    }
  }

  /**
   * Returns a 400 code response with the given message or the default, if no
   * message has been passed
   *
   * @param res Response object of the request handler
   * @param message Optional message to send as the error. The default
   * message is `"Unauthorized"`
   * @returns A client error reponse as a json
   */
  public clientError(res: Response, message?: string): Response {
    return BaseController.jsonResponse(res, 400, {
      message: message ? message : 'Unauthorized'
    });
  }

  /**
   * Returns a 401 code response with the given message or the default, if no
   * message has been passed
   *
   * @param res Response object of the request handler
   * @param message Optional message to send as the error. The default
   * message is `"Unauthorized"`
   * @returns A client error reponse as a json
   */
  public unauthorized(res: Response, message?: string): Response {
    return BaseController.jsonResponse(res, 401, {
      message: message ? message : 'Unauthorized'
    });
  }

  /**
   * Returns a 401 code response with the given message or the default, if no
   * message has been passed
   *
   * @param res Response object of the request handler
   * @param message Optional message to send as the error. The default
   * message is `"Forbidden"`
   * @returns A client error reponse as a json
   */
  public forbidden(res: Response, message?: string): Response {
    return BaseController.jsonResponse(res, 403, {
      message: message ? message : 'Forbidden'
    });
  }

  /**
   * Returns a 401 code response with the given message or the default, if no
   * message has been passed
   *
   * @param res Response object of the request handler
   * @param message Optional message to send as the error. The default
   * message is `"Not found"`
   * @returns A client error reponse as a json
   */
  public notFound(res: Response, message?: string): Response {
    return BaseController.jsonResponse(res, 404, {
      message: message ? message : 'Not found'
    });
  }

  /**
   * Returns a 500 code response with the given message or the default, if no
   * message has been passed
   *
   * @param res Response object of the request handler
   * @param message Optional message to send as the error. The default
   * message is `"Unauthorized"`
   * @returns A server (or internal) error reponse as a json
   */
  public fail(res: Response, error: Error | string): Response {
    return res.status(500).json({ message: error.toString() });
  }
}
