import express, { Request, Response } from 'express';
import { Organization } from '../entity';
import { getManager } from 'typeorm';
import * as controller from '../controllers/organizations';
import { passAsyncError } from '../middleware/error/passAsyncError';
import { ApiError, BadRequestError, ForbiddenError, ResourceConflictError } from '../middleware/error/errors';

export const organizationsRouter = express.Router();

organizationsRouter.post(
  '/',
  passAsyncError(async (req: Request, res: Response) => {
    try {
      const { name } = req.body;
      const nameExists = await controller.doesOrgNameExist(name);
      if (nameExists) {
        throw new ResourceConflictError('Name already exists.');
      }
      else {
        const newOrg = await getManager().save(
          getManager().create(Organization, { providerName: name })
        );
        res.status(201).send({ id: newOrg.id });
      }

    } catch (err) {
      if (err instanceof ApiError) throw err;
      console.error('Error creating organization: ', err);
      throw new BadRequestError('New organization not created.');
    }
  })
)

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
