import { Router } from 'express';
import { TokenRefresh, TokenValidateCookie } from '../controllers';

const TokenRouter: Router = Router();

/**
 * @description Validates if the HTTP_ONLY cookie that contains the refresh
 * token is still valid. If it is valid, it returns a new temporary token.
 */
TokenRouter.post('/validate', (req, res) => {
  TokenValidateCookie.execute(req, res);
});

/**
 * @description Validates the given token and, if valid returns a new token.
 */
TokenRouter.post('/refresh', (req, res) => {
  TokenRefresh.execute(req, res);
});

export default TokenRouter;
