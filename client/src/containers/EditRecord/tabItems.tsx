import {
  Info,
  TextWithIcon,
  TextWithIconProps,
} from '@ctoec/component-library';
import React from 'react';
import {
  FamilyIncomeForm,
  ChildInfoForm,
  CareForKidsForm,
  EnrollmentFundingForm,
  ChildIdentifiersForm,
  FamilyAddressForm,
} from '../../components/Forms';
import {
  formSections,
  SECTION_KEYS,
} from '../../components/Forms/formSections';
import { EditFormProps } from '../../components/Forms/types';

const commonTextWithIconProps: Omit<TextWithIconProps, 'text'> = {
  Icon: Info,
  iconSide: 'right',
  className: 'svg-gold-20v',
};

export const editForms = [
  { key: SECTION_KEYS.IDENT, form: ChildIdentifiersForm },
  { key: SECTION_KEYS.DEMO, form: ChildInfoForm },
  { key: SECTION_KEYS.FAMILY, form: FamilyAddressForm },
  { key: SECTION_KEYS.INCOME, form: FamilyIncomeForm },
  { key: SECTION_KEYS.ENROLLMENT, form: EnrollmentFundingForm },
  { key: SECTION_KEYS.C4K, form: CareForKidsForm },
];

export const tabItems = (commonFormProps: EditFormProps) =>
  formSections.map(({ key, name, status }) => {
    const EditForm =
      editForms.find((e) => e.key === key)?.form || (() => <></>);
    return {
      id: key,
      text: status(commonFormProps.child) ? (
        <TextWithIcon {...commonTextWithIconProps} text={name} />
      ) : (
          name
        ),
      content: <EditForm {...commonFormProps} />,
    };
  });
