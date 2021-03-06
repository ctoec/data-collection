import { UnauthorizedError } from 'express-jwt';

export class ApiError extends Error {
  status: number;
}
/**
 * Custom error class to extend jwt-express UnauthorizedError, which reuses
 * UnauthorizedError.name so that it is handled along with errors from
 * jwt-express (see middleware/error.ts) for 401 Unauthorized
 */
export class InvalidSubClaimError extends ApiError {
  constructor() {
    super('No valid user found for decoded sub claim');
    this.name = UnauthorizedError.name;
    this.status = 401;
  }
}

export class ForbiddenError extends ApiError {
  constructor() {
    super('You are not authorized to access this resource');
    this.name = UnauthorizedError.name;
    this.status = 401;
  }
}

/**
 * Custom error class for 404 Not Found
 */
export class NotFoundError extends ApiError {
  constructor() {
    super('Resource not found');
    this.name = 'NotFoundError';
    this.status = 404;
  }
}

/**
 * Custom error class for 400 Bad Request
 */
export class BadRequestError extends ApiError {
  data?: object;
  constructor(message: string, data?: object) {
    super(message);
    this.name = 'BadRequestError';
    this.status = 400;
    this.data = data;
  }
}

/**
 * Custom error class for 409 Conflict in request error.
 */
export class ResourceConflictError extends ApiError {
  constructor(message: string) {
    super(message);
    this.name = 'ResourceConflictError';
    this.status = 409;
  }
}

/**
 * Custom error class for 500 Internal Server
 */
export class InternalServerError extends ApiError {
  constructor(message: string) {
    super(message);
    this.name = 'InternalServerError';
    this.status = 500;
  }
}
