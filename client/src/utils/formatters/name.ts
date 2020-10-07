import { Child } from '../../shared/models';

export const nameFormatter = (
  child: Child,
  opts?: { lastNameFirst?: boolean }
) => {
  opts = opts || { lastNameFirst: true };
  return opts.lastNameFirst
    ? `${child.lastName || ''}, ${child.firstName || ''}${
        child.suffix ? `, ${child.suffix}` : ''
      }`
    : `${child.firstName || ''}${
        child.middleName ? ` ${child.middleName}` : ''
      } ${child.lastName || ''}${child.suffix ? `, ${child.suffix}` : ''}`;
};
