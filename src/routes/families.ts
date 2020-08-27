import express, { Request, Response } from 'express';
import { getManager } from 'typeorm';
import { Family } from '../entity';
import { passAsyncError } from '../middleware/error/passAsyncError';
import { BadRequestError } from '../middleware/error/errors';

export const familyRouter = express.Router();

/*
 * /families/:familyId PUT
 */
familyRouter.put(
  '/:familyId',
  passAsyncError(async (req: Request, res: Response) => {
    const famId = req.params['familyId'];
    try {
      const newFam = req.body;
      await getManager().update(Family, { id: famId }, newFam);
      res.status(200).json(newFam.id);
    } catch (err) {
      console.log('Error saving changes to family: ', err);
      res.status(400).json('Could not update family address information');
      throw new BadRequestError('Enrollment not saved');
    }
  })
);
