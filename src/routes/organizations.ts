import express, { Request, Response } from 'express';
import * as controller from '../controllers/organizations';
import { passAsyncError } from '../middleware/error/passAsyncError';
import {
  ApiError,
  ForbiddenError,
  InternalServerError,
} from '../middleware/error/errors';

export const organizationsRouter = express.Router();

organizationsRouter.post(
  '/',
  passAsyncError(async (req: Request, res: Response) => {
    try {
      if (!req.user.isAdmin) throw new ForbiddenError();
      const { name, sites } = req.body;
      await controller.createOrganization(name, sites);
      res.sendStatus(201);
    } catch (err) {
      if (err instanceof ApiError) throw err;
      console.error('Error creating organization: ', err);
      throw new InternalServerError('New organization not created.');
    }
  })
);

organizationsRouter.get(
  '/',
  passAsyncError(async (req, res) => {
    const user = req.user;
    if (!user.isAdmin) throw new ForbiddenError();
    const organizations = await controller.getOrganizations();
    res.send(organizations);
  })
);

organizationsRouter.get(
  '/by-name/:name',
  passAsyncError(async (req, res) => {
    try {
      const name = req.params['name'];
      const orgs = await controller.getOrgsByName(name);
      res.send(orgs);
    } catch (err) {
      if (err instanceof ApiError) throw err;
      console.error('Error finding user by email address: ', err);
      throw new InternalServerError(
        'Unable to find users for create organization.'
      );
    }
  })
);
