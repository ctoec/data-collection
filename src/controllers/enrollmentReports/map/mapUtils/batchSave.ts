import { UpdateMetaData } from '../../../../entity/embeddedColumns/UpdateMetaData';
import { EntityManager } from 'typeorm';
import {
  User,
  Family,
  IncomeDetermination,
  Child,
  Enrollment,
  Funding,
} from '../../../../entity';
import { EnrollmentReportUpdate } from '../uploadTypes';
import { ChangeTag } from '../../../../../client/src/shared/models';

/**
 * SQL Server driver has an upper limit of 2100 parameters per query.
 * Using object keys in the entity has proxy for number of parameters
 * that'll end up in the query (couldn't find any better way to do this
 * from typeORM), chunk the inserts into batches that will have <2000
 * parameters per batch.
 * @param transaction
 * @param entities
 */
export async function doBatchedInsert<T>(
  user,
  transaction: EntityManager,
  entities: T[]
) {
  if (entities.length === 0) return [];

  const parametersPerEntity = Object.keys(entities[0]).length;
  const batchSize = Math.floor(2000 / parametersPerEntity);
  const createdData: any[] = [];
  for (let b = 0; b < entities.length; b += batchSize) {
    const batch = entities.slice(b, b + batchSize);
    const batchEntities = await transaction.save<T>(
      batch.map((entity: any) => {
        entity.updateMetaData = { author: user } as UpdateMetaData;
        return entity;
      })
    );
    createdData.push(...batchEntities);
  }

  return createdData;
}

/**
 * Create entities in the DB associated with any new child records
 * that come in on a spreadsheet from an upload. Also registers
 * all newly created children in the map result data structure.
 * @param user
 * @param transaction
 * @param children
 * @param mapResult
 */
export async function batchCreateNewChildren(
  user: User,
  transaction: EntityManager,
  children: Child[],
  mapResult: EnrollmentReportUpdate
) {
  // Create families
  const createdFamilies = await doBatchedInsert<Family>(
    user,
    transaction,
    children.map((child) => child.family)
  );

  // Create dets with updated family references
  await doBatchedInsert<IncomeDetermination>(
    user,
    transaction,
    children.map((child, idx) => {
      const det = child.family.incomeDeterminations[0];
      det.family = undefined;
      det.familyId = createdFamilies[idx].id;
      return det;
    })
  );

  // Create children with updated family references
  const createdChildren = await doBatchedInsert<Child>(
    user,
    transaction,
    children.map((child, idx) => {
      child.family = createdFamilies[idx];
      return child;
    })
  );

  // Create enrollments and fundings with updated child references
  // Cascade create does not work for entities with auto-incrementing pks,
  // so we have to create all enrollments, then create all fundings for the enrollments
  const fundings: Funding[][] = [];
  const enrollments = children.reduce((flatEnrollments, child, childIdx) => {
    child.enrollments.forEach((enrollment) => {
      // Add child id and remove child reference
      enrollment.child = undefined;
      enrollment.childId = createdChildren[childIdx].id;

      // Grab fundings to save later, and remove reference
      fundings.push(enrollment.fundings);
      enrollment.fundings = undefined;

      // Add processed enrollment to array
      flatEnrollments.push(enrollment);
    });
    return flatEnrollments;
  }, []) as Enrollment[];

  const createdEnrollments = await doBatchedInsert(
    user,
    transaction,
    enrollments
  );

  const createdFundings = await doBatchedInsert(
    user,
    transaction,
    fundings.reduce((flatFundings, fundings, enrollmentIdx) => {
      fundings?.forEach((funding) => {
        funding.enrollment = undefined;
        funding.enrollmentId = createdEnrollments[enrollmentIdx].id;
        flatFundings.push(funding);
      });
      return flatFundings;
    }, [])
  );

  // Compose entities from created in DB and return
  createdChildren.forEach((child, idx) => {
    child.family = createdFamilies[idx];
    child.enrollments = createdEnrollments.filter((enrollment) => {
      const match = enrollment.childId === child.id;
      if (match) {
        enrollment.fundings = createdFundings.filter(
          (funding) => funding.enrollmentId === enrollment.id
        );
      }
      return match;
    });
  });
  createdChildren.forEach((c) => {
    mapResult.changeTagsForChildren.push([ChangeTag.NewRecord]);
    mapResult.children.push(c);
  });
}

/**
 * Perform batched saving on all entities that a user updated
 * using the batch update spreadsheet functionality.
 */
export async function batchSaveUpdatedEntities(
  user: User,
  transaction: EntityManager,
  familiesToUpdate: Family[],
  determinationsToUpdate: IncomeDetermination[],
  childrenToUpdate: Child[],
  enrollmentsToUpdate: Enrollment[],
  fundingsToUpdate: Funding[],
  mapResult: EnrollmentReportUpdate
) {
  await doBatchedInsert<Family>(user, transaction, familiesToUpdate);
  await doBatchedInsert<IncomeDetermination>(
    user,
    transaction,
    determinationsToUpdate
  );
  await doBatchedInsert<Child>(user, transaction, childrenToUpdate);

  // Same problem with creating cascading PKs that's described in map,
  // so we make the entities and then re-connect their references
  const updatedEnrollments = await doBatchedInsert<Enrollment>(
    user,
    transaction,
    enrollmentsToUpdate.map((e) => {
      if (!e.id) {
        e.fundings = undefined;
      }
      return e;
    })
  );

  // Use this to track which enrollment fundings are associated with
  let enrollmentIdx = 0;

  const updatedFundings = await doBatchedInsert<Funding>(
    user,
    transaction,
    fundingsToUpdate.map((f) => {
      if (!f.enrollmentId) {
        f.enrollment = undefined;
        f.enrollmentId = updatedEnrollments[enrollmentIdx].id;
        enrollmentIdx += 1;
      }
      return f;
    })
  );

  // Now reconnect all the references between entities and fundings
  const updatedEnrollmentsWithFundings = updatedEnrollments.map(
    (e: Enrollment) => {
      if (!e.fundings) e.fundings = [];
      e.fundings = e.fundings.concat(
        updatedFundings.filter(
          (f: Funding) =>
            f.enrollmentId === e.id && !e.fundings.some((f: Funding) => f.id)
        )
      );
      return e;
    }
  );
  mapResult.children.forEach((c) => {
    c.enrollments = c.enrollments.concat(
      updatedEnrollmentsWithFundings.filter((e: Enrollment) => {
        e.childId === c.id &&
          !c.enrollments.some(
            (existingEnrollment) => e.id === existingEnrollment.id
          );
      })
    );
  });
}
