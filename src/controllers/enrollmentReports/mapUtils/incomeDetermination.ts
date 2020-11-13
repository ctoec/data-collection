import { EntityManager } from 'typeorm';
import { Family, IncomeDetermination, User } from '../../../entity';
import { EnrollmentReportRow } from '../../../template';

/**
 * Create IncomeDetermination object from FlattenedEnrollment source.
 * @param source
 */
export const mapIncomeDetermination = (
  transaction: EntityManager,
  source: EnrollmentReportRow,
  family: Family,
  user: User,
  save: boolean
) => {
  // Only attempt to create an income determination if the user supplied any
  // of the necessary data points
  if (source.numberOfPeople || source.income || source.determinationDate) {
    let incomeDetermination = {
      // Cast empty strings to undefined to avoid DB write failures
      numberOfPeople: source.numberOfPeople || undefined,
      // Need to accept 0 as valid income, so use forcible number conversion
      // to check if the result is a valid number
      income: isNaN(source.income) ? undefined : source.income,
      determinationDate: source.determinationDate,
      familyId: family.id,
    } as IncomeDetermination;

    if (save) {
      incomeDetermination = transaction.create(IncomeDetermination, {
        ...incomeDetermination,
        updateMetaData: {
          author: user,
        },
      });
      return transaction.save(incomeDetermination);
    }

    return incomeDetermination;
  }
};
