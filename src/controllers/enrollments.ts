import { removeDeletedElements } from '../utils/filterSoftRemoved';
import { getManager, In, IsNull } from 'typeorm';
import {
  ChangeFundingRequest,
  WithdrawRequest,
} from '../../client/src/shared/payloads';
import { Enrollment, Funding, User } from '../entity';
import { NotFoundError, BadRequestError } from '../middleware/error/errors';
import { getCurrentFunding } from '../utils/getCurrentFunding';

export const getEnrollment = async (
  id: number | string,
  user: User,
  withFundings?: boolean
) => {
  const enrollment = await getManager().findOne(Enrollment, {
    where: [
      { siteId: In(user.siteIds), id },
      { siteId: IsNull(), id },
    ],
    relations: withFundings ? ['fundings'] : undefined,
  });

  if (!enrollment) throw new NotFoundError();
  return enrollment;
};

export const getFunding = async (
  enrollmentId: number | string,
  fundingId: number | string,
  user: User
) => {
  // To assert that the user has access to the enrollment
  await getEnrollment(enrollmentId, user);
  const funding = await getManager().findOne(Funding, fundingId, {
    where: { enrollmentId },
  });

  if (!funding) throw new NotFoundError();

  return funding;
};

export const changeFunding = async (
  id: number,
  user: User,
  changeFundingData: ChangeFundingRequest
) => {

	if(!changeFundingData.newFunding.startDate) {
		throw new BadRequestError("New funding start date is required.")
	}
  const enrollment = await getEnrollment(id, user, true);
  enrollment.fundings = removeDeletedElements(enrollment.fundings);

  return getManager().transaction(async (tManager) => {
    // Update current funding, if exists
    const currentFunding = getCurrentFunding({ enrollment });
    if (currentFunding) {
      // Update current funding last reporting period
      currentFunding.endDate = changeFundingData.oldFunding?.endDate ?? 
				changeFundingData.newFunding.startDate?.clone().add(-1, 'day');
      await tManager.save(currentFunding);
    }

    // Create new funding, if exists
    if (changeFundingData.newFunding) {
      const funding = tManager.create(Funding, {
        ...changeFundingData.newFunding,
        enrollment,
      });
      await tManager.save(funding);
    }
  });
};

export const withdraw = async (
  id: number,
  user: User,
  withdrawData: WithdrawRequest
) => {
	if (!withdrawData.exit || !withdrawData.exitReason) {
		throw new BadRequestError("Exit date and exit reason are required");
	} 

  const enrollment = await getEnrollment(id, user, true);
  enrollment.fundings = removeDeletedElements(enrollment.fundings || []);

  return getManager().transaction(async (tManager) => {
    const currentFunding = getCurrentFunding({ enrollment });
    if (currentFunding) {
      currentFunding.endDate = withdrawData.funding?.endDate ??
				withdrawData.exit.clone().add(-1, 'days');
      await tManager.save(currentFunding);
    }

    enrollment.exit = withdrawData.exit;
    enrollment.exitReason = withdrawData.exitReason;
    await tManager.save(enrollment);
  });
};
