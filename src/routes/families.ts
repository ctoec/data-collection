import express, { Request, Response } from 'express';
import { getManager } from 'typeorm';
import { Child, Family } from '../entity';
import { passAsyncError } from '../middleware/error/passAsyncError';
import { BadRequestError } from '../middleware/error/errors';

export const familyRouter = express.Router();

/*
 * /families/:familyId PUT
 */
familyRouter.put(
  '/:familyId',
  passAsyncError(async (req: Request, res: Response) => {
    try {
      const newFam = req.body;
      const updatedFam = await getManager().preload(Family, newFam);
      if (!updatedFam) {
        throw new BadRequestError('Could not initialize family field updates');
      }
      const response = await getManager().save(updatedFam);
      res.status(200).json(newFam.id);
    } catch (err) {
      console.log('Error saving changes to family: ', err);
      throw new BadRequestError('Enrollment not saved');
    }
  })
);
