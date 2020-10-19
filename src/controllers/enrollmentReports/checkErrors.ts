import { Child } from '../../entity';
import { getAllColumnMetadata } from '../../template';

export const checkErrorsInChildren = async (children: Child[]) => {
  const cols = getAllColumnMetadata();
  const propertyNameToFormattedName = {};
  let errorDict = {};
  cols.map((c) => {
    errorDict[c.propertyName] = 0;
    propertyNameToFormattedName[c.propertyName] = c.formattedName;
  });

  for (let i = 0; i < children.length; i++) {
    const errs = children[i].validationErrors;
    errs.map((e) => {
      errorDict[e.property] += 1;
    });
  }

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
