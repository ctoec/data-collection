import { UpdateMetaData } from '../../../../entity/embeddedColumns/UpdateMetaData';
import { EntityManager } from 'typeorm';
import { User, Child, Enrollment, Funding } from '../../../../entity';

/**
 * SQL Server driver has an upper limit of 2100 parameters per query.
 * Using object keys in the entity has proxy for number of parameters
 * that'll end up in the query (couldn't find any better way to do this
 * from typeORM), chunk the inserts into batches that will have <2000
 * parameters per batch.
 * @param transaction
 * @param entities
 */
export async function doBatchSave<T>(
  user: User,
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

export async function batchSave(
  user: User,
  transaction: EntityManager,
  children: Child[]
) {
  // Upsert family entities
  const upsertedFamilies = await doBatchSave(
    user,
    transaction,
    children.map((c) => c.family)
  );

  // Insert new income determination entities
  const incomeDetsForUpsert = children.reduce((newIncomeDets, child, idx) => {
    const newIncomeDet = child.family.incomeDeterminations
      ?.filter((det) => !det.id)
      .forEach((det) => {
        det.familyId = upsertedFamilies[idx].id;
        det.family = undefined;
        newIncomeDets.push(det);
      });

    return newIncomeDets;
  }, []);
  await doBatchSave(user, transaction, incomeDetsForUpsert);

  // Upsert child entities
  const upsertedChildren = await doBatchSave(
    user,
    transaction,
    children.map((c, idx) => {
      c.familyId = upsertedFamilies[idx].id;
      c.family = undefined;
      return transaction.create(Child, c);
    })
  );

  // Upsert enrollment entities with updated child references and removed funding references
  const fundingsByEnrollment: Funding[][] = [];
  const enrollmentsForUpsert: Enrollment[] = [];
  children.forEach((child, idx) => {
    child.enrollments?.map((e) => {
      const enrollmentForUpsert = transaction.create(Enrollment, e);
      enrollmentForUpsert.fundings = undefined;
      fundingsByEnrollment.push(e.fundings);
      enrollmentForUpsert.child = undefined;
      enrollmentForUpsert.childId = upsertedChildren[idx].id;
      enrollmentsForUpsert.push(enrollmentForUpsert);
    });
  });
  const upsertedEnrollments = await doBatchSave(
    user,
    transaction,
    enrollmentsForUpsert
  );

  // Upsert funding entities with updated enrollment references
  const fundingsForUpsert = fundingsByEnrollment.reduce(
    (flatFundings, enrollmentFundings, idx) => {
      enrollmentFundings?.forEach((f) => {
        f.enrollment = undefined;
        f.enrollmentId = upsertedEnrollments[idx].id;
        flatFundings.push(f);
      });
      return flatFundings;
    },
    []
  );
  await doBatchSave(user, transaction, fundingsForUpsert);
}
