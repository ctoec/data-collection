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
  let incomeDetermination: IncomeDetermination;

  // If the user supplied any of the income determination value fields,
  // create the det and overwrite not disclosed to false
  if (source.numberOfPeople || source.income || source.determinationDate) {
    incomeDetermination = {
      // Cast empty strings to undefined to avoid DB write failures
      numberOfPeople: source.numberOfPeople || undefined,
      // Need to accept 0 as valid income, so use forcible number conversion
      // to check if the result is a valid number
      income: isNaN(source.income) ? undefined : source.income,
      determinationDate: source.determinationDate,
      incomeNotDisclosed: false,
      familyId: family.id,
    } as IncomeDetermination;
  }

  // If there are no provided values and user deliberately checked not
  // disclosed, then make an undisclosed income determination
  else if (source.incomeNotDisclosed) {
    incomeDetermination = {
      incomeNotDisclosed: true,
      familyId: family.id,
    } as IncomeDetermination;
  }

  if (incomeDetermination) {
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
