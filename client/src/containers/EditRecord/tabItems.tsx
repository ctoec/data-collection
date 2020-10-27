import {
  Info,
  TextWithIcon,
  TextWithIconProps,
} from '@ctoec/component-library';
import React from 'react';
import {
  ChildInfoForm,
  ChildIdentifiersForm,
  FamilyAddressForm,
} from '../../components/Forms';
import { EnrollmentFundingForm } from './EnrollmentFunding/Form';
import { FamilyIncomeForm } from './FamilyIncome/Form';
import {
  SECTION_KEYS,
  formSections,
} from '../../components/Forms/formSections';
import { RecordFormProps } from '../../components/Forms/types';

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

export const getTabItems = (commonFormProps: RecordFormProps) =>
  formSections.map(({ key, name, hasError }) => {
    return {
      id: key,
      tabText: name,
      tabTextFormatter: (_name: string) =>
        hasError(commonFormProps.child) ? (
          <TextWithIcon {...commonTextWithIconProps} text={_name} />
        ) : (
          _name
        ),
    };
  });

export const getTabContent = (
  activeTab: string,
  commonFormProps: RecordFormProps
) => {
  const EditForm =
    editForms.find((e) => e.key === activeTab)?.form || (() => <></>);
  return <EditForm {...commonFormProps} />;
};
