import jwt from 'express-jwt';
import jwks from 'jwks-rsa';
import { Request, Response, NextFunction } from 'express';
import { getManager } from 'typeorm';
import { User } from '../entity';

const decodeClaim = jwt({ 
	secret: jwks.expressJwtSecret({
		cache: true,
		jwksUri: `${(process.env.WINGED_KEYS_HOST || 'https://localhost:5050/')}.well-known/openid-configuration/jwks`,
		strictSsl: false,
	}),
	algorithms: ['RS256'],
	requestProperty: 'claims',
});

const addUser = async (req: Request, res: Response, next: NextFunction) => {
  if (req.claims.sub) {
    getManager()
      .findOne(User, { where: { wingedKeysId: req.claims.sub } })
      .then((user) => {
        req.user = user;
        next();
      })
      .catch((err) => next(err));
  }
};

export const authenticate = [decodeClaim, addUser];
