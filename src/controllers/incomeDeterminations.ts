import { IncomeDetermination } from '../entity';
import { Family } from '../entity';
import { NotFoundError } from '../middleware/error/errors';
import { getManager, In } from 'typeorm';

export const getDetermination = async (
  famId: number,
  detId: number,
  readOrgIds: string[]
) => {
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
