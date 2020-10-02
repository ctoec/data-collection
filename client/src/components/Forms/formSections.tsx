import {
  doesChildIdFormHaveErrors,
  doesChildInfoFormHaveErrors,
  doesEnrollmentFormHaveErrors,
  doesFamilyAddressFormHaveErrors,
  doesFamilyIncomeFormHaveErrors,
} from '.';
import { Child } from '../../shared/models';
import { doesC4kFormHaveErrors } from './CareForKids/Form';
import { doesSpecialCircumstancesFormHaveErrors } from './SpecialCircumstances/Form';

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
  status: (child?: Child) => boolean;
};

export const formSections: FormSectionInfo[] = [
  {
    key: SECTION_KEYS.IDENT,
    name: 'Child identifiers',
    status: doesChildIdFormHaveErrors,
  },
  {
    key: SECTION_KEYS.DEMO,
    name: 'Child info',
    status: doesChildInfoFormHaveErrors,
  },
  {
    key: SECTION_KEYS.FAMILY,
    name: 'Family address',
    status: doesFamilyAddressFormHaveErrors,
  },
  {
    key: SECTION_KEYS.INCOME,
    name: 'Family income',
    status: doesFamilyIncomeFormHaveErrors,
  },
  {
    key: SECTION_KEYS.ENROLLMENT,
    name: 'Enrollment and funding',
    status: doesEnrollmentFormHaveErrors,
  },
  {
    // This is going away anyway
    key: SECTION_KEYS.C4K,
    name: 'Care 4 Kids',
    status: doesC4kFormHaveErrors,
  },
  {
    key: SECTION_KEYS.SPECIAL,
    name: 'Special Circumstances',
    status: doesSpecialCircumstancesFormHaveErrors,
  },
];
