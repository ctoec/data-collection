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
  commonFormStepInfo,
  TAB_IDS,
} from '../../components/Forms/commonFormStepInfo';
import { EditFormProps } from '../../components/Forms/types';

const commonTextWithIconProps: Omit<TextWithIconProps, 'text'> = {
  Icon: Info,
  iconSide: 'right',
  className: 'svg-gold-20v',
};

export const editForms = [
  { key: TAB_IDS.IDENT, form: ChildIdentifiersForm },
  { key: TAB_IDS.DEMO, form: ChildInfoForm },
  { key: TAB_IDS.FAMILY, form: FamilyAddressForm },
  { key: TAB_IDS.INCOME, form: FamilyIncomeForm },
  { key: TAB_IDS.ENROLLMENT, form: EnrollmentFundingForm },
  { key: TAB_IDS.C4K, form: CareForKidsForm },
];

export const tabItems = (commonFormProps: EditFormProps) =>
  commonFormStepInfo.map(({ key, name, status }) => {
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
