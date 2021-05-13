import { AlertProps } from "@ctoec/component-library";

export const getErrorMessage = (err: any, newOrgName: string) => {
  
  // 409 Resource conflict error if an org with given name already existed
  if (err.includes('exists')) {
    return [{
      type: 'error',
      heading: 'Organization already exists',
      text: `An organization with name "${newOrgName}" already exists.`
    }] as AlertProps[];
  }

  // Different 409 error if at least one site name is taken
  if (err.includes('site name')) {
    return [{
      type: 'error',
      heading: 'Site already exists',
      text: 'One or more sites specified already exists.'
    }] as AlertProps[];
  }
  return undefined;
}