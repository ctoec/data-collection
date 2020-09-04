import express, { Request, Response } from 'express';
import { getManager } from 'typeorm';
import { Family, IncomeDetermination } from '../entity';
import { passAsyncError } from '../middleware/error/passAsyncError';
import {
  BadRequestError,
  NotFoundError,
  ApiError,
} from '../middleware/error/errors';

export const familyRouter = express.Router();

/*
 * /families/:familyId PUT
 */
familyRouter.put(
  '/:familyId',
  passAsyncError(async (req: Request, res: Response) => {
    const familyId = req.params['familyId'];
    try {
      const family = await getManager().findOne(Family, familyId);
      if (!family) throw new NotFoundError();

      await getManager().save(getManager().merge(Family, family, req.body));
      res.sendStatus(200);
    } catch (err) {
      if (err instanceof ApiError) throw err;

      console.log('Error saving changes to family: ', err);
      throw new BadRequestError('Family not saved');
    }
  })
);

/**
 * /families/:familyId/income-determination/:determinationId PUT
 */
familyRouter.put(
  '/:familyId/income-determination/:determinationId',
  passAsyncError(async (req: Request, res: Response) => {
    try {
      const famId = parseInt(req.params['familyId']);
      const detId = parseInt(req.params['determinationId']);

      const detToModify = await getManager().findOne(IncomeDetermination, {
        id: detId,
        familyId: famId,
      });
      if (!detToModify) throw new NotFoundError();

      const mergedEntity = getManager().merge(
        IncomeDetermination,
        detToModify,
        req.body
      );

      await getManager().save(IncomeDetermination, mergedEntity);
      res.sendStatus(200);
    } catch (err) {
      if (err instanceof ApiError) throw err;
      console.log('Error saving changes to income determination: ', err);
      throw new BadRequestError('Edited determination not saved');
    }
  })
);

familyRouter.post(
  '/:familyId/income-determination',
  passAsyncError(async (req: Request, res: Response) => {
    try {
      const famId = parseInt(req.params['familyId']);
      const family = await getManager().findOne(Family, { id: famId });

      const determination = getManager().create(IncomeDetermination, {
        ...req.body,
        family,
      });

      await getManager().save(determination);
      res.sendStatus(200);
    } catch (err) {
      if (err instanceof ApiError) throw err;
      console.log('Error creating new income determination: ', err);
      throw new BadRequestError('Redetermination not saved');
    }
  })
);
