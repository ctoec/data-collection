import { Request } from 'express';
import { IncomeDetermination } from '../entity';
import { Family } from '../entity';
import { NotFoundError } from '../middleware/error/errors';
import { getManager, In } from 'typeorm';
import { getReadAccessibleOrgIds } from '../utils/getReadAccessibleOrgIds';

export const getDetermination = async (req: Request) => {
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
  const det = await getManager().findOne(IncomeDetermination, detId, {
    where: { familyId: famId },
  });
  if (!det) throw new NotFoundError();
  return det;
};
