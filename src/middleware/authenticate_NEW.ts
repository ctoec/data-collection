import jwt from 'express-jwt';
import { Request } from 'express';

const getSecret: jwt.SecretCallback = (req: Request, payload: any, done) => {
  console.log('PAYLOAD', payload);
  console.log('REQUEST', req);
};

export const authenticate = jwt({ secret: getSecret, algorithms: ['RS256'] });
