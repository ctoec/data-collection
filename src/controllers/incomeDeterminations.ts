import { Request, Response } from 'express';
import { IncomeDetermination } from '../entity';
import { Family } from '../entity';
import {
  ApiError,
  BadRequestError,
  NotFoundError,
} from '../middleware/error/errors';
import { getManager, In } from 'typeorm';
import { getReadAccessibleOrgIds } from '../utils/getReadAccessibleOrgIds';
import { passAsyncError } from '../middleware/error/passAsyncError';

export {
  createIncomeDetermination,
  updateIncomeDetermination,
  deleteIncomeDetermination,
};

const createIncomeDetermination = passAsyncError(
  async (req: Request, res: Response) => {
    try {
      const famId: number = parseInt(req.params['familyId']);
      const readOrgIds: string[] = await getReadAccessibleOrgIds(req.user);
      const family: Family = await getManager().findOne(
        Family,
        { id: famId },
        {
          where: { organization: { id: In(readOrgIds) } },
        }
      );

      const determination: IncomeDetermination = await getManager().save(
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
  }
);

const updateIncomeDetermination = passAsyncError(
  async (req: Request, res: Response) => {
    try {
      const detToModify: IncomeDetermination = await getDetermination(req);
      const mergedEntity: IncomeDetermination = getManager().merge(
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
  }
);

const deleteIncomeDetermination = passAsyncError(
  async (req: Request, res: Response) => {
    try {
      const det: IncomeDetermination = await getDetermination(req);
      await getManager().softRemove(det);
      res.sendStatus(200);
    } catch (err) {
      if (err instanceof ApiError) throw err;
      console.log('Error deleting requested determination: ', err);
      throw new BadRequestError('Determination not deleted');
    }
  }
);

////////////////////////////////////////////////////////////

async function getDetermination(req: Request) {
  const famId: number = parseInt(req.params['familyId']);
  const detId: number = parseInt(req.params['determinationId']);
  const readOrgIds: string[] = await getReadAccessibleOrgIds(req.user);

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
  const det = await getManager().findOne(IncomeDetermination, detId, {
    where: { familyId: famId },
  });
  if (!det) throw new NotFoundError();
  return det;
}
