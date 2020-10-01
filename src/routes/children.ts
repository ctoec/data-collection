import express from 'express';
import { passAsyncError } from '../middleware/error/passAsyncError';
import {
  NotFoundError,
  BadRequestError,
  ApiError,
} from '../middleware/error/errors';
import * as controller from '../controllers/children';
import { getManager } from 'typeorm';
import { Child } from '../entity';
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
      const child = await controller.createChild(req.body);
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
    const children = await controller.getChildren(req.user);

    const count = req.query['count'];
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
    const childId = req.params['childId'];
    const child = await controller.getChildById(childId);
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
    try {
      const childId = req.params['childId'];
      await getManager().delete(Child, { id: childId });
      res.sendStatus(200);
    } catch (err) {
      console.error("Error removing child's record: ", err);
      throw new BadRequestError('Record not deleted.' + err);
    }
  })
);

/**
 * /children PUT
 */
childrenRouter.put(
  '/:childId',
  passAsyncError(async (req, res) => {
    try {
      const id = req.params['childId'];
      const child = await getManager().findOne(Child, id);
      if (!child) throw new NotFoundError();

      await getManager().save(getManager().merge(Child, child, req.body));
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
    const childId = req.params['childId'];
    try {
      await controller.changeEnrollment(childId, req.body);

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
