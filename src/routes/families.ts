import express, { Request, Response } from 'express';
import { getManager, In } from 'typeorm';
import { Family, IncomeDetermination } from '../entity';
import { passAsyncError } from '../middleware/error/passAsyncError';
import { getReadAccessibleOrgIds } from '../utils/getReadAccessibleOrgIds';
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
  })
);

/**
 * /families/:familyId/income-determination/:determinationId PUT
 */
familyRouter.put(
  '/:familyId/income-determinations/:determinationId',
  passAsyncError(async (req: Request, res: Response) => {
    try {
      const famId = parseInt(req.params['familyId']);
      const detId = parseInt(req.params['determinationId']);
      const readOrgIds = await getReadAccessibleOrgIds(req.user);

      // Verify the user has access to the determination via
      // family lookup--as in enrollment/funding controller
      const family = await getManager().findOne(Family, famId, {
        relations: ['organization'],
        where: {
          organization: { id: In(readOrgIds) },
        },
      });
      if (!family) throw new NotFoundError();

      // User must be authorized, so get the income det
      const detToModify = await getManager().findOne(
        IncomeDetermination,
        detId,
        {
          where: { familyId: famId },
        }
      );
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

/**
 * /families/:familyId/income-determination POST
 */
familyRouter.post(
  '/:familyId/income-determinations',
  passAsyncError(async (req: Request, res: Response) => {
    try {
      const famId = parseInt(req.params['familyId']);
      const readOrgIds = await getReadAccessibleOrgIds(req.user);
      const family = await getManager().findOne(
        Family,
        { id: famId },
        {
          where: { organization: { id: In(readOrgIds) } },
        }
      );

      const determination = await getManager().save(
        getManager().create(IncomeDetermination, {
          ...req.body,
          family,
        })
      );

      res.status(201).send({ id: determination.id });
    } catch (err) {
      if (err instanceof ApiError) throw err;
      console.log('Error creating new income determination: ', err);
      throw new BadRequestError('Redetermination not saved');
    }
  })
);

familyRouter.delete(
  '/:familyId/income-determinations/:determinationId',
  passAsyncError(async (req: Request, res: Response) => {
    try {
      const detId = parseInt(req.params['determinationId']);
      const det = await getManager().find(IncomeDetermination, { id: detId });
      await getManager().softRemove(det);
      res.sendStatus(200);
    } catch (err) {
      if (err instanceof ApiError) throw err;
      console.log('Error deleting requested determination: ', err);
      throw new BadRequestError('Determination not deleted');
    }
  })
);
