import { getManager, EntityManager } from 'typeorm';
import idx from 'idx';
import { ChangeEnrollmentRequest } from '../../../client/src/shared/payloads';
import {
  ExitReason,
  Enrollment as EnrollmentInterface,
} from '../../../client/src/shared/models';
import { getChildById } from './get';
import { NotFoundError, BadRequestError } from '../../middleware/error/errors';
import {
  User,
  Funding,
  Enrollment,
  Site,
  FundingSpace,
  Child,
} from '../../entity';
import { UpdateMetaData } from '../../entity/embeddedColumns/UpdateMetaData';
import { getCurrentFunding } from '../../utils/getCurrentFunding';

/**
 * Attempts to create a new enrollment, and optionally funding,
 * for the child with `id`.
 *
 * If previous enrollment and optionally funding exist, attempts to
 * 'end' them by updating with exit date and last reporting period.
 *
 * If any of these operations fail, the entire transaction is rolled
 * back and an error is thrown.
 * @param id
 * @param changeEnrollmentData
 */
export const changeEnrollment = async (
  id: string,
  changeEnrollmentData: ChangeEnrollmentRequest,
  user: User
) => {
  console.debug('changeEnrollment() invoked');

  const child = await getChildById(id, user);

  if (!child) throw new NotFoundError();
  console.debug(
    `Matching child found for ${id}.  Initiating enrollment change...`
  );

  if (!changeEnrollmentData.newEnrollment.entry) {
    throw new BadRequestError('New enrollment entry date is required.');
  }
  // Get current enrollment
  return getManager().transaction(async (tManager) => {
    // Update current enrollment, if exists
    const currentEnrollment = (child.enrollments || []).find((e) => !e.exit);

    if (currentEnrollment) {
      const currentFunding = getCurrentFunding({
        enrollment: currentEnrollment,
      });
      currentEnrollment.exit =
        changeEnrollmentData.oldEnrollment?.exitDate ??
        changeEnrollmentData.newEnrollment.entry?.clone().add(-1, 'day');

      // Update current funding, if exists
      if (currentFunding) {
        currentFunding.endDate =
          changeEnrollmentData?.oldEnrollment?.funding?.endDate ??
          currentEnrollment.exit;

        await tManager.save(Funding, {
          ...currentFunding,
          updateMetaData: { author: user },
        });
      }

      // Update current enrollment exitReason
      currentEnrollment.exitReason =
        currentEnrollment.ageGroup !==
        changeEnrollmentData.newEnrollment.ageGroup
          ? ExitReason.AgedOut
          : ExitReason.MovedWithinProgram;

      await tManager.save(Enrollment, {
        ...currentEnrollment,
        updateMetaData: { author: user },
      });
    }

    await createNewEnrollment(
      changeEnrollmentData.newEnrollment,
      child,
      tManager,
      user
    );
  });
};

async function createNewEnrollment(
  newEnrollment: EnrollmentInterface,
  child: Child,
  tManager: EntityManager,
  user: User
): Promise<void> {
  console.debug('createNewEnrollment() invoked');

  if (newEnrollment.site) {
    console.debug(
      `Looking up matching enrollment site for ${newEnrollment.site.id}`
    );
    const matchingSite = await tManager.findOne(Site, newEnrollment.site.id);

    if (!matchingSite || matchingSite.organizationId !== child.organizationId) {
      console.error(
        'User either provided an unknown site or a site this childs org does not have permission for'
      );
      throw new Error('Invalid site supplied for enrollment');
    }
  }

  let enrollment = {
    ...newEnrollment,
    // Rather than creating a funding here, use the logic below to create it
    // so that we may take advantage of the funding space check
    fundings: undefined,
    child,
    updateMetaData: { author: user } as UpdateMetaData,
  } as Enrollment;
  enrollment = tManager.create(Enrollment, enrollment);
  enrollment = await tManager.save(enrollment);

  // Create new funding, if exists
  if (newEnrollment.fundings && newEnrollment.fundings.length) {
    const matchingFundingSpace: FundingSpace = await tManager.findOne(
      FundingSpace,
      newEnrollment.fundings[0]?.fundingSpace?.id,
      { where: { organizationId: child.organizationId } }
    );

    if (!matchingFundingSpace) {
      console.error(
        'User either provided an unknown funding space or a funding space this childs org does not have permission for'
      );
      throw new Error('Invalid funding space supplied for enrollment');
    }

    const funding = tManager.create(Funding, {
      enrollment,
      fundingSpace: idx(newEnrollment, (_) => _.fundings[0].fundingSpace),
      startDate: idx(newEnrollment, (_) => _.fundings[0].startDate),
    });
    await tManager.save(Funding, {
      ...funding,
      updateMetaData: { author: user },
    });
  }
}
