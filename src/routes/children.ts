import express from 'express';
import { passAsyncError } from '../middleware/error/passAsyncError';
import {
  NotFoundError,
  BadRequestError,
  ApiError,
} from '../middleware/error/errors';
import * as controller from '../controllers/children';
import { parseQueryString } from '../utils/parseQueryString';
import moment, { Moment } from 'moment';
import { ListChildReponse } from '../../client/src/shared/payloads';
import { Child } from 'client/src/shared/models';

export const childrenRouter = express.Router();

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
      forceArray: true,
    }) as string[];
    const count = parseQueryString(req, 'count');
    const missingInfo = parseQueryString(req, 'missing-info') as string;
    const activeMonth = parseQueryString(req, 'month', {
      post: (monthStr) => moment.utc(monthStr, 'MMM-YYYY'),
    }) as Moment;
    const skip = parseQueryString(req, 'skip', { post: parseInt }) as number;
    const take = parseQueryString(req, 'take', { post: parseInt }) as number;
    const siteMap = parseQueryString(req, 'siteMap');

    if (count && count === 'true') {
      const count = await controller.getCount(req.user);
      res.send({ count });
      return;
    }

    const response: ListChildReponse = await controller.getChildren(req.user, {
      organizationIds,
      missingInfoOnly: missingInfo === 'true',
      activeMonth,
      skip,
      take,
    });

    // Send back a nice pretty display structure for the user's home
    // page if they've submitted their data
    if (siteMap && siteMap === 'true') {
      const siteCountMap = await controller.getSiteCountMap(response.children);
      res.send({ siteCountMap });
    } else {
      res.send(response);
    }
  })
);

/**
 * /children/missing-info GET
 *
 * Returns all children the authed user has access to that are missing information.
 */
childrenRouter.get(
  '/missing-info',
  passAsyncError(async (req, res) => {
    const organizationIds = parseQueryString(req, 'organizationId', {
      forceArray: true,
    }) as string[];

    res.send(
      await controller.getChildrenWithMissingInfo(req.user, organizationIds)
    );
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
