import { UpdateMetaData } from '../../../entity/embeddedColumns/UpdateMetaData';
import { EntityManager, EntityTarget } from 'typeorm';
import {
  User,
  Child,
  Enrollment,
  Family,
  Funding,
  IncomeDetermination,
} from '../../../entity';

/**
 * SQL Server driver has an upper limit of 2100 parameters per query.
 * Using object keys in the entity has proxy for number of parameters
 * that'll end up in the query (couldn't find any better way to do this
 * from typeORM), chunk the inserts into batches that will have <2000
 * parameters per batch.
 * @param user
 * @param transaction
 * @param entityTarget
 * @param entities
 */
export async function doBatchSave<T>(
  user: User,
  transaction: EntityManager,
  entityTarget: EntityTarget<T>,
  entities: T[]
) {
  if (entities.length === 0) return [];

  const parametersPerEntity = Object.keys(entities[0]).length;
  const batchSize = Math.floor(2000 / parametersPerEntity);
  const createdData: T[] = [];
  for (let b = 0; b < entities.length; b += batchSize) {
    const batch = entities.slice(b, b + batchSize);
    const batchEntities = await transaction.save<T, T>(
      entityTarget,
      batch.map((entity): T & { updateMetaData: UpdateMetaData } => ({
        ...entity,
        updateMetaData: { author: user } as UpdateMetaData,
      }))
    );
    createdData.push(...batchEntities);
  }

  return createdData;
}

/**
 * Decomposes child graphs into constituent DB entities and writes
 * changes to DB.
 * Entities must be saved in order so that any newly created entity
 * can be referenced by id in dependent entities. I.e. families must
 * be upserted before income determination / child can be created,
 * because income det and child need to reference familyId.
 *
 * @param user
 * @param transaction
 * @param children
 */
export async function batchUpsertMappedEntities(
  user: User,
  transaction: EntityManager,
  children: Child[]
) {
  // Upsert family entities
  const upsertedFamilies = await doBatchSave(
    user,
    transaction,
    Family,
    children.map((c) => c.family)
  );

  // Update familyId references and
  // unsert new income determination entities
  // (Editing income determinations is not supported at present)
  const incomeDetsForUpsert = children.reduce((newIncomeDets, child, idx) => {
    child.family.incomeDeterminations.forEach((det) => {
      det.familyId = upsertedFamilies[idx].id;
      det.family = undefined; // For typeorm
      newIncomeDets.push(det);
    });

    return newIncomeDets;
  }, []);
  await doBatchSave(
    user,
    transaction,
    IncomeDetermination,
    incomeDetsForUpsert
  );

  // Upsert child entities
  const upsertedChildren = await doBatchSave(
    user,
    transaction,
    Child,
    children.map((c, idx) => {
      c.familyId = upsertedFamilies[idx].id;
      c.family = undefined; // For typeorm
      return transaction.create(Child, c);
    })
  );

  // Update childId references and
  // remove funding references and
  // map fundings into enrollment-indexed array
  // so they can be upserted with updated enrollment references and
  // upsert enrollment entities with updated
  const fundingsByEnrollment: Funding[][] = [];
  const upsertedEnrollments = await doBatchSave(
    user,
    transaction,
    Enrollment,
    children.reduce(
      (enrollments, child, idx) => [
        ...enrollments,
        ...child.enrollments?.map((e) => {
          fundingsByEnrollment.push(e.fundings);

          return {
            ...e,
            fundings: undefined, // For typeorm
            child: undefined, // For typeorm
            childId: upsertedChildren[idx].id,
          };
        }),
      ],
      []
    )
  );

  // Update enrollment references and
  // upsert funding entities
  const fundingsForUpsert = fundingsByEnrollment.reduce(
    (flatFundings, enrollmentFundings, idx) => {
      enrollmentFundings?.forEach((f) => {
        f.enrollment = undefined; // For typeorm
        f.enrollmentId = upsertedEnrollments[idx].id;
        flatFundings.push(f);
      });
      return flatFundings;
    },
    []
  );
  await doBatchSave(user, transaction, Funding, fundingsForUpsert);
}
