import express, { Request, Response } from 'express';
import { Organization } from '../entity';
import { getManager } from 'typeorm';
import { doesOrgNameExist } from '../controllers/organizations';
import { passAsyncError } from '../middleware/error/passAsyncError';
import { ApiError, BadRequestError } from '../middleware/error/errors';

export const organizationsRouter = express.Router();

organizationsRouter.post(
  '/',
  passAsyncError(async (req: Request, res: Response) => {
    try {
      const { name } = req.body;
      const nameExists = await doesOrgNameExist(name);
      if (nameExists) {
        res.status(200).send({ id: undefined });
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