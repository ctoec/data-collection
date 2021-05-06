import express from 'express';
import { ForbiddenError } from '../middleware/error/errors';
import { passAsyncError } from '../middleware/error/passAsyncError';
import * as controller from '../controllers/organizations';

export const organizationsRouter = express.Router();

organizationsRouter.get(
  '/',
  passAsyncError(async (req, res) => {
    const user = req.user;
    if (!user.isAdmin) {
      throw new ForbiddenError();
    }
    const organizations = await controller.getOrganizations();

    res.send(organizations);
  })
);
