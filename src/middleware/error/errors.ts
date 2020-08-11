import { UnauthorizedError } from 'express-jwt';

/**
 * Custom error class to extend jwt-express UnauthorizedError, which reuses
 * UnauthorizedError.name so that it is handled along with errors from
 * jwt-express (see middleware/error.ts) for 401 Unauthorized
 */
export class InvalidSubClaimError {
  constructor() {
    this.name = UnauthorizedError.name;
    this.code = 'invalid_sub_claim';
    this.status = 401;
    this.message = 'No valid user found for decoded sub claim';
  }

  name: typeof UnauthorizedError.name;
  code: 'invalid_sub_claim';
  status: 401;
  message: 'No valid user found for decoded sub claim';
}

/**
 * Custom error class for 404 Not Found
 */
export class NotFoundError {
  constructor() {
    this.name = 'NotFoundError';
    this.status = 404;
    this.message = 'Resource not found';
  }

  name: 'NotFoundError';
  status: 404;
  message: 'Resource not found';
}
