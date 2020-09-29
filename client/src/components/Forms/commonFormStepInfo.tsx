import {
  doesChildIdFormHaveErrors,
  doesChildInfoFormHaveErrors,
  doesEnrollmentFormHaveErrors,
  doesFamilyAddressFormHaveErrors,
  doesFamilyIncomeFormHaveErrors,
} from '.';
import { Child } from '../../shared/models';
import { doesC4kFormHaveErrors } from './CareForKids/Form';

export const TAB_IDS = {
  IDENT: 'identifiers',
  DEMO: 'demographics',
  FAMILY: 'family',
  INCOME: 'income',
  ENROLLMENT: 'enrollment',
  C4K: 'c4k',
};

export type FormStepInfo = {
  key: string,
  name: string,
  status: (child?: Child) => boolean,
}

export const commonFormStepInfo: FormStepInfo[] = [
  {
    key: TAB_IDS.IDENT,
    name: 'Child identifiers',
    status: doesChildIdFormHaveErrors
  },
  {
    key: TAB_IDS.DEMO,
    name: 'Child info',
    status: doesChildInfoFormHaveErrors,
  },
  {
    key: TAB_IDS.FAMILY,
    name: 'Family address',
    status: doesFamilyAddressFormHaveErrors,
  },
  {
    key: TAB_IDS.INCOME,
    name: 'Family income determination',
    status: doesFamilyIncomeFormHaveErrors,
  },
  {
    key: TAB_IDS.ENROLLMENT,
    name: 'Enrollment and funding',
    status: doesEnrollmentFormHaveErrors,
  },
  {
    // This is going away anyway
    key: TAB_IDS.C4K,
    name: 'Care 4 Kids',
    status: doesC4kFormHaveErrors,
  },
];
