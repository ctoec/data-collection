import express from 'express';
import { passAsyncError } from '../middleware/error/passAsyncError';
import {
  NotFoundError,
  BadRequestError,
  ApiError,
} from '../middleware/error/errors';
import * as controller from '../controllers/children';
import { Child } from '../entity';
import { parseQueryString } from '../utils/parseQueryString';
import { validate } from 'class-validator';

export const childrenRouter = express.Router();

/**
 * /children POST
 *
 * Creates a new child
 */
childrenRouter.post(
  '/',
  passAsyncError(async (req, res) => {
    try {
      const child = await controller.createChild(req.body, req.user);
      res.status(201).send({ id: child.id });
    } catch (err) {
      if (err instanceof ApiError) throw err;
      console.error('Error creating child: ', err);
      throw new BadRequestError('Child information not saved.');
    }
  })
);

/**
 * /children GET
 *
 * Returns all children the authed user has access to,
 * or the count of all children, if qs param `count=true` is passed
 */
childrenRouter.get(
  '/',
  passAsyncError(async (req, res) => {
    const organizationIds = parseQueryString(req, 'organizationId', {
      post: parseInt,
      forceArray: true,
    }) as number[];
    const children = await controller.getChildren(req.user, organizationIds);

    const count = req.query['count'] as string;
    if (count && count === 'true') {
      res.send({ count: children.length });
      return;
    }

    // Augment children with any validation errors in their nested objects
    const childrenWithErrors: Child[] = await Promise.all(
      children.map(async (child) => {
        return { ...child, validationErrors: await validate(child) };
      })
    );
    res.send(childrenWithErrors);
  })
);

/**
 * /children/:childId GET
 *
 * Returns the given child, with all nested data desired by the client
 * including family, incomeDeterminations, enrollments, and fundings
 */
childrenRouter.get(
  '/:childId',
  passAsyncError(async (req, res) => {
    const child = await controller.getChildById(
      req.params['childId'],
      req.user
    );
    if (!child) throw new NotFoundError();

    res.send(child);
  })
);

/**
 * /children/:childId DELETE
 */
childrenRouter.delete(
  '/:childId',
  passAsyncError(async (req, res) => {
    await controller.deleteChild(req.params['childId'], req.user);
    res.sendStatus(200);
  })
);

/**
 * /children PUT
 */
childrenRouter.put(
  '/:childId',
  passAsyncError(async (req, res) => {
    try {
      await controller.updateChild(req.params['childId'], req.user, req.body);
      res.sendStatus(200);
    } catch (err) {
      if (err instanceof ApiError) throw err;
      console.error('Error saving changes to child: ', err);
      throw new BadRequestError('Child information not saved.');
    }
  })
);

/**
 * /children/:childId/change-enrollment POST
 *
 * Body: See `client/src/shared/payloads/ChangeEnrollment.ts
 */

childrenRouter.post(
  '/:childId/change-enrollment',
  passAsyncError(async (req, res) => {
    try {
      await controller.changeEnrollment(
        req.params['childId'],
        req.body,
        req.user
      );

      res.sendStatus(200);
    } catch (err) {
      if (err instanceof ApiError) throw err;

      console.error('Error changing enrollment: ', err);
      throw new BadRequestError(
        'Unable to change enrollment. Make sure request payload has expected format.'
      );
    }
  })
);
