import { Child } from '../../entity';
import { ColumnMetadata } from '../../../client/src/shared/models';
import { getAllColumnMetadata } from '../../template';

/**
 * Receives an array of child objects created with a DB manager
 * and determines how many validation errors occur in each
 * possible field of the child schema.
 * @param children Array of DB-view child objects to analyze
 */
export const checkErrorsInChildren = async (children: Child[]) => {
  const cols: ColumnMetadata[] = getAllColumnMetadata();
  const propertyNameToFormattedName = {};
  let errorDict = {};

  // Start the count of each type of error at 0 overall
  cols.map((c) => {
    errorDict[c.propertyName] = 0;
    propertyNameToFormattedName[c.propertyName] = c.formattedName;
  });

  for (let i = 0; i < children.length; i++) {
    const errs = children[i].validationErrors;
    // Accumulate counts across all children (don't need to
    // differentiate errors by individual child)
    errs.map((e) => {
      errorDict[e.property] += 1;
    });
  }

  // Only need fields with error counts; send back a formated
  // object for tabular display
  const filteredKeys = Object.keys(errorDict).filter((k) => errorDict[k] > 0);
  const filteredErrors = filteredKeys.map((k) => {
    return {
      property: k,
      formattedName: propertyNameToFormattedName[k],
      count: errorDict[k],
    };
  });

  return filteredErrors;
};
