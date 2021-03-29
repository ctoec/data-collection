import { Request, Response } from 'express';
import { Family } from '../entity';
import {
  ApiError,
  BadRequestError,
  NotFoundError,
} from '../middleware/error/errors';
import { passAsyncError } from '../middleware/error/passAsyncError';
import { getReadAccessibleOrgIds } from '../utils/getReadAccessibleOrgIds';
import { getManager, In } from 'typeorm';

export const updateFamily = passAsyncError(
  async (req: Request, res: Response) => {
    const familyId: string = req.params['familyId'];

    try {
      const readOrgIds = await getReadAccessibleOrgIds(req.user);
      const family = await getManager().findOne(Family, familyId, {
        where: { organization: { id: In(readOrgIds) } },
      });
      if (!family) throw new NotFoundError();

      await getManager().save(getManager().merge(Family, family, req.body));
      res.sendStatus(200);
    } catch (err) {
      if (err instanceof ApiError) throw err;

      console.log('Error saving changes to family: ', err);
      throw new BadRequestError('Family not saved');
    }
  }
);
