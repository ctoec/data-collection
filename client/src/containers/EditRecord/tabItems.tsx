import {
  Info,
  TextWithIcon,
  TextWithIconProps,
} from '@ctoec/component-library';
import React from 'react';
import {
  FamilyIncomeForm,
  ChildInfoForm,
  ChildIdentifiersForm,
  FamilyAddressForm,
} from '../../components/Forms';
import { EnrollmentFundingForm } from './EnrollmentFunding/EnrollmentFunding';
import {
  SECTION_KEYS,
  formSections,
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
];

export const tabItems = (commonFormProps: EditFormProps) =>
  formSections.map(({ key, name, hasError }) => {
    const EditForm =
      editForms.find((e) => e.key === key)?.form || (() => <></>);
    return {
      id: key,
      content: <EditForm {...commonFormProps} />,
      tabText: name,
      tabTextFormatter: (_name: string) =>
        hasError(commonFormProps.child) ? (
          <TextWithIcon {...commonTextWithIconProps} text={_name} />
        ) : (
          _name
        ),
    };
  });
