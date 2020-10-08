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
  hasError: (child?: Child, itemId?: number) => boolean;
};

export const formSections: FormSectionInfo[] = [
  {
    key: SECTION_KEYS.IDENT,
    name: 'Child identifiers',
    hasError: doesChildIdFormHaveErrors,
  },
  {
    key: SECTION_KEYS.DEMO,
    name: 'Child info',
    hasError: doesChildInfoFormHaveErrors,
  },
  {
    key: SECTION_KEYS.FAMILY,
    name: 'Family address',
    hasError: doesFamilyAddressFormHaveErrors,
  },
  {
    key: SECTION_KEYS.INCOME,
    name: 'Family income',
    hasError: doesFamilyIncomeFormHaveErrors,
  },
  {
    key: SECTION_KEYS.ENROLLMENT,
    name: 'Enrollment and funding',
    hasError: doesEnrollmentFormHaveErrors,
  },
];
