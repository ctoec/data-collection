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
      const { name, sites, fundingSpaces } = req.body;
      await controller.createOrganization(name, sites, fundingSpaces);
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
