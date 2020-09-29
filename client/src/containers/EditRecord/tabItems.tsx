import { Info, TextWithIcon, TextWithIconProps } from '@ctoec/component-library';
import React from 'react';
import {
  FamilyIncomeForm,
  ChildInfoForm,
  CareForKidsForm,
  EnrollmentFundingForm,
  ChildIdentifiersForm,
  doesChildIdFormHaveErrors,
  doesChildInfoFormHaveErrors,
  doesFamilyAddressFormHaveErrors,
  doesFamilyIncomeFormHaveErrors,
  doesEnrollmentFormHaveErrors,
  doesC4kFormHaveErrors,
  FamilyAddressForm,
} from '../../components/Forms';
import { EditFormProps } from '../../components/Forms/types';

export const TAB_IDS = {
  IDENT: 'identifiers',
  DEMO: 'demographics',
  FAMILY: 'family',
  INCOME: 'income',
  ENROLLMENT: 'enrollment',
  C4K: 'c4k',
};

const commonTextWithIconProps: Omit<TextWithIconProps, 'text'> = {
  Icon: Info,
  iconSide: 'right',
  className: 'svg-gold-20v',
};

export const tabItems = (commonFormProps: EditFormProps) => [
  {
    id: TAB_IDS.IDENT,
    text: doesChildIdFormHaveErrors(commonFormProps.child) ? (
      <TextWithIcon
        {...commonTextWithIconProps}
        text="Child identifiers"
      />
    ) : (
        'Child identifiers'
      ),
    content: <ChildIdentifiersForm {...commonFormProps} />,
  },
  {
    id: TAB_IDS.DEMO,
    text: doesChildInfoFormHaveErrors(commonFormProps.child) ? (
      <TextWithIcon {...commonTextWithIconProps} text="Child info" />
    ) : (
        'Child info'
      ),
    content: <ChildInfoForm {...commonFormProps} />,
  },
  {
    id: TAB_IDS.FAMILY,
    text: doesFamilyAddressFormHaveErrors(commonFormProps.child?.family) ? (
      <TextWithIcon
        {...commonTextWithIconProps}
        text="Family address"
      />
    ) : (
        'Family address'
      ),
    content: <FamilyAddressForm {...commonFormProps} />,
  },
  {
    id: TAB_IDS.INCOME,
    text: doesFamilyIncomeFormHaveErrors(commonFormProps.child?.family) ? (
      <TextWithIcon {...commonTextWithIconProps} text="Family income" />
    ) : (
        'Family income'
      ),
    content: <FamilyIncomeForm {...commonFormProps} />,
  },
  {
    id: TAB_IDS.ENROLLMENT,
    text: doesEnrollmentFormHaveErrors(commonFormProps.child) ? (
      <TextWithIcon
        {...commonTextWithIconProps}
        text="Enrollment and funding"
      />
    ) : (
        'Enrollment and funding'
      ),
    content: <EnrollmentFundingForm {...commonFormProps} />,
  },
  {
    id: TAB_IDS.C4K,
    text: doesC4kFormHaveErrors(commonFormProps.child) ? (
      <TextWithIcon {...commonTextWithIconProps} text="Care 4 Kids" />
    ) : (
        'Care 4 Kids'
      ),
    content: <CareForKidsForm {...commonFormProps} />,
  },
]