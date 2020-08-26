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
      const recordId = req.body['recordId'];
      const newFam = req.body['edits'];

      // The id of the parent child object contains the unique
      // database identifier; use it to query
      var record = await getManager().findOne(Child, {
        where: { id: recordId, familyId: newFam.id },
        relations: [
          'family',
          'family.incomeDeterminations',
          'enrollments.fundings',
          'enrollments',
        ],
      });

      // Overwrite just the family attribute and use save to
      // perform a partial update and retrieve the new record
      record.family = newFam;
      const response = await getManager().save(record);
      res.send(response);
    } catch (err) {
      console.log('Error saving changes to family: ', err);
      throw new BadRequestError('Enrollment not saved');
    }
  })
);
