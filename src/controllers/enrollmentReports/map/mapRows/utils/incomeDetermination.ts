import { Family, IncomeDetermination } from '../../../../../entity';
import { EnrollmentReportRow } from '../../../../../template';
import { getManager } from 'typeorm';

/**
 * Create IncomeDetermination object from FlattenedEnrollment source.
 * @param source
 */
export const mapIncomeDetermination = (
  source: EnrollmentReportRow,
  family: Family
) => {
  return getManager().create(IncomeDetermination, {
    numberOfPeople: getFirstInt(source.numberOfPeople),
    income: getFloat(source.income),
    determinationDate: source.determinationDate,
    incomeNotDisclosed: source.incomeNotDisclosed || false,
    family,
  });
};

/**
 * Return value if it is a number, or pull numeric value
 * from string
 *
 * For cases when:
 * - errant characters/spaces result in invalid string (i.e. user accidentally prepends a '`')
 * - legacy ECIS value "9 or more" is entered
 * @param value
 */
const getFirstInt = (value: string | number) => {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const match = value.match(/\d+/);
    if (match) {
      return parseInt(match[0]);
    }
  }

  return undefined;
};

/**
 * Return value if it is a number, or string out all non-numeric
 * characters from a string.
 *
 * For when:
 * - excel formatting does not apply correctly to copy/pasted
 * numeric values, and they end up as strings with preceeding ' and commas
 * - users accidentially enter errant spaces in dollar amount
 * @param value
 */
const getFloat = (value: string | number) => {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    // strip out whitespace, dollar signs, commas
    const float = parseFloat(value.replace(/[\s\$,]/g, ''));
    if (!isNaN(float)) return float;
  }
  return undefined;
};
