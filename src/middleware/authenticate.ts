import jwt, { UnauthorizedError } from 'express-jwt';
import jwks from 'jwks-rsa';
import { Request, Response, NextFunction } from 'express';
import { getManager } from 'typeorm';
import { User } from '../entity';
import { InvalidSubClaimError } from './error/errors';
import { passAsyncError } from './error/passAsyncError';

/**
 * Authentication middleware to decode auth JWT (JSON web token)
 * with appropriate key from JWKS (JSON web key set).
 * Leverages express-jwt, a middleware for validating JWT (https://github.com/auth0/express-jwt#readme)
 *
 * Adds the resulting claims to the "claims" property on the request.
 */
const decodeClaim = jwt({ 
	secret: jwks.expressJwtSecret({
		cache: true,
		jwksUri: `${(process.env.WINGED_KEYS_HOST || 'https://localhost:5050/')}.well-known/openid-configuration/jwks`,
		strictSsl: false,
	}),
	algorithms: ['RS256'],
	requestProperty: 'claims',
});

/**
 * Authentication middleware to use the "sub" claim from the decoded token,
 * which represents the WingedKeysId for a user, to lookup the authed user.
 *
 * Adds the resulting User object to the "user" property on the request.
 */
const addUser = passAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    if (req.claims.sub) {
      const user = await getManager().findOne(User, {
        where: { wingedKeysId: req.claims.sub },
      }); // const user = await getManager().findOne(User, { where: { wingedKeysId: req.claims.sub } })
      if (!user) throw new InvalidSubClaimError();
      req.user = user;
      next();
    }
  }
);

/**
 * Full authnetication middleware chains together decodeClaim and addUser,
 * so that any authenticated route gets the user, looked up via decoded JWT
 * "sub" claim, added to the request
 */
export const authenticate = [decodeClaim, addUser];
