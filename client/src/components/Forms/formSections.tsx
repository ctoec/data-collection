import {
  doesChildIdFormHaveErrors,
  doesChildInfoFormHaveErrors,
  doesEnrollmentFormHaveErrors,
  doesFamilyAddressFormHaveErrors,
  doesFamilyIncomeFormHaveErrors,
} from '.';
import { Child } from '../../shared/models';

export const SECTION_KEYS = {
  IDENT: 'identifiers',
  DEMO: 'demographics',
  FAMILY: 'family',
  INCOME: 'income',
  ENROLLMENT: 'enrollment',
  C4K: 'c4k',
  SPECIAL: 'special',
};

export type FormSectionInfo = {
  key: string;
  name: string;
  hasErrors: (child?: Child) => boolean;
};

export const formSections: FormSectionInfo[] = [
  {
    key: SECTION_KEYS.IDENT,
    name: 'Child identifiers',
    hasErrors: doesChildIdFormHaveErrors,
  },
  {
    key: SECTION_KEYS.DEMO,
    name: 'Child info',
    hasErrors: doesChildInfoFormHaveErrors,
  },
  {
    key: SECTION_KEYS.FAMILY,
    name: 'Family address',
    hasErrors: doesFamilyAddressFormHaveErrors,
  },
  {
    key: SECTION_KEYS.INCOME,
    name: 'Family income',
    hasErrors: doesFamilyIncomeFormHaveErrors,
  },
  {
    key: SECTION_KEYS.ENROLLMENT,
    name: 'Enrollment and funding',
    hasErrors: doesEnrollmentFormHaveErrors,
  },
];
